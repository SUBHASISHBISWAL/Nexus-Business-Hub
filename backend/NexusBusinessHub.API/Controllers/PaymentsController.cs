using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Infrastructure.Data;

namespace NexusBusinessHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentsController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // PROCESS PAYMENT
    // =========================================================

    [HttpPost("process")]
    public async Task<IActionResult> ProcessPayment(
        [FromBody] ProcessPaymentRequest request)
    {
        if (request.OrderId <= 0)
        {
            return BadRequest(new
            {
                message = "Valid Order ID is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.PaymentMethod))
        {
            return BadRequest(new
            {
                message = "Payment method is required."
            });
        }

        var order = await _context.Orders
            .Include(o => o.Payment)
            .Include(o => o.Shipment)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        if (order.Payment == null)
        {
            return BadRequest(new
            {
                message = "Payment record not found for this order."
            });
        }

        // -----------------------------------------------------
        // ALREADY PAID
        // -----------------------------------------------------

        if (
            order.PaymentStatus.Equals(
                "Paid",
                StringComparison.OrdinalIgnoreCase
            )
        )
        {
            return Ok(new
            {
                success = true,
                message = "Payment is already completed.",

                orderId = order.Id,
                orderNumber = order.OrderNumber,

                paymentStatus = order.PaymentStatus,

                transactionId =
                    order.Payment.TransactionId,

                amount = order.TotalAmount,

                paymentMethod =
                    order.Payment.PaymentMethod
            });
        }

        // -----------------------------------------------------
        // UPDATE PAYMENT
        // -----------------------------------------------------

        var transactionId =
            $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}";

        order.Payment.PaymentMethod =
            request.PaymentMethod;

        order.Payment.TransactionId =
            transactionId;

        order.Payment.PaymentStatus =
            "Paid";

        order.Payment.Amount =
            order.TotalAmount;

        order.Payment.PaymentDate =
            DateTime.Now;

        // -----------------------------------------------------
        // UPDATE ORDER
        // -----------------------------------------------------

        order.PaymentStatus = "Paid";

        order.OrderStatus = "Placed";

        // -----------------------------------------------------
        // SHIPMENT
        // -----------------------------------------------------

        if (order.Shipment == null)
        {
            var trackingNumber =
                $"NX{Random.Shared.Next(10000000, 99999999)}";

            order.Shipment = new Domain.Entities.Shipment
            {
                OrderId = order.Id,

                TrackingNumber = trackingNumber,

                Carrier = "Nexus Logistics",

                ShipmentStatus = "Order Placed",

                EstimatedDeliveryDate =
                    DateTime.Now.Date.AddDays(5)
            };
        }
        else
        {
            order.Shipment.ShipmentStatus =
                "Order Placed";
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,

            message = "Payment completed successfully.",

            orderId = order.Id,

            orderNumber = order.OrderNumber,

            paymentStatus = order.PaymentStatus,

            transactionId =
                order.Payment.TransactionId,

            paymentMethod =
                order.Payment.PaymentMethod,

            amount = order.TotalAmount,

            paymentDate =
                order.Payment.PaymentDate,

            shipment = order.Shipment == null
                ? null
                : new
                {
                    order.Shipment.TrackingNumber,
                    order.Shipment.Carrier,
                    order.Shipment.ShipmentStatus,
                    order.Shipment.EstimatedDeliveryDate
                }
        });
    }

    // =========================================================
    // GET PAYMENT BY ORDER ID
    // =========================================================

    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetPayment(int orderId)
    {
        var payment = await _context.Payments
            .AsNoTracking()
            .Where(p => p.OrderId == orderId)
            .Select(p => new
            {
                p.Id,
                p.OrderId,
                p.PaymentMethod,
                p.TransactionId,
                p.PaymentStatus,
                p.Amount,
                p.PaymentDate
            })
            .FirstOrDefaultAsync();

        if (payment == null)
        {
            return NotFound(new
            {
                message = "Payment not found."
            });
        }

        return Ok(payment);
    }
}

// =============================================================
// REQUEST
// =============================================================

public class ProcessPaymentRequest
{
    public int OrderId { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;
}