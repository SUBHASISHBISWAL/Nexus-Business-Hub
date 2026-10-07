using NexusBusinessHub.Application.DTOs;

namespace NexusBusinessHub.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetPagedAsync(ProductQueryParameters parameters);

    Task<IEnumerable<ProductDto>> GetAllAsync(bool includeInactive = false);

    Task<ProductDto?> GetByIdAsync(int id, bool includeInactive = false);

    Task<ProductDto> CreateAsync(CreateProductDto dto);

    Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto);

    Task<bool> DeleteAsync(int id);

    Task<ProductDto?> UpdateStatusAsync(int id, bool isActive);

    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
}