using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();

    Task<Product?> GetByIdAsync(int id);
}