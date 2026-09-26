using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Application.Mappings;

namespace NexusBusinessHub.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _repository.GetAllAsync();

        return products
            .Select(product => product.ToDto())
            .ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _repository.GetByIdAsync(id);

        return product?.ToDto();
    }
}