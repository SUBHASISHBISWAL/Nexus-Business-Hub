using System.ComponentModel.DataAnnotations;

namespace NexusBusinessHub.Application.DTOs;

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Product name must be between 1 and 200 characters.")]
    public string Name { get; set; } = string.Empty;

    public string? Sku { get; set; }

    public string Description { get; set; } = string.Empty;

    [Range(0, 100000000, ErrorMessage = "Price must be a non-negative value.")]
    public decimal Price { get; set; }

    public string? Category { get; set; }

    public int? CategoryId { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
    public int StockQuantity { get; set; }

    [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5.")]
    public decimal? Rating { get; set; }

    public string? ImageUrl { get; set; }

    public bool? IsActive { get; set; } = true;

    public List<string>? Images { get; set; }
}
