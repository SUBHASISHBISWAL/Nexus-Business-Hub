using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Interfaces;

public interface IProductRepository
{
    Task<PagedResult<ProductDto>> GetPagedAsync(ProductQueryParameters parameters);

    Task<IEnumerable<ProductDto>> GetAllAsync(bool includeInactive = false);

    Task<Product?> GetByIdAsync(int id, bool includeInactive = false);

    Task<Product?> GetEntityByIdAsync(int id);

    Task<Product> CreateAsync(Product product);

    Task<Product> UpdateAsync(Product product);

    Task<bool> DeleteAsync(int id);

    Task<Category?> GetCategoryByNameOrIdAsync(string? name, int? id);

    Task<Category> EnsureCategoryAsync(string name);

    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
}