namespace NexusBusinessHub.Domain.Entities;

public class Payment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public string TransactionId { get; set; } = string.Empty;

    public string PaymentStatus { get; set; } = "Pending";

    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }
}