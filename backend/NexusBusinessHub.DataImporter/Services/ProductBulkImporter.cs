using System.Data;
using System.Diagnostics;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using NexusBusinessHub.DataImporter.Models;

namespace NexusBusinessHub.DataImporter.Services;

public class ProductBulkImporter
{
    private readonly string _connectionString;
    private readonly int _batchSize;
    private readonly string _dataDirectory;

    public ProductBulkImporter(string connectionString, int batchSize, string dataDirectory)
    {
        _connectionString = connectionString;
        _batchSize = batchSize > 0 ? batchSize : 1000;
        _dataDirectory = dataDirectory;
    }

    public async Task RunAsync()
    {
        var totalStopwatch = Stopwatch.StartNew();

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("================================================================================");
        Console.WriteLine(" NEXUS BUSINESS HUB - ONE-TIME BULK PRODUCT IMPORTER");
        Console.WriteLine("================================================================================");
        Console.ResetColor();
        Console.WriteLine($"Connection String : {MaskConnectionString(_connectionString)}");
        Console.WriteLine($"Batch Size        : {_batchSize:N0} products");
        Console.WriteLine($"Seed Data Dir     : {_dataDirectory}");
        Console.WriteLine();

        // 1. Validate files exist
        var partFiles = new[]
        {
            Path.Combine(_dataDirectory, "nexus-products-200000-part1.json"),
            Path.Combine(_dataDirectory, "nexus-products-200000-part2.json"),
            Path.Combine(_dataDirectory, "nexus-products-200000-part3.json"),
            Path.Combine(_dataDirectory, "nexus-products-200000-part4.json")
        };

        for (int i = 0; i < partFiles.Length; i++)
        {
            if (!File.Exists(partFiles[i]))
            {
                throw new FileNotFoundException($"Part file {i + 1} not found at: {partFiles[i]}");
            }
        }

        // 2. Open SQL Connection
        await using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // 3. Inspect existing database schema and state
        Console.WriteLine("Inspecting database schema and existing data...");
        var hasImagesTable = await TableExistsAsync(connection, "ProductImages");
        var hasFeaturesTable = await TableExistsAsync(connection, "ProductFeatures");
        var hasSpecsTable = await TableExistsAsync(connection, "ProductSpecifications");
        var hasSkuColumn = await ColumnExistsAsync(connection, "Products", "Sku");

        Console.WriteLine($" - dbo.ProductImages exists       : {hasImagesTable}");
        Console.WriteLine($" - dbo.ProductFeatures exists      : {hasFeaturesTable}");
        Console.WriteLine($" - dbo.ProductSpecifications exists: {hasSpecsTable}");
        Console.WriteLine($" - dbo.Products.Sku column exists  : {hasSkuColumn} (Schema preserved; SKU not stored in Products)");
        Console.WriteLine();

        // Load existing categories into memory
        var categoryMap = await LoadCategoriesAsync(connection);
        Console.WriteLine($"Loaded {categoryMap.Count} existing categories from database:");
        foreach (var kvp in categoryMap)
        {
            Console.WriteLine($"  ID {kvp.Value}: {kvp.Key}");
        }
        Console.WriteLine();

        // Load existing product primary ImageUrls for deterministic duplicate/re-run safety
        Console.WriteLine("Loading existing product keys for duplicate/re-run safety...");
        var existingPrimaryImages = await LoadExistingPrimaryImagesAsync(connection);
        Console.WriteLine($"Loaded {existingPrimaryImages.Count:N0} existing products in database.");
        Console.WriteLine();

        // 4. Create local temporary staging tables on this connection (heaps without indexes to avoid memory grants)
        Console.WriteLine("Creating temporary staging tables in tempdb...");
        await CreateStagingTablesAsync(connection);
        Console.WriteLine("Staging tables ready.");
        Console.WriteLine();

        // 5. Process each part file sequentially
        long totalImportedAcrossAllParts = 0;
        long totalSkippedAcrossAllParts = 0;

        for (int partIndex = 1; partIndex <= partFiles.Length; partIndex++)
        {
            var filePath = partFiles[partIndex - 1];
            var partStopwatch = Stopwatch.StartNew();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"================================================================================");
            Console.WriteLine($" [Part {partIndex}/4] Reading {Path.GetFileName(filePath)} ({new FileInfo(filePath).Length / 1024 / 1024:N0} MB)...");
            Console.WriteLine($"================================================================================");
            Console.ResetColor();

            // Read JSON file
            ProductSeedRoot? seedData;
            using (var stream = File.OpenRead(filePath))
            {
                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                seedData = await JsonSerializer.DeserializeAsync<ProductSeedRoot>(stream, jsonOptions);
            }

            if (seedData == null || seedData.Products == null || seedData.Products.Count == 0)
            {
                Console.WriteLine($"[Part {partIndex}/4] No products found in {Path.GetFileName(filePath)}. Skipping.");
                continue;
            }

            var partProducts = seedData.Products;
            int totalPartProducts = partProducts.Count;
            Console.WriteLine($"[Part {partIndex}/4] Deserialized {totalPartProducts:N0} products in {partStopwatch.Elapsed:mm\\:ss}. Beginning batch import...");

            // Process batches
            int batchCount = (int)Math.Ceiling(totalPartProducts / (double)_batchSize);
            long partImportedCount = 0;
            long partSkippedCount = 0;

            for (int b = 0; b < batchCount; b++)
            {
                int batchIndex = b + 1;
                int skip = b * _batchSize;
                var batch = partProducts.Skip(skip).Take(_batchSize).ToList();

                try
                {
                    var (importedInBatch, skippedInBatch) = await ProcessBatchAsync(
                        connection,
                        batch,
                        categoryMap,
                        existingPrimaryImages,
                        hasImagesTable,
                        hasFeaturesTable,
                        hasSpecsTable);

                    partImportedCount += importedInBatch;
                    partSkippedCount += skippedInBatch;
                    totalImportedAcrossAllParts += importedInBatch;
                    totalSkippedAcrossAllParts += skippedInBatch;

                    // Progress output matching specification requirement 14:
                    Console.WriteLine($"Part {partIndex}/4");
                    Console.WriteLine($"Batch {batchIndex}");
                    Console.WriteLine($"Imported: {partImportedCount:N0} / {totalPartProducts:N0}");
                    Console.WriteLine($"Total: {totalImportedAcrossAllParts:N0}");
                    Console.WriteLine($"Elapsed: {totalStopwatch.Elapsed:hh\\:mm\\:ss}");
                    Console.WriteLine();
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"================================================================================");
                    Console.WriteLine($"[ERROR] FAILED AT PART {partIndex}/4, BATCH {batchIndex}:");
                    Console.WriteLine($"Message: {ex.Message}");
                    Console.WriteLine($"Stack: {ex.StackTrace}");
                    Console.WriteLine($"================================================================================");
                    Console.ResetColor();
                    throw;
                }
            }

            // Release memory immediately before reading next part
            partProducts.Clear();
            seedData = null;

            Console.WriteLine($"[Part {partIndex}/4] Finished in {partStopwatch.Elapsed:mm\\:ss}. Imported: {partImportedCount:N0}, Skipped: {partSkippedCount:N0}.");
            Console.WriteLine($"[Part {partIndex}/4] Releasing memory (GC)...");
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
            Console.WriteLine($"[Part {partIndex}/4] Memory released. Working set: {Process.GetCurrentProcess().WorkingSet64 / 1024 / 1024:N0} MB.");
            Console.WriteLine();
        }

        totalStopwatch.Stop();

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("================================================================================");
        Console.WriteLine(" BULK IMPORT COMPLETED SUCCESSFULLY!");
        Console.WriteLine("================================================================================");
        Console.ResetColor();
        Console.WriteLine($"Total Products Imported : {totalImportedAcrossAllParts:N0}");
        Console.WriteLine($"Total Products Skipped  : {totalSkippedAcrossAllParts:N0}");
        Console.WriteLine($"Total Elapsed Time      : {totalStopwatch.Elapsed:hh\\:mm\\:ss\\.fff}");
        if (totalStopwatch.Elapsed.TotalSeconds > 0 && totalImportedAcrossAllParts > 0)
        {
            var rate = totalImportedAcrossAllParts / totalStopwatch.Elapsed.TotalSeconds;
            Console.WriteLine($"Average Throughput      : {rate:N1} products/second");
        }
        Console.WriteLine();

        // 6. Run verification queries against SQL Server
        await RunVerificationQueriesAsync(connection);
    }

    private async Task<(int imported, int skipped)> ProcessBatchAsync(
        SqlConnection connection,
        List<ProductSeedModel> batch,
        Dictionary<string, int> categoryMap,
        HashSet<string> existingPrimaryImages,
        bool hasImagesTable,
        bool hasFeaturesTable,
        bool hasSpecsTable)
    {
        var now = DateTime.UtcNow;

        // 1. Filter out duplicates based on primary ImageUrl
        var newProducts = new List<ProductSeedModel>();
        int skipped = 0;

        foreach (var item in batch)
        {
            var primaryImg = (item.Images != null && item.Images.Count > 0)
                ? item.Images[0].Trim()
                : string.Empty;

            if (!string.IsNullOrEmpty(primaryImg) && existingPrimaryImages.Contains(primaryImg))
            {
                skipped++;
                continue;
            }

            newProducts.Add(item);
        }

        if (newProducts.Count == 0)
        {
            return (0, skipped);
        }

        // 2. Ensure all categories exist
        foreach (var item in newProducts)
        {
            var catName = string.IsNullOrWhiteSpace(item.Category) ? "Electronics" : item.Category.Trim();
            if (!categoryMap.ContainsKey(catName))
            {
                var newCatId = await InsertCategoryAsync(connection, catName, now);
                categoryMap[catName] = newCatId;
            }
        }

        // 3. Prepare DataTables for SqlBulkCopy into temporary staging tables
        var dtProducts = CreateProductsDataTable();
        var dtImages = CreateImagesDataTable();
        var dtFeatures = CreateFeaturesDataTable();
        var dtSpecs = CreateSpecsDataTable();

        foreach (var item in newProducts)
        {
            var catName = string.IsNullOrWhiteSpace(item.Category) ? "Electronics" : item.Category.Trim();
            var categoryId = categoryMap[catName];

            var primaryImg = (item.Images != null && item.Images.Count > 0)
                ? item.Images[0].Trim()
                : string.Empty;

            var description = !string.IsNullOrWhiteSpace(item.Description)
                ? item.Description
                : (!string.IsNullOrWhiteSpace(item.ShortDescription) ? item.ShortDescription : item.Name);

            var rating = Math.Round(Math.Clamp(item.Rating, 0.00m, 5.00m), 2);
            var price = Math.Max(0.00m, Math.Round(item.Price, 2));
            var stock = Math.Max(0, item.StockQuantity);

            dtProducts.Rows.Add(
                item.Name ?? string.Empty,
                description,
                price,
                primaryImg,
                categoryId,
                rating,
                stock,
                item.IsActive,
                now,
                now
            );

            // Images
            if (hasImagesTable && item.Images != null && item.Images.Count > 0)
            {
                for (int i = 0; i < item.Images.Count; i++)
                {
                    var imgUrl = item.Images[i];
                    if (string.IsNullOrWhiteSpace(imgUrl)) continue;

                    dtImages.Rows.Add(
                        primaryImg,
                        imgUrl.Trim(),
                        i + 1,
                        i == 0,
                        now,
                        now
                    );
                }
            }

            // Features
            if (hasFeaturesTable && item.Features != null && item.Features.Count > 0)
            {
                for (int i = 0; i < item.Features.Count; i++)
                {
                    var f = item.Features[i];
                    if (string.IsNullOrWhiteSpace(f)) continue;

                    dtFeatures.Rows.Add(
                        primaryImg,
                        f.Trim(),
                        i + 1,
                        now,
                        now
                    );
                }
            }

            // Specs
            if (hasSpecsTable && item.Specifications != null && item.Specifications.Count > 0)
            {
                int specOrder = 1;
                foreach (var spec in item.Specifications)
                {
                    if (string.IsNullOrWhiteSpace(spec.Key)) continue;

                    dtSpecs.Rows.Add(
                        primaryImg,
                        spec.Key.Trim(),
                        spec.Value?.Trim() ?? string.Empty,
                        specOrder++,
                        now,
                        now
                    );
                }
            }
        }

        // 4. Execute atomic batch transaction
        await using var transaction = (SqlTransaction)await connection.BeginTransactionAsync();

        try
        {
            // A. Bulk copy into #StagingProducts
            using (var bcp = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction))
            {
                bcp.DestinationTableName = "#StagingProducts";
                bcp.BulkCopyTimeout = 120;
                bcp.EnableStreaming = true;

                bcp.ColumnMappings.Add("Name", "Name");
                bcp.ColumnMappings.Add("Description", "Description");
                bcp.ColumnMappings.Add("Price", "Price");
                bcp.ColumnMappings.Add("ImageUrl", "ImageUrl");
                bcp.ColumnMappings.Add("CategoryId", "CategoryId");
                bcp.ColumnMappings.Add("Rating", "Rating");
                bcp.ColumnMappings.Add("StockQuantity", "StockQuantity");
                bcp.ColumnMappings.Add("IsActive", "IsActive");
                bcp.ColumnMappings.Add("CreatedAt", "CreatedAt");
                bcp.ColumnMappings.Add("UpdatedAt", "UpdatedAt");

                await bcp.WriteToServerAsync(dtProducts);
            }

            // B. Bulk copy into #StagingImages
            if (hasImagesTable && dtImages.Rows.Count > 0)
            {
                using var bcpImages = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction);
                bcpImages.DestinationTableName = "#StagingImages";
                bcpImages.BulkCopyTimeout = 120;
                bcpImages.EnableStreaming = true;

                bcpImages.ColumnMappings.Add("ProductImageUrl", "ProductImageUrl");
                bcpImages.ColumnMappings.Add("ImageUrl", "ImageUrl");
                bcpImages.ColumnMappings.Add("DisplayOrder", "DisplayOrder");
                bcpImages.ColumnMappings.Add("IsPrimary", "IsPrimary");
                bcpImages.ColumnMappings.Add("CreatedAt", "CreatedAt");
                bcpImages.ColumnMappings.Add("UpdatedAt", "UpdatedAt");

                await bcpImages.WriteToServerAsync(dtImages);
            }

            // C. Bulk copy into #StagingFeatures
            if (hasFeaturesTable && dtFeatures.Rows.Count > 0)
            {
                using var bcpFeatures = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction);
                bcpFeatures.DestinationTableName = "#StagingFeatures";
                bcpFeatures.BulkCopyTimeout = 120;
                bcpFeatures.EnableStreaming = true;

                bcpFeatures.ColumnMappings.Add("ProductImageUrl", "ProductImageUrl");
                bcpFeatures.ColumnMappings.Add("FeatureText", "FeatureText");
                bcpFeatures.ColumnMappings.Add("DisplayOrder", "DisplayOrder");
                bcpFeatures.ColumnMappings.Add("CreatedAt", "CreatedAt");
                bcpFeatures.ColumnMappings.Add("UpdatedAt", "UpdatedAt");

                await bcpFeatures.WriteToServerAsync(dtFeatures);
            }

            // D. Bulk copy into #StagingSpecifications
            if (hasSpecsTable && dtSpecs.Rows.Count > 0)
            {
                using var bcpSpecs = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction);
                bcpSpecs.DestinationTableName = "#StagingSpecifications";
                bcpSpecs.BulkCopyTimeout = 120;
                bcpSpecs.EnableStreaming = true;

                bcpSpecs.ColumnMappings.Add("ProductImageUrl", "ProductImageUrl");
                bcpSpecs.ColumnMappings.Add("SpecificationName", "SpecificationName");
                bcpSpecs.ColumnMappings.Add("SpecificationValue", "SpecificationValue");
                bcpSpecs.ColumnMappings.Add("DisplayOrder", "DisplayOrder");
                bcpSpecs.ColumnMappings.Add("CreatedAt", "CreatedAt");
                bcpSpecs.ColumnMappings.Add("UpdatedAt", "UpdatedAt");

                await bcpSpecs.WriteToServerAsync(dtSpecs);
            }

            // E. Insert staging into dbo.Products and related child records
            var mergeSql = @"
SET NOCOUNT ON;

INSERT INTO dbo.Products (Name, Description, Price, ImageUrl, CategoryId, Rating, StockQuantity, IsActive, CreatedAt, UpdatedAt)
OUTPUT INSERTED.Id, INSERTED.ImageUrl INTO #IdMap (NewProductId, ProductImageUrl)
SELECT Name, Description, Price, ImageUrl, CategoryId, Rating, StockQuantity, IsActive, CreatedAt, UpdatedAt
FROM #StagingProducts;
";

            if (hasImagesTable)
            {
                mergeSql += @"
INSERT INTO dbo.ProductImages (ProductId, ImageUrl, DisplayOrder, IsPrimary, CreatedAt, UpdatedAt)
SELECT m.NewProductId, img.ImageUrl, img.DisplayOrder, img.IsPrimary, img.CreatedAt, img.UpdatedAt
FROM #StagingImages img
JOIN #IdMap m ON img.ProductImageUrl = m.ProductImageUrl;
";
            }

            if (hasFeaturesTable)
            {
                mergeSql += @"
INSERT INTO dbo.ProductFeatures (ProductId, FeatureText, DisplayOrder, CreatedAt, UpdatedAt)
SELECT m.NewProductId, f.FeatureText, f.DisplayOrder, f.CreatedAt, f.UpdatedAt
FROM #StagingFeatures f
JOIN #IdMap m ON f.ProductImageUrl = m.ProductImageUrl;
";
            }

            if (hasSpecsTable)
            {
                mergeSql += @"
INSERT INTO dbo.ProductSpecifications (ProductId, SpecificationName, SpecificationValue, DisplayOrder, CreatedAt, UpdatedAt)
SELECT m.NewProductId, sp.SpecificationName, sp.SpecificationValue, sp.DisplayOrder, sp.CreatedAt, sp.UpdatedAt
FROM #StagingSpecifications sp
JOIN #IdMap m ON sp.ProductImageUrl = m.ProductImageUrl;
";
            }

            mergeSql += @"
TRUNCATE TABLE #StagingProducts;
TRUNCATE TABLE #IdMap;
TRUNCATE TABLE #StagingImages;
TRUNCATE TABLE #StagingFeatures;
TRUNCATE TABLE #StagingSpecifications;
";

            await using (var cmd = new SqlCommand(mergeSql, connection, transaction))
            {
                cmd.CommandTimeout = 180;
                await cmd.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();

            // Register newly inserted products into local set for subsequent duplicate checks
            foreach (var item in newProducts)
            {
                var primaryImg = (item.Images != null && item.Images.Count > 0)
                    ? item.Images[0].Trim()
                    : string.Empty;
                if (!string.IsNullOrEmpty(primaryImg))
                {
                    existingPrimaryImages.Add(primaryImg);
                }
            }

            return (newProducts.Count, skipped);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static async Task CreateStagingTablesAsync(SqlConnection connection)
    {
        var sql = @"
IF OBJECT_ID('tempdb..#StagingProducts') IS NOT NULL DROP TABLE #StagingProducts;
IF OBJECT_ID('tempdb..#IdMap') IS NOT NULL DROP TABLE #IdMap;
IF OBJECT_ID('tempdb..#StagingImages') IS NOT NULL DROP TABLE #StagingImages;
IF OBJECT_ID('tempdb..#StagingFeatures') IS NOT NULL DROP TABLE #StagingFeatures;
IF OBJECT_ID('tempdb..#StagingSpecifications') IS NOT NULL DROP TABLE #StagingSpecifications;

CREATE TABLE #StagingProducts (
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    ImageUrl NVARCHAR(450) NOT NULL,
    CategoryId INT NOT NULL,
    Rating DECIMAL(3,2) NOT NULL,
    StockQuantity INT NOT NULL,
    IsActive BIT NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL
);

CREATE TABLE #IdMap (
    NewProductId INT NOT NULL,
    ProductImageUrl NVARCHAR(450) NOT NULL
);

CREATE TABLE #StagingImages (
    ProductImageUrl NVARCHAR(450) NOT NULL,
    ImageUrl NVARCHAR(MAX) NOT NULL,
    DisplayOrder INT NOT NULL,
    IsPrimary BIT NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL
);

CREATE TABLE #StagingFeatures (
    ProductImageUrl NVARCHAR(450) NOT NULL,
    FeatureText NVARCHAR(MAX) NOT NULL,
    DisplayOrder INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL
);

CREATE TABLE #StagingSpecifications (
    ProductImageUrl NVARCHAR(450) NOT NULL,
    SpecificationName NVARCHAR(255) NOT NULL,
    SpecificationValue NVARCHAR(MAX) NOT NULL,
    DisplayOrder INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL
);
";

        await using var cmd = new SqlCommand(sql, connection);
        cmd.CommandTimeout = 60;
        await cmd.ExecuteNonQueryAsync();
    }

    private static DataTable CreateProductsDataTable()
    {
        var dt = new DataTable();
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Description", typeof(string));
        dt.Columns.Add("Price", typeof(decimal));
        dt.Columns.Add("ImageUrl", typeof(string));
        dt.Columns.Add("CategoryId", typeof(int));
        dt.Columns.Add("Rating", typeof(decimal));
        dt.Columns.Add("StockQuantity", typeof(int));
        dt.Columns.Add("IsActive", typeof(bool));
        dt.Columns.Add("CreatedAt", typeof(DateTime));
        dt.Columns.Add("UpdatedAt", typeof(DateTime));
        return dt;
    }

    private static DataTable CreateImagesDataTable()
    {
        var dt = new DataTable();
        dt.Columns.Add("ProductImageUrl", typeof(string));
        dt.Columns.Add("ImageUrl", typeof(string));
        dt.Columns.Add("DisplayOrder", typeof(int));
        dt.Columns.Add("IsPrimary", typeof(bool));
        dt.Columns.Add("CreatedAt", typeof(DateTime));
        dt.Columns.Add("UpdatedAt", typeof(DateTime));
        return dt;
    }

    private static DataTable CreateFeaturesDataTable()
    {
        var dt = new DataTable();
        dt.Columns.Add("ProductImageUrl", typeof(string));
        dt.Columns.Add("FeatureText", typeof(string));
        dt.Columns.Add("DisplayOrder", typeof(int));
        dt.Columns.Add("CreatedAt", typeof(DateTime));
        dt.Columns.Add("UpdatedAt", typeof(DateTime));
        return dt;
    }

    private static DataTable CreateSpecsDataTable()
    {
        var dt = new DataTable();
        dt.Columns.Add("ProductImageUrl", typeof(string));
        dt.Columns.Add("SpecificationName", typeof(string));
        dt.Columns.Add("SpecificationValue", typeof(string));
        dt.Columns.Add("DisplayOrder", typeof(int));
        dt.Columns.Add("CreatedAt", typeof(DateTime));
        dt.Columns.Add("UpdatedAt", typeof(DateTime));
        return dt;
    }

    private static async Task<Dictionary<string, int>> LoadCategoriesAsync(SqlConnection connection)
    {
        var map = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        await using var cmd = new SqlCommand("SELECT Id, Name FROM dbo.Categories", connection);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var id = reader.GetInt32(0);
            var name = reader.GetString(1);
            map[name] = id;
        }
        return map;
    }

    private static async Task<int> InsertCategoryAsync(SqlConnection connection, string name, DateTime now)
    {
        var sql = @"
INSERT INTO dbo.Categories (Name, Description, IsActive, CreatedAt, UpdatedAt)
OUTPUT INSERTED.Id
VALUES (@Name, @Description, 1, @Now, @Now);";

        await using var cmd = new SqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@Name", name);
        cmd.Parameters.AddWithValue("@Description", $"{name} products");
        cmd.Parameters.AddWithValue("@Now", now);

        var result = await cmd.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    private static async Task<HashSet<string>> LoadExistingPrimaryImagesAsync(SqlConnection connection)
    {
        var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        await using var cmd = new SqlCommand("SELECT ImageUrl FROM dbo.Products WHERE ImageUrl != ''", connection);
        cmd.CommandTimeout = 120;
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var url = reader.GetString(0);
            if (!string.IsNullOrWhiteSpace(url))
            {
                set.Add(url.Trim());
            }
        }
        return set;
    }

    private static async Task<bool> TableExistsAsync(SqlConnection connection, string tableName)
    {
        await using var cmd = new SqlCommand(
            "SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = @Table",
            connection);
        cmd.Parameters.AddWithValue("@Table", tableName);
        var result = await cmd.ExecuteScalarAsync();
        return result != null;
    }

    private static async Task<bool> ColumnExistsAsync(SqlConnection connection, string tableName, string columnName)
    {
        await using var cmd = new SqlCommand(
            "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = @Table AND COLUMN_NAME = @Col",
            connection);
        cmd.Parameters.AddWithValue("@Table", tableName);
        cmd.Parameters.AddWithValue("@Col", columnName);
        var result = await cmd.ExecuteScalarAsync();
        return result != null;
    }

    private static async Task RunVerificationQueriesAsync(SqlConnection connection)
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("================================================================================");
        Console.WriteLine(" DATABASE VERIFICATION QUERIES");
        Console.WriteLine("================================================================================");
        Console.ResetColor();

        // 1. TotalProducts
        await using (var cmd = new SqlCommand("SELECT COUNT(*) AS TotalProducts FROM dbo.Products;", connection))
        {
            var total = await cmd.ExecuteScalarAsync();
            Console.WriteLine($"TotalProducts   : {total:N0}");
        }

        // 2. MinId, MaxId
        await using (var cmd = new SqlCommand("SELECT MIN(Id) AS MinId, MAX(Id) AS MaxId FROM dbo.Products;", connection))
        await using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
            {
                Console.WriteLine($"MinId / MaxId   : {reader[0]} / {reader[1]}");
            }
        }

        // 3. ActiveProducts
        await using (var cmd = new SqlCommand("SELECT COUNT(*) AS ActiveProducts FROM dbo.Products WHERE IsActive = 1;", connection))
        {
            var active = await cmd.ExecuteScalarAsync();
            Console.WriteLine($"ActiveProducts  : {active:N0}");
        }

        // 4. ProductCount by Category
        Console.WriteLine("\nProductCount by Category:");
        var catSql = @"
SELECT c.Name, COUNT(p.Id) AS ProductCount
FROM dbo.Categories c
LEFT JOIN dbo.Products p ON p.CategoryId = c.Id
GROUP BY c.Id, c.Name
ORDER BY c.Id;";

        await using (var cmd = new SqlCommand(catSql, connection))
        await using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                Console.WriteLine($"  - {reader.GetString(0),-15} : {reader.GetInt32(1),8:N0}");
            }
        }

        // 5. Related table counts
        Console.WriteLine("\nRelated Child Table Row Counts:");
        if (await TableExistsAsync(connection, "ProductImages"))
        {
            await using var cmd = new SqlCommand("SELECT COUNT(*) FROM dbo.ProductImages;", connection);
            Console.WriteLine($"  - ProductImages       : {await cmd.ExecuteScalarAsync():N0}");
        }

        if (await TableExistsAsync(connection, "ProductFeatures"))
        {
            await using var cmd = new SqlCommand("SELECT COUNT(*) FROM dbo.ProductFeatures;", connection);
            Console.WriteLine($"  - ProductFeatures      : {await cmd.ExecuteScalarAsync():N0}");
        }

        if (await TableExistsAsync(connection, "ProductSpecifications"))
        {
            await using var cmd = new SqlCommand("SELECT COUNT(*) FROM dbo.ProductSpecifications;", connection);
            Console.WriteLine($"  - ProductSpecifications: {await cmd.ExecuteScalarAsync():N0}");
        }

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("================================================================================");
        Console.ResetColor();
    }

    private static string MaskConnectionString(string cs)
    {
        var parts = cs.Split(';', StringSplitOptions.RemoveEmptyEntries);
        var masked = new List<string>();
        foreach (var p in parts)
        {
            if (p.Trim().StartsWith("Password", StringComparison.OrdinalIgnoreCase) ||
                p.Trim().StartsWith("Pwd", StringComparison.OrdinalIgnoreCase))
            {
                masked.Add("Password=********");
            }
            else
            {
                masked.Add(p);
            }
        }
        return string.Join(";", masked);
    }
}
