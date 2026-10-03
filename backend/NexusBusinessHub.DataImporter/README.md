# Nexus Business Hub - One-Time Bulk Product Importer

This console application performs an append-only bulk import of 200,000 products (split across four 50,000-product JSON files) into the existing SQL Server database (`NexusBusinessHubDb`).

---

## Key Characteristics & Guarantees

1. **Non-Destructive & Append-Only**:
   - Preserves all existing database products (~1,023 items) without truncating or modifying them.
   - Target product count: **201,023 products**.

2. **Schema & Migration Preservation**:
   - Does **not** modify existing migrations or schema.
   - Respects SQL Server IDENTITY on `Products.Id` (JSON IDs are never forced into the identity column).
   - Dynamically inspects existing tables (`ProductImages`, `ProductFeatures`, `ProductSpecifications`) and imports related child records while preserving FK constraints.

3. **Deterministic Duplicate & Re-Run Safety**:
   - Uses the unique product image key from the 200K seed catalog to prevent duplicate insertions.
   - If accidentally executed a second time, all 200,000 products are recognized as already imported and safely skipped in ~9 seconds with 0 duplicates added.

4. **Category Handling**:
   - Matches categories by name (case-insensitive).
   - Reuses existing category rows without modifying existing category IDs.

5. **Memory-Bounded & High Performance**:
   - Streams and imports each of the 4 parts sequentially, releasing memory between parts (`GC.Collect()`).
   - Uses batch-level transactions (`1,000` products per batch) with `SqlBulkCopy` into temporary staging heaps and atomic set-based inserts with `OUTPUT INSERTED.Id`.

---

## How to Run the Importer

### 1. Build the Backend Projects

From the `backend/` directory:

```bash
dotnet build
```

### 2. Configure SQL Server Connection (Optional)

The importer automatically discovers your connection string from:
1. `backend/NexusBusinessHub.DataImporter/appsettings.json`
2. `backend/NexusBusinessHub.API/appsettings.json` (fallback)
3. Environment variable `ConnectionStrings__DefaultConnection`
4. CLI argument: `--connection-string "<your-connection-string>"`

Default connection string:
```text
Server=localhost;Database=NexusBusinessHubDb;Trusted_Connection=True;TrustServerCertificate=True;
```

### 3. Run the Importer

From the `backend/` directory:

```bash
dotnet run --project NexusBusinessHub.DataImporter
```

#### Optional CLI Arguments:

- Specify custom batch size (default: 1,000):
  ```bash
  dotnet run --project NexusBusinessHub.DataImporter -- --batch-size 2000
  ```

- Specify custom connection string:
  ```bash
  dotnet run --project NexusBusinessHub.DataImporter -- --connection-string "Server=localhost;Database=NexusBusinessHubDb;Trusted_Connection=True;TrustServerCertificate=True;"
  ```

- Specify custom seed data directory:
  ```bash
  dotnet run --project NexusBusinessHub.DataImporter -- --data-dir "C:\path\to\SeedData"
  ```

---

## Verification SQL Queries

Run the following queries in SQL Server Management Studio (SSMS) or `sqlcmd`:

```sql
USE NexusBusinessHubDb;
GO

-- 1. Total Product Count (Target: ~201,023)
SELECT COUNT(*) AS TotalProducts
FROM dbo.Products;

-- 2. Range of IDs (Preserved identity)
SELECT MIN(Id) AS MinId, MAX(Id) AS MaxId
FROM dbo.Products;

-- 3. Active Products
SELECT COUNT(*) AS ActiveProducts
FROM dbo.Products
WHERE IsActive = 1;

-- 4. Product Distribution by Category
SELECT c.Name, COUNT(p.Id) AS ProductCount
FROM dbo.Categories c
LEFT JOIN dbo.Products p ON p.CategoryId = c.Id
GROUP BY c.Id, c.Name
ORDER BY c.Id;

-- 5. Child Table Records
SELECT COUNT(*) AS TotalImages FROM dbo.ProductImages;
SELECT COUNT(*) AS TotalFeatures FROM dbo.ProductFeatures;
SELECT COUNT(*) AS TotalSpecs FROM dbo.ProductSpecifications;
```

### Expected Results

| Metric | Result |
| :--- | :--- |
| **TotalProducts** | `201,023` |
| **MinId / MaxId** | `2001` / `205026` |
| **ActiveProducts** | `197,018` |
| **Electronics** | `50,255` |
| **Hardware** | `50,252` |
| **Software** | `50,266` |
| **Accessories** | `50,250` |
| **ProductImages** | `804,032` |
| **ProductFeatures** | `1,005,000` |
| **ProductSpecifications** | `1,005,000` |
