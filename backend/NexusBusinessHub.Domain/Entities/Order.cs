
namespace NexusBusinessHub.Domain.Entities;

public class Order
{
    public int Id { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; }

    public decimal Subtotal { get; set; }

    public decimal ShippingAmount { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public string PaymentStatus { get; set; } = "Pending";

    public string OrderStatus { get; set; } = "Placed";

    public int AddressId { get; set; }

    public Address? Address { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
        = new List<OrderItem>();

    public Payment? Payment { get; set; }

    public Shipment? Shipment { get; set; }
}

