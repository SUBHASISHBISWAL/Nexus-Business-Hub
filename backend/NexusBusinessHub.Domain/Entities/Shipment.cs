namespace NexusBusinessHub.Domain.Entities;

public class Shipment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public string Carrier { get; set; } = string.Empty;

    public string ShipmentStatus { get; set; } = "Order Placed";

    public DateTime? ShippedDate { get; set; }

    public DateTime? EstimatedDeliveryDate { get; set; }

    public DateTime? DeliveredDate { get; set; }
}