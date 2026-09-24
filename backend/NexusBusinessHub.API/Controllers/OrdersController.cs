using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Domain.Entities;
using NexusBusinessHub.Infrastructure.Data;

namespace NexusBusinessHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET ALL ORDERS
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Address)
            .Include(o => o.OrderItems)
            .Include(o => o.Payment)
            .Include(o => o.Shipment)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.OrderDate,
                o.Subtotal,
                o.ShippingAmount,
                o.DiscountAmount,
                o.TaxAmount,
                o.TotalAmount,
                o.PaymentStatus,
                o.OrderStatus,

                Address = o.Address == null
                    ? null
                    : new
                    {
                        o.Address.Id,
                        o.Address.FullName,
                        o.Address.Phone,
                        o.Address.AddressLine,
                        o.Address.City,
                        o.Address.State,
                        o.Address.Pincode
                    },

                OrderItems = o.OrderItems.Select(item => new
                {
                    item.Id,
                    item.ProductId,
                    item.ProductName,
                    item.ProductImage,
                    item.UnitPrice,
                    item.Quantity,
                    item.TotalPrice
                }),

                Payment = o.Payment == null
                    ? null
                    : new
                    {
                        o.Payment.Id,
                        o.Payment.PaymentMethod,
                        o.Payment.TransactionId,
                        o.Payment.PaymentStatus,
                        o.Payment.Amount,
                        o.Payment.PaymentDate
                    },

                Shipment = o.Shipment == null
                    ? null
                    : new
                    {
                        o.Shipment.Id,
                        o.Shipment.TrackingNumber,
                        o.Shipment.Carrier,
                        o.Shipment.ShipmentStatus,
                        o.Shipment.ShippedDate,
                        o.Shipment.EstimatedDeliveryDate,
                        o.Shipment.DeliveredDate
                    }
            })
            .ToListAsync();

        return Ok(orders);
    }

    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.Address)
            .Include(o => o.OrderItems)
            .Include(o => o.Payment)
            .Include(o => o.Shipment)
            .Where(o => o.Id == id)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.OrderDate,
                o.Subtotal,
                o.ShippingAmount,
                o.DiscountAmount,
                o.TaxAmount,
                o.TotalAmount,
                o.PaymentStatus,
                o.OrderStatus,

                Address = o.Address == null
                    ? null
                    : new
                    {
                        o.Address.Id,
                        o.Address.FullName,
                        o.Address.Phone,
                        o.Address.AddressLine,
                        o.Address.City,
                        o.Address.State,
                        o.Address.Pincode
                    },

                OrderItems = o.OrderItems.Select(item => new
                {
                    item.Id,
                    item.ProductId,
                    item.ProductName,
                    item.ProductImage,
                    item.UnitPrice,
                    item.Quantity,
                    item.TotalPrice
                }),

                Payment = o.Payment == null
                    ? null
                    : new
                    {
                        o.Payment.Id,
                        o.Payment.PaymentMethod,
                        o.Payment.TransactionId,
                        o.Payment.PaymentStatus,
                        o.Payment.Amount,
                        o.Payment.PaymentDate
                    },

                Shipment = o.Shipment == null
                    ? null
                    : new
                    {
                        o.Shipment.Id,
                        o.Shipment.TrackingNumber,
                        o.Shipment.Carrier,
                        o.Shipment.ShipmentStatus,
                        o.Shipment.ShippedDate,
                        o.Shipment.EstimatedDeliveryDate,
                        o.Shipment.DeliveredDate
                    }
            })
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        return Ok(order);
    }

    // =========================================================
    // CREATE ORDER
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        [FromBody] CreateOrderRequest request)
    {
        if (request.Items == null || request.Items.Count == 0)
        {
            return BadRequest(new
            {
                message = "Order must contain at least one item."
            });
        }

        if (request.Address == null)
        {
            return BadRequest(new
            {
                message = "Delivery address is required."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            // -------------------------------------------------
            // ADDRESS
            // -------------------------------------------------

            var address = new Address
            {
                FullName = request.Address.FullName,
                Phone = request.Address.Phone,
                AddressLine = request.Address.AddressLine,
                City = request.Address.City,
                State = request.Address.State,
                Pincode = request.Address.Pincode
            };

            _context.Addresses.Add(address);

            await _context.SaveChangesAsync();

            // -------------------------------------------------
            // ORDER NUMBER
            // -------------------------------------------------

            var orderNumber =
                $"ORD-{DateTime.Now:yyyyMMddHHmmss}";

            // -------------------------------------------------
            // ORDER
            // -------------------------------------------------

            var order = new Order
            {
                OrderNumber = orderNumber,
                OrderDate = DateTime.Now,

                Subtotal = request.Subtotal,
                ShippingAmount = request.ShippingAmount,
                DiscountAmount = request.DiscountAmount,
                TaxAmount = request.TaxAmount,
                TotalAmount = request.TotalAmount,

                PaymentStatus = "Pending",
                OrderStatus = "Placed",

                AddressId = address.Id
            };

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            // -------------------------------------------------
            // ORDER ITEMS
            // -------------------------------------------------

            foreach (var item in request.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,

                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    ProductImage = item.ProductImage,

                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,

                    TotalPrice =
                        item.UnitPrice * item.Quantity
                };

                _context.OrderItems.Add(orderItem);
            }

            await _context.SaveChangesAsync();

            // -------------------------------------------------
            // PAYMENT - PENDING
            // -------------------------------------------------

            var payment = new Payment
            {
                OrderId = order.Id,

                PaymentMethod =
                    string.IsNullOrWhiteSpace(request.PaymentMethod)
                        ? "Pending"
                        : request.PaymentMethod,

                TransactionId = string.Empty,

                PaymentStatus = "Pending",

                Amount = request.TotalAmount,

                PaymentDate = DateTime.Now
            };

            _context.Payments.Add(payment);

            // -------------------------------------------------
            // SHIPMENT
            // -------------------------------------------------

            var random = new Random();

            var trackingNumber =
                $"NX{random.Next(10000000, 99999999)}";

            var shipment = new Shipment
            {
                OrderId = order.Id,

                TrackingNumber = trackingNumber,

                Carrier = "Nexus Logistics",

                ShipmentStatus = "Order Placed",

                ShippedDate = null,

                EstimatedDeliveryDate =
                    DateTime.Now.Date.AddDays(5),

                DeliveredDate = null
            };

            _context.Shipments.Add(shipment);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return CreatedAtAction(
                nameof(GetOrder),
                new { id = order.Id },
                new
                {
                    order.Id,
                    order.OrderNumber,
                    order.OrderDate,
                    order.Subtotal,
                    order.ShippingAmount,
                    order.DiscountAmount,
                    order.TaxAmount,
                    order.TotalAmount,
                    order.PaymentStatus,
                    order.OrderStatus,

                    Address = new
                    {
                        address.Id,
                        address.FullName,
                        address.Phone,
                        address.AddressLine,
                        address.City,
                        address.State,
                        address.Pincode
                    },

                    Items = request.Items,

                    Payment = new
                    {
                        payment.Id,
                        payment.PaymentMethod,
                        payment.TransactionId,
                        payment.PaymentStatus,
                        payment.Amount,
                        payment.PaymentDate
                    },

                    Shipment = new
                    {
                        shipment.Id,
                        shipment.TrackingNumber,
                        shipment.Carrier,
                        shipment.ShipmentStatus,
                        shipment.ShippedDate,
                        shipment.EstimatedDeliveryDate,
                        shipment.DeliveredDate
                    }
                }
            );
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();

            return StatusCode(500, new
            {
                message = "Failed to create order.",
                error = ex.Message
            });
        }
    }
}

// =============================================================
// REQUEST MODELS
// =============================================================

public class CreateOrderRequest
{
    public decimal Subtotal { get; set; }

    public decimal ShippingAmount { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public string PaymentMethod { get; set; } = "Pending";

    public CreateAddressRequest Address { get; set; } = new();

    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateAddressRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string AddressLine { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string Pincode { get; set; } = string.Empty;
}

public class CreateOrderItemRequest
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string ProductImage { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }
}