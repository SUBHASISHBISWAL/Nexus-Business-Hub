namespace NexusBusinessHub.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public decimal Rating { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
