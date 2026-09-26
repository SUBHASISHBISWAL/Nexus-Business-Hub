namespace NexusBusinessHub.Application.DTOs;

public class ProductDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    // Main/listing image
    public string Image { get; set; } = string.Empty;

    // Four product-detail images
    public List<string> Images { get; set; } = new();

    public string Category { get; set; } = string.Empty;

    public decimal Rating { get; set; }

    public int StockQuantity { get; set; }

    public bool IsActive { get; set; }
}