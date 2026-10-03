using Microsoft.AspNetCore.Mvc;
using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Application.Interfaces;

namespace NexusBusinessHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductQueryParameters parameters)
    {
        try
        {
            var result = await _productService.GetPagedAsync(parameters);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching products.");
            return StatusCode(500, new { message = "An error occurred while retrieving products." });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProduct(int id, [FromQuery] bool includeInactive = false)
    {
        try
        {
            var product = await _productService.GetByIdAsync(id, includeInactive);

            if (product is null)
            {
                return NotFound(new
                {
                    message = "Product not found"
                });
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching product with id {ProductId}.", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the product." });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var product = await _productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating product.");
            return StatusCode(500, new { message = "An error occurred while creating the product." });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var product = await _productService.UpdateAsync(id, dto);
            if (product is null)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating product with id {ProductId}.", id);
            return StatusCode(500, new { message = "An error occurred while updating the product." });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            var deleted = await _productService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(new { message = "Product deactivated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting product with id {ProductId}.", id);
            return StatusCode(500, new { message = "An error occurred while deleting the product." });
        }
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var categories = await _productService.GetCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching categories.");
            return StatusCode(500, new { message = "An error occurred while retrieving categories." });
        }
    }
}
