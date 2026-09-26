using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Infrastructure.Persistence;

public static class CatalogSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        string jsonFilePath)
    {
        // Do not seed again if products already exist.
        if (await context.Products.AnyAsync())
        {
            return;
        }

        if (!File.Exists(jsonFilePath))
        {
            throw new FileNotFoundException(
                $"Product seed file was not found: {jsonFilePath}");
        }

        var json = await File.ReadAllTextAsync(jsonFilePath);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        // =========================================================
        // Deserialize JSON Root
        // =========================================================

        var seedData = JsonSerializer.Deserialize<ProductSeedRoot>(
            json,
            options);

        var products = seedData?.Products;

        if (products is null || products.Count == 0)
        {
            throw new InvalidOperationException(
                "No product data found in the seed JSON file.");
        }

        // =========================================================
        // Image Data Validation & Reporting
        // =========================================================

        var missingOrInvalidImageReports = new List<string>();

        foreach (var item in products)
        {
            if (item.Images is null || item.Images.Count == 0)
            {
                missingOrInvalidImageReports.Add(
                    $"Product ID {item.Id} ('{item.Name}'): Images array is empty or null.");
            }
            else
            {
                if (item.Images.Count < 4)
                {
                    missingOrInvalidImageReports.Add(
                        $"Product ID {item.Id} ('{item.Name}'): Expected 4 images but found {item.Images.Count}.");
                }

                for (var i = 0; i < item.Images.Count; i++)
                {
                    var img = item.Images[i];
                    if (string.IsNullOrWhiteSpace(img))
                    {
                        missingOrInvalidImageReports.Add(
                            $"Product ID {item.Id} ('{item.Name}'): Image URL at position {i + 1} is empty or whitespace.");
                    }
                    else if (!Uri.TryCreate(img, UriKind.Absolute, out var uriResult) ||
                             (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
                    {
                        missingOrInvalidImageReports.Add(
                            $"Product ID {item.Id} ('{item.Name}'): Image URL at position {i + 1} is not a valid HTTP/HTTPS URL ('{img}').");
                    }
                }
            }
        }

        if (missingOrInvalidImageReports.Count > 0)
        {
            Console.WriteLine("=== IMAGE DATA VALIDATION REPORT ===");
            foreach (var report in missingOrInvalidImageReports)
            {
                Console.WriteLine(report);
            }
            Console.WriteLine("=====================================");
        }

        var now = DateTime.UtcNow;

        // =========================================================
        // 1. Categories
        // =========================================================

        var categoryNames = products
            .Select(x => x.Category)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var existingCategories = await context.Categories
            .ToDictionaryAsync(
                x => x.Name,
                StringComparer.OrdinalIgnoreCase);

        foreach (var categoryName in categoryNames)
        {
            if (!existingCategories.ContainsKey(categoryName))
            {
                var category = new Category
                {
                    Name = categoryName,
                    Description = $"{categoryName} products",
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                context.Categories.Add(category);

                existingCategories[categoryName] = category;
            }
        }

        await context.SaveChangesAsync();

        // =========================================================
        // 2. Products
        // =========================================================

        var productEntities = new List<Product>();

        var productSeedMap =
            new Dictionary<Product, ProductSeedModel>();

        foreach (var item in products)
        {
            if (!existingCategories.TryGetValue(
                    item.Category,
                    out var category))
            {
                continue;
            }

            // Set main image to the first image URL in the JSON images array
            var primaryImageUrl = (item.Images != null && item.Images.Count > 0)
                ? item.Images[0]
                : string.Empty;

            var product = new Product
            {
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,

                // First image = main/listing image
                ImageUrl = primaryImageUrl,

                CategoryId = category.Id,

                Rating = item.Rating,

                StockQuantity = item.StockQuantity,

                IsActive = item.IsActive,

                CreatedAt = now,
                UpdatedAt = now
            };

            productEntities.Add(product);

            productSeedMap[product] = item;
        }

        context.Products.AddRange(productEntities);

        await context.SaveChangesAsync();

        // =========================================================
        // 3. Product Images
        // =========================================================

        var productImages = new List<ProductImage>();

        foreach (var pair in productSeedMap)
        {
            var product = pair.Key;
            var item = pair.Value;

            if (item.Images == null || item.Images.Count == 0)
            {
                continue;
            }

            for (var i = 0; i < item.Images.Count; i++)
            {
                productImages.Add(
                    new ProductImage
                    {
                        ProductId = product.Id,

                        ImageUrl = item.Images[i],

                        DisplayOrder = i + 1,

                        IsPrimary = i == 0,

                        CreatedAt = now,

                        UpdatedAt = now
                    });
            }
        }

        context.ProductImages.AddRange(productImages);

        // =========================================================
        // 4. Product Features
        // =========================================================

        var productFeatures = new List<ProductFeature>();

        foreach (var pair in productSeedMap)
        {
            var product = pair.Key;
            var item = pair.Value;

            for (var i = 0; i < item.Features.Count; i++)
            {
                productFeatures.Add(
                    new ProductFeature
                    {
                        ProductId = product.Id,

                        FeatureText = item.Features[i],

                        DisplayOrder = i + 1,

                        CreatedAt = now,

                        UpdatedAt = now
                    });
            }
        }

        context.ProductFeatures.AddRange(productFeatures);

        // =========================================================
        // 5. Product Specifications
        // =========================================================

        var productSpecifications =
            new List<ProductSpecification>();

        foreach (var pair in productSeedMap)
        {
            var product = pair.Key;
            var item = pair.Value;

            var displayOrder = 1;

            foreach (var specification in item.Specifications)
            {
                productSpecifications.Add(
                    new ProductSpecification
                    {
                        ProductId = product.Id,

                        SpecificationName = specification.Key,

                        SpecificationValue = specification.Value,

                        DisplayOrder = displayOrder++,

                        CreatedAt = now,

                        UpdatedAt = now
                    });
            }
        }

        context.ProductSpecifications.AddRange(
            productSpecifications);

        // =========================================================
        // Save Related Data
        // =========================================================

        await context.SaveChangesAsync();

        Console.WriteLine(
            $"Catalog seeding completed: {productEntities.Count} products.");

        Console.WriteLine(
            $"Product images stored: {productImages.Count} images.");
    }

    // =============================================================
    // JSON ROOT MODEL
    // =============================================================

    private class ProductSeedRoot
    {
        public string CatalogName { get; set; } = string.Empty;

        public int TotalProducts { get; set; }

        public Dictionary<string, int> Categories { get; set; } = new();

        public List<ProductSeedModel> Products { get; set; } = new();
    }

    // =============================================================
    // PRODUCT JSON MODEL
    // =============================================================

    private class ProductSeedModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string ProductType { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal Mrp { get; set; }

        public decimal DiscountPercent { get; set; }

        public decimal Rating { get; set; }

        public int ReviewCount { get; set; }

        public bool IsActive { get; set; } = true;

        public int StockQuantity { get; set; }

        public string Brand { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public string ShortDescription { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public List<string> Images { get; set; } = new();

        public List<string> Features { get; set; } = new();

        public Dictionary<string, string> Specifications
        {
            get;
            set;
        } = new();

        public List<ProductReviewSeedModel> Reviews
        {
            get;
            set;
        } = new();
    }

    // =============================================================
    // REVIEW JSON MODEL
    // =============================================================

    private class ProductReviewSeedModel
    {
        public string User { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public decimal Rating { get; set; }

        public string Comment { get; set; } = string.Empty;
    }
}