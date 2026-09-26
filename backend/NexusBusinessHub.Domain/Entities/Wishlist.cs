namespace NexusBusinessHub.Domain.Entities;

public class Wishlist : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<WishlistItem> Items { get; set; } = new List<WishlistItem>();
}
