using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Mappings;

public static class ProductMapping
{
    public static ProductDto ToDto(this Product product)
    {
        var imageList = product.Images != null && product.Images.Count > 0
            ? product.Images
                .OrderBy(img => img.DisplayOrder)
                .Select(img => img.ImageUrl)
                .Where(url => !string.IsNullOrWhiteSpace(url))
                .ToList()
            : new List<string>();

        var primaryImage = !string.IsNullOrWhiteSpace(product.ImageUrl)
            ? product.ImageUrl
            : product.Images?.FirstOrDefault(img => img.IsPrimary)?.ImageUrl
              ?? imageList.FirstOrDefault()
              ?? string.Empty;

        if (imageList.Count == 0 && !string.IsNullOrWhiteSpace(primaryImage))
        {
            imageList.Add(primaryImage);
        }

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Image = primaryImage,
            Images = imageList,
            Category = product.Category?.Name ?? string.Empty,
            Rating = product.Rating,
            StockQuantity = product.StockQuantity,
            IsActive = product.IsActive
        };
    }
}