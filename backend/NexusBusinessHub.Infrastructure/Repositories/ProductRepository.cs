
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

    public async Task<PagedResult<ProductDto>> GetPagedAsync(
        ProductQueryParameters parameters)
    {
        var page = parameters.Page.GetValueOrDefault(1);

        if (page < 1)
        {
            page = 1;
        }

        var pageSize = parameters.PageSize.GetValueOrDefault(48);

        if (pageSize < 1)
        {
            pageSize = 48;
        }

        if (pageSize > 1000)
        {
            pageSize = 1000;
        }

        IQueryable<Product> query = _context.Products
            .AsNoTracking();

        // =========================================================
        // STATUS / ACTIVE FILTER
        // =========================================================

        if (!string.IsNullOrWhiteSpace(parameters.Status) &&
            !parameters.Status.Equals(
                "All Status",
                StringComparison.OrdinalIgnoreCase) &&
            !parameters.Status.Equals(
                "All",
                StringComparison.OrdinalIgnoreCase))
        {
            var status = parameters.Status
                .Trim()
                .ToLowerInvariant();

            switch (status)
            {
                case "active":
                    query = query.Where(p =>
                        p.IsActive &&
                        p.StockQuantity > 0);
                    break;

                case "inactive":
                    query = query.Where(p =>
                        !p.IsActive);
                    break;

                case "out of stock":
                    query = query.Where(p =>
                        p.StockQuantity == 0);
                    break;

                case "draft":
                    // There is currently no Draft field
                    // in Product entity.
                    query = query.Where(p => false);
                    break;
            }
        }
        else if (parameters.IsActive.HasValue)
        {
            query = query.Where(p =>
                p.IsActive == parameters.IsActive.Value);
        }
        else if (parameters.IncludeInactive != true)
        {
            query = query.Where(p =>
                p.IsActive);
        }

        // =========================================================
        // CATEGORY FILTER
        // =========================================================

        if (!string.IsNullOrWhiteSpace(parameters.Category) &&
            !parameters.Category.Equals(
                "All",
                StringComparison.OrdinalIgnoreCase))
        {
            var categories = parameters.Category
                .Split(
                    ',',
                    StringSplitOptions.RemoveEmptyEntries |
                    StringSplitOptions.TrimEntries);

            if (categories.Length == 1)
            {
                var categoryName = categories[0];

                query = query.Where(p =>
                    p.Category.Name == categoryName);
            }
            else if (categories.Length > 1)
            {
                query = query.Where(p =>
                    categories.Contains(p.Category.Name));
            }
        }

        // =========================================================
        // SEARCH FILTER
        // =========================================================

        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var term = parameters.Search.Trim();

            query = query.Where(p =>
                p.Sku.Contains(term) ||
                p.Name.Contains(term) ||
                p.Category.Name.Contains(term) ||
                p.Description.Contains(term) ||
                p.Id.ToString().Contains(term));
        }

        // =========================================================
        // PRICE FILTER
        // =========================================================

        if (parameters.MinPrice.HasValue &&
            parameters.MinPrice.Value > 0)
        {
            query = query.Where(p =>
                p.Price >= parameters.MinPrice.Value);
        }

        if (parameters.MaxPrice.HasValue)
        {
            query = query.Where(p =>
                p.Price <= parameters.MaxPrice.Value);
        }

        // =========================================================
        // RATING FILTER
        // =========================================================

        if (parameters.MinRating.HasValue &&
            parameters.MinRating.Value > 0)
        {
            query = query.Where(p =>
                p.Rating >= parameters.MinRating.Value);
        }

        // =========================================================
        // SORTING
        // =========================================================

        var sortBy = parameters.SortBy?
            .Trim()
            .ToLowerInvariant();

        query = sortBy switch
        {
            "price-low" =>
                query
                    .OrderBy(p => p.Price)
                    .ThenByDescending(p => p.CreatedAt)
                    .ThenBy(p => p.Id),

            "price-high" =>
                query
                    .OrderByDescending(p => p.Price)
                    .ThenByDescending(p => p.CreatedAt)
                    .ThenBy(p => p.Id),

            "rating" =>
                query
                    .OrderByDescending(p => p.Rating)
                    .ThenByDescending(p => p.CreatedAt)
                    .ThenBy(p => p.Id),

            "newest" or "latest" =>
                query
                    .OrderByDescending(p => p.CreatedAt)
                    .ThenByDescending(p => p.Id),

            "featured" =>
                query
                    .OrderBy(p => p.Id),

            "oldest" =>
                query
                    .OrderBy(p => p.CreatedAt)
                    .ThenBy(p => p.Id),

            _ =>
                query
                    .OrderByDescending(p => p.CreatedAt)
                    .ThenByDescending(p => p.Id)
        };

        // =========================================================
        // TOTAL ITEMS
        // =========================================================

        var totalItems = await query.CountAsync();

        // =========================================================
        // ALL RECORDS REQUEST
        // =========================================================

        if (parameters.All == true)
        {
            page = 1;

            pageSize = totalItems > 0
                ? totalItems
                : 48;
        }

        // =========================================================
        // TOTAL PAGES
        // =========================================================

        var totalPages = totalItems > 0
            ? (int)Math.Ceiling(
                totalItems / (double)pageSize)
            : 0;

        // =========================================================
        // PAGINATED PRODUCTS
        // =========================================================

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
                    Sku = !string.IsNullOrWhiteSpace(p.Sku) ? p.Sku : string.Empty,
                    Description = p.Description,
                    Price = p.Price,
                    Image = p.ImageUrl,
                    ImageUrl = p.ImageUrl,
                    Images = new List<string>
                    {
                        p.ImageUrl
                    },
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

        // =========================================================
        // CATEGORY COUNTS
        // =========================================================

        var categoryCounts = await _context.Categories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .Select(c => new
            {
                c.Name,
                Count = parameters.IncludeInactive == true
                    ? c.Products.Count()
                    : c.Products.Count(p => p.IsActive)
            })
            .ToDictionaryAsync(
                x => x.Name,
                x => x.Count);

        // =========================================================
        // ADMIN COUNTS
        // =========================================================

        int? totalCount = null;
        int? activeCount = null;
        int? outOfStockCount = null;
        int? draftCount = null;

        if (parameters.IncludeInactive == true)
        {
            var counts = await _context.Products
                .AsNoTracking()
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Total = g.Count(),
                    Active = g.Count(p =>
                        p.IsActive && p.StockQuantity > 0),
                    OutOfStock = g.Count(p =>
                        p.IsActive && p.StockQuantity == 0),
                    Draft = g.Count(p =>
                        !p.IsActive)
                })
                .FirstOrDefaultAsync();

            totalCount = counts?.Total ?? 0;
            activeCount = counts?.Active ?? 0;
            outOfStockCount = counts?.OutOfStock ?? 0;
            draftCount = counts?.Draft ?? 0;
        }

        // =========================================================
        // FINAL RESULT
        // =========================================================

        return new PagedResult<ProductDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            CategoryCounts = categoryCounts,
            TotalCount = totalCount,
            ActiveCount = activeCount,
            OutOfStockCount = outOfStockCount,
            DraftCount = draftCount
        };
    }

    // =============================================================
    // GET ALL PRODUCTS
    // =============================================================

    public async Task<IEnumerable<ProductDto>> GetAllAsync(
        bool includeInactive = false)
    {
        IQueryable<Product> query = _context.Products
            .AsNoTracking();

        if (!includeInactive)
        {
            query = query.Where(p =>
                p.IsActive);
        }

        return await query
            .OrderBy(p => p.Id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Sku = !string.IsNullOrWhiteSpace(p.Sku) ? p.Sku : string.Empty,
                Description = p.Description,
                Price = p.Price,
                Image = p.ImageUrl,
                ImageUrl = p.ImageUrl,
                Images = new List<string>
                {
                    p.ImageUrl
                },
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

    // =============================================================
    // GET PRODUCT BY ID
    // =============================================================

    public async Task<Product?> GetByIdAsync(
        int id,
        bool includeInactive = false)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p =>
                p.IsActive);
        }

        return await query
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    // =============================================================
    // GET PRODUCT ENTITY BY ID
    // =============================================================

    public async Task<Product?> GetEntityByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    // =============================================================
    // CREATE PRODUCT
    // =============================================================

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return product;
    }

    // =============================================================
    // UPDATE PRODUCT
    // =============================================================

    public async Task<Product> UpdateAsync(Product product)
    {
        _context.Products.Update(product);

        await _context.SaveChangesAsync();

        return product;
    }

    // =============================================================
    // DELETE PRODUCT
    // =============================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products
            .FindAsync(id);

        if (product == null)
        {
            return false;
        }

        // Check if existing orders reference this product - preserve historical order info
        var hasOrders = await _context.OrderItems
            .AnyAsync(oi => oi.ProductId == id);

        if (hasOrders)
        {
            throw new InvalidOperationException("Cannot delete product because it is associated with existing orders. Please deactivate the product instead.");
        }

        // Safely clean up dependent records before removing product
        var cartItems = await _context.CartItems.Where(ci => ci.ProductId == id).ToListAsync();
        if (cartItems.Count > 0) _context.CartItems.RemoveRange(cartItems);

        var wishlistItems = await _context.WishlistItems.Where(wi => wi.ProductId == id).ToListAsync();
        if (wishlistItems.Count > 0) _context.WishlistItems.RemoveRange(wishlistItems);

        var productReviews = await _context.ProductReviews.Where(pr => pr.ProductId == id).ToListAsync();
        if (productReviews.Count > 0) _context.ProductReviews.RemoveRange(productReviews);

        var productFeatures = await _context.ProductFeatures.Where(pf => pf.ProductId == id).ToListAsync();
        if (productFeatures.Count > 0) _context.ProductFeatures.RemoveRange(productFeatures);

        var productSpecs = await _context.ProductSpecifications.Where(ps => ps.ProductId == id).ToListAsync();
        if (productSpecs.Count > 0) _context.ProductSpecifications.RemoveRange(productSpecs);

        var productImages = await _context.ProductImages.Where(pi => pi.ProductId == id).ToListAsync();
        if (productImages.Count > 0) _context.ProductImages.RemoveRange(productImages);

        // Perform hard SQL delete
        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return true;
    }

    // =============================================================
    // UPDATE PRODUCT STATUS (ACTIVE / INACTIVE)
    // =============================================================

    public async Task<Product?> UpdateStatusAsync(int id, bool isActive)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return null;
        }

        product.IsActive = isActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return product;
    }

    // =============================================================
    // GET CATEGORY BY NAME OR ID
    // =============================================================

    public async Task<Category?> GetCategoryByNameOrIdAsync(
        string? name,
        int? id)
    {
        if (id.HasValue && id.Value > 0)
        {
            var categoryById =
                await _context.Categories
                    .FindAsync(id.Value);

            if (categoryById != null)
            {
                return categoryById;
            }
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            var trimmedName = name.Trim();

            return await _context.Categories
                .FirstOrDefaultAsync(c =>
                    c.Name.ToLower() ==
                    trimmedName.ToLower());
        }

        return null;
    }

    // =============================================================
    // ENSURE CATEGORY
    // =============================================================

    public async Task<Category> EnsureCategoryAsync(
        string name)
    {
        var trimmedName = name.Trim();

        var existing = await _context.Categories
            .FirstOrDefaultAsync(c =>
                c.Name.ToLower() ==
                trimmedName.ToLower());

        if (existing != null)
        {
            return existing;
        }

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

    // =============================================================
    // GET CATEGORIES
    // =============================================================

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

