using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (IsCustomerUser())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied. Only administrators can create products." });
        }

        if (!ModelState.IsValid)
        {
            var errorMessages = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => !string.IsNullOrWhiteSpace(e.ErrorMessage) ? e.ErrorMessage : e.Exception?.Message)
                .Where(m => !string.IsNullOrWhiteSpace(m))
                .ToList();
            var combinedMessage = errorMessages.Count > 0
                ? string.Join("; ", errorMessages)
                : "One or more validation errors occurred.";
            return BadRequest(new { message = combinedMessage, errors = ModelState });
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
            return StatusCode(500, new { message = ex.Message ?? "An error occurred while creating the product." });
        }
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        if (IsCustomerUser())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied. Only administrators can update products." });
        }

        if (!ModelState.IsValid)
        {
            var errorMessages = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => !string.IsNullOrWhiteSpace(e.ErrorMessage) ? e.ErrorMessage : e.Exception?.Message)
                .Where(m => !string.IsNullOrWhiteSpace(m))
                .ToList();
            var combinedMessage = errorMessages.Count > 0
                ? string.Join("; ", errorMessages)
                : "One or more validation errors occurred.";
            return BadRequest(new { message = combinedMessage, errors = ModelState });
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

    [Authorize]
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateProductStatus(int id, [FromBody] UpdateProductStatusDto dto)
    {
        if (IsCustomerUser())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied. Only administrators can update product status." });
        }

        bool isActive = dto.IsActive ?? (dto.Status?.Equals("Active", StringComparison.OrdinalIgnoreCase) == true);

        try
        {
            var product = await _productService.UpdateStatusAsync(id, isActive);
            if (product is null)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating status for product with id {ProductId}.", id);
            return StatusCode(500, new { message = "An error occurred while updating the product status." });
        }
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        if (IsCustomerUser())
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied. Only administrators can delete products." });
        }

        try
        {
            var deleted = await _productService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(new { message = "Product deleted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting product with id {ProductId}.", id);
            return StatusCode(500, new { message = "An error occurred while deleting the product." });
        }
    }

    private bool IsCustomerUser()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return User.IsInRole("Customer") && !User.IsInRole("Admin") && !User.IsInRole("Manager");
        }
        return false;
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
