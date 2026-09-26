using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Mappings;

public static class ProductMapping
{
    public static ProductDto ToDto(this Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Image = product.ImageUrl,
            Images = product.Images != null && product.Images.Count > 0
                ? product.Images
                    .OrderBy(img => img.DisplayOrder)
                    .Select(img => img.ImageUrl)
                    .ToList()
                : new List<string>(),
            Category = product.Category?.Name ?? string.Empty,
            Rating = product.Rating,
            StockQuantity = product.StockQuantity,
            IsActive = product.IsActive
        };
    }
}