namespace NexusBusinessHub.Domain.Entities;

public class SupportTicket : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "Open";
}
