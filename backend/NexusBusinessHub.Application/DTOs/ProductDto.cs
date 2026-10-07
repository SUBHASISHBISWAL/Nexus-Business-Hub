namespace NexusBusinessHub.Application.DTOs;

public class ProductDto
{
    private string? _sku;

    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Sku
    {
        get
        {
            if (!string.IsNullOrWhiteSpace(_sku))
            {
                return _sku;
            }

            var cat = string.IsNullOrWhiteSpace(Category)
                ? "GEN"
                : (Category.Length >= 3 ? Category.Substring(0, 3) : Category).ToUpperInvariant();

            return $"NEX-{cat}-{Id:D3}";
        }
        set => _sku = value;
    }

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    // Main/listing image
    public string Image { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    // Four product-detail images
    public List<string> Images { get; set; } = new();

    public string Category { get; set; } = string.Empty;

    public string CategoryName => Category;

    public int? CategoryId { get; set; }

    public decimal Rating { get; set; }

    public int StockQuantity { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}