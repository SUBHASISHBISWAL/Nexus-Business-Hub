namespace NexusBusinessHub.Domain.Entities;

public class SearchHistory : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Query { get; set; } = string.Empty;
    public DateTime SearchedAt { get; set; }
}
