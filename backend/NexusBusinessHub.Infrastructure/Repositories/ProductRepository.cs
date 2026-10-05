using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Domain.Entities;
using NexusBusinessHub.Infrastructure.Persistence;

namespace NexusBusinessHub.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ProductDto>> GetPagedAsync(ProductQueryParameters parameters)
    {
        var page = parameters.Page.GetValueOrDefault(1);
        if (page < 1) page = 1;

        var pageSize = parameters.PageSize.GetValueOrDefault(48);
        if (pageSize < 1) pageSize = 48;
        if (pageSize > 1000) pageSize = 1000;

        var query = _context.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(parameters.Status) &&
            !parameters.Status.Equals("All Status", StringComparison.OrdinalIgnoreCase) &&
            !parameters.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var status = parameters.Status.Trim().ToLowerInvariant();
            if (status == "active")
            {
                query = query.Where(p => p.IsActive && p.StockQuantity > 0);
            }
            else if (status == "inactive")
            {
                query = query.Where(p => !p.IsActive);
            }
            else if (status == "out of stock")
            {
                query = query.Where(p => p.StockQuantity == 0);
            }
            else if (status == "draft")
            {
                query = query.Where(p => false);
            }
        }
        else if (parameters.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == parameters.IsActive.Value);
        }
        else if (parameters.IncludeInactive != true)
        {
            query = query.Where(p => p.IsActive);
        }

        // Filter by Category
        if (!string.IsNullOrWhiteSpace(parameters.Category) &&
            !parameters.Category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var categories = parameters.Category
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            if (categories.Length == 1)
            {
                var categoryName = categories[0];
                query = query.Where(p => p.Category.Name == categoryName);
            }
            else if (categories.Length > 1)
            {
                query = query.Where(p => categories.Contains(p.Category.Name));
            }
        }

        // Filter by Search term
        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var term = parameters.Search.Trim();
            query = query.Where(p =>
                p.Name.Contains(term) ||
                p.Category.Name.Contains(term) ||
                p.Description.Contains(term) ||
                p.Id.ToString().Contains(term));
        }

        // Filter by Price range
        if (parameters.MinPrice.HasValue && parameters.MinPrice.Value > 0)
        {
            query = query.Where(p => p.Price >= parameters.MinPrice.Value);
        }

        if (parameters.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= parameters.MaxPrice.Value);
        }

        // Filter by Rating
        if (parameters.MinRating.HasValue && parameters.MinRating.Value > 0)
        {
            query = query.Where(p => p.Rating >= parameters.MinRating.Value);
        }

        // Sorting
        query = (parameters.SortBy?.ToLowerInvariant()) switch
        {
            "price-low" => query.OrderBy(p => p.Price).ThenByDescending(p => p.CreatedAt).ThenBy(p => p.Id),
            "price-high" => query.OrderByDescending(p => p.Price).ThenByDescending(p => p.CreatedAt).ThenBy(p => p.Id),
            "rating" => query.OrderByDescending(p => p.Rating).ThenByDescending(p => p.CreatedAt).ThenBy(p => p.Id),
            "newest" or "latest" => query.OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.Id),
            "featured" => query.OrderBy(p => p.Id),
            "oldest" => query.OrderBy(p => p.CreatedAt).ThenBy(p => p.Id),
            _ => query.OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.Id)
        };

        var totalItems = await query.CountAsync();

        if (parameters.All == true)
        {
            page = 1;
            pageSize = totalItems > 0 ? totalItems : 48;
        }

        var totalPages = totalItems > 0
            ? (int)Math.Ceiling(totalItems / (double)pageSize)
            : 0;

        List<ProductDto> items;
        if (totalItems == 0)
        {
            items = new List<ProductDto>();
        }
        else
        {
            items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Image = p.ImageUrl,
                    ImageUrl = p.ImageUrl,
                    Images = new List<string> { p.ImageUrl },
                    Category = p.Category.Name,
                    CategoryId = p.CategoryId,
                    Rating = p.Rating,
                    StockQuantity = p.StockQuantity,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();
        }

        var categoryCounts = await _context.Categories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .Select(c => new
            {
                c.Name,
                Count = c.Products.Count(p => p.IsActive)
            })
            .ToDictionaryAsync(x => x.Name, x => x.Count);

        int? activeCount = null;
        int? outOfStockCount = null;
        int? draftCount = null;

        if (parameters.IncludeInactive == true)
        {
            var counts = await _context.Products
                .AsNoTracking()
                .Where(p => p.IsActive)
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Active = g.Count(p => p.StockQuantity > 0),
                    OutOfStock = g.Count(p => p.StockQuantity == 0)
                })
                .FirstOrDefaultAsync();

            activeCount = counts?.Active ?? 0;
            outOfStockCount = counts?.OutOfStock ?? 0;
            draftCount = 0;
        }

        return new PagedResult<ProductDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            CategoryCounts = categoryCounts,
            ActiveCount = activeCount,
            OutOfStockCount = outOfStockCount,
            DraftCount = draftCount
        };
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(bool includeInactive = false)
    {
        var query = _context.Products.AsNoTracking();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive);
        }

        return await query
            .OrderBy(p => p.Id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Image = p.ImageUrl,
                ImageUrl = p.ImageUrl,
                Images = new List<string> { p.ImageUrl },
                Category = p.Category.Name,
                CategoryId = p.CategoryId,
                Rating = p.Rating,
                StockQuantity = p.StockQuantity,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id, bool includeInactive = false)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive);
        }

        return await query.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product?> GetEntityByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Category?> GetCategoryByNameOrIdAsync(string? name, int? id)
    {
        if (id.HasValue && id.Value > 0)
        {
            var catById = await _context.Categories.FindAsync(id.Value);
            if (catById != null) return catById;
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            var trimmedName = name.Trim();
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == trimmedName.ToLower());
        }

        return null;
    }

    public async Task<Category> EnsureCategoryAsync(string name)
    {
        var trimmedName = name.Trim();
        var existing = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == trimmedName.ToLower());
        if (existing != null) return existing;

        var now = DateTime.UtcNow;
        var category = new Category
        {
            Name = trimmedName,
            Description = $"{trimmedName} products",
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ProductCount = c.Products.Count(p => p.IsActive)
            })
            .ToListAsync();
    }
}