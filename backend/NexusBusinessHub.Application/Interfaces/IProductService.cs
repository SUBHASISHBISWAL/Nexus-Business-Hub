using NexusBusinessHub.Application.DTOs;

namespace NexusBusinessHub.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync();

    Task<ProductDto?> GetByIdAsync(int id);
}