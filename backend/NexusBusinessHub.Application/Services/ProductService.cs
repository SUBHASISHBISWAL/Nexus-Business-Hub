using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Application.Mappings;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<ProductDto>> GetPagedAsync(ProductQueryParameters parameters)
    {
        return await _repository.GetPagedAsync(parameters);
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(bool includeInactive = false)
    {
        return await _repository.GetAllAsync(includeInactive);
    }

    public async Task<ProductDto?> GetByIdAsync(int id, bool includeInactive = false)
    {
        var product = await _repository.GetByIdAsync(id, includeInactive);
        return product?.ToDto();
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Product name is required.");
        }

        if (dto.Price < 0)
        {
            throw new ArgumentException("Price cannot be negative.");
        }

        if (dto.StockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative.");
        }

        // Resolve Category
        var category = await _repository.GetCategoryByNameOrIdAsync(dto.Category, dto.CategoryId);
        if (category == null)
        {
            if (!string.IsNullOrWhiteSpace(dto.Category))
            {
                category = await _repository.EnsureCategoryAsync(dto.Category);
            }
            else
            {
                category = await _repository.EnsureCategoryAsync("Electronics");
            }
        }

        var imageUrl = dto.ImageUrl?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(imageUrl) && dto.Images != null && dto.Images.Count > 0)
        {
            imageUrl = dto.Images.FirstOrDefault(url => !string.IsNullOrWhiteSpace(url))?.Trim() ?? string.Empty;
        }

        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";
        }

        var now = DateTime.UtcNow;

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Sku = dto.Sku?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            Price = dto.Price,
            ImageUrl = imageUrl,
            CategoryId = category.Id,
            Category = category,
            Rating = dto.Rating.HasValue ? Math.Clamp(dto.Rating.Value, 0, 5) : 5.0m,
            StockQuantity = dto.StockQuantity,
            IsActive = dto.IsActive ?? true,
            CreatedAt = now,
            UpdatedAt = now
        };

        // Add images if provided
        if (dto.Images != null && dto.Images.Count > 0)
        {
            int order = 1;
            foreach (var imgUrl in dto.Images.Where(u => !string.IsNullOrWhiteSpace(u)))
            {
                product.Images.Add(new ProductImage
                {
                    ImageUrl = imgUrl.Trim(),
                    DisplayOrder = order,
                    IsPrimary = order == 1,
                    CreatedAt = now,
                    UpdatedAt = now
                });
                order++;
            }
        }
        else if (!string.IsNullOrWhiteSpace(imageUrl))
        {
            product.Images.Add(new ProductImage
            {
                ImageUrl = imageUrl,
                DisplayOrder = 1,
                IsPrimary = true,
                CreatedAt = now,
                UpdatedAt = now
            });
        }

        var created = await _repository.CreateAsync(product);
        if (string.IsNullOrWhiteSpace(created.Sku))
        {
            var catName = category.Name.Length >= 3 ? category.Name.Substring(0, 3) : category.Name;
            created.Sku = $"NEX-{catName.ToUpperInvariant()}-{created.Id:D3}";
            await _repository.UpdateAsync(created);
        }
        created.Category = category;
        return created.ToDto();
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Product name is required.");
        }

        if (dto.Price < 0)
        {
            throw new ArgumentException("Price cannot be negative.");
        }

        if (dto.StockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative.");
        }

        var product = await _repository.GetEntityByIdAsync(id);
        if (product == null)
        {
            return null;
        }

        // Update Category if changed
        if (dto.CategoryId.HasValue || !string.IsNullOrWhiteSpace(dto.Category))
        {
            var category = await _repository.GetCategoryByNameOrIdAsync(dto.Category, dto.CategoryId);
            if (category == null && !string.IsNullOrWhiteSpace(dto.Category))
            {
                category = await _repository.EnsureCategoryAsync(dto.Category);
            }

            if (category != null)
            {
                product.CategoryId = category.Id;
                product.Category = category;
            }
        }

        product.Name = dto.Name.Trim();
        product.Description = dto.Description?.Trim() ?? string.Empty;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;

        if (dto.Rating.HasValue)
        {
            product.Rating = Math.Clamp(dto.Rating.Value, 0, 5);
        }

        if (dto.IsActive.HasValue)
        {
            product.IsActive = dto.IsActive.Value;
        }

        var newImageUrl = dto.ImageUrl?.Trim();
        if (!string.IsNullOrWhiteSpace(newImageUrl))
        {
            product.ImageUrl = newImageUrl;
        }
        else if (dto.Images != null && dto.Images.Count > 0)
        {
            var firstImg = dto.Images.FirstOrDefault(u => !string.IsNullOrWhiteSpace(u))?.Trim();
            if (!string.IsNullOrWhiteSpace(firstImg))
            {
                product.ImageUrl = firstImg;
            }
        }

        var now = DateTime.UtcNow;
        product.UpdatedAt = now;

        // If updated images provided
        if (dto.Images != null && dto.Images.Count > 0)
        {
            product.Images.Clear();
            int order = 1;
            foreach (var imgUrl in dto.Images.Where(u => !string.IsNullOrWhiteSpace(u)))
            {
                product.Images.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = imgUrl.Trim(),
                    DisplayOrder = order,
                    IsPrimary = order == 1,
                    CreatedAt = now,
                    UpdatedAt = now
                });
                order++;
            }
        }
        else if (!string.IsNullOrWhiteSpace(product.ImageUrl))
        {
            var primaryImage = product.Images.FirstOrDefault(i => i.IsPrimary);
            if (primaryImage != null)
            {
                primaryImage.ImageUrl = product.ImageUrl;
                primaryImage.UpdatedAt = now;
            }
            else if (product.Images.Count == 0)
            {
                product.Images.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = product.ImageUrl,
                    DisplayOrder = 1,
                    IsPrimary = true,
                    CreatedAt = now,
                    UpdatedAt = now
                });
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.Sku))
        {
            product.Sku = dto.Sku.Trim();
        }

        var updated = await _repository.UpdateAsync(product);
        return updated.ToDto();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<ProductDto?> UpdateStatusAsync(int id, bool isActive)
    {
        var product = await _repository.UpdateStatusAsync(id, isActive);
        return product?.ToDto();
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        return await _repository.GetCategoriesAsync();
    }
}