# Nexus Business Hub — Backend Architecture Documentation

Welcome to the **Nexus Business Hub** backend solution. The backend is an enterprise-grade, distributed application platform engineered using **ASP.NET Core 10**, **C#**, **Entity Framework Core 10**, and **Microsoft SQL Server 2022**. It strictly follows **Clean Architecture** (Onion Architecture) principles to ensure decoupling of business domain rules from presentation frameworks and infrastructure providers.

---

## 1. Solution Architecture Overview

The backend solution is organized into five specialized projects under `backend/`, coordinated by `NexusBusinessHub.slnx`:

```text
backend/
├── NexusBusinessHub.API/            # Presentation Layer (ASP.NET Core 10 Web API)
├── NexusBusinessHub.Application/    # Business Logic Layer (Use Cases, Services, DTOs)
├── NexusBusinessHub.Domain/         # Domain Layer (Enterprise Entities & Enums)
├── NexusBusinessHub.Infrastructure/ # Persistence Layer (EF Core, Repositories, SMTP)
└── NexusBusinessHub.DataImporter/   # High-Speed Bulk Catalog Ingestion Tool (200K Products)
```

### Dependency Inversion Principle
```text
NexusBusinessHub.API
        │
        ▼
NexusBusinessHub.Application
        │
        ▼
NexusBusinessHub.Domain ◄─── NexusBusinessHub.Infrastructure
```
- **Domain** depends on nothing.
- **Application** depends solely on Domain.
- **Infrastructure** implements Application interfaces and configures Domain entities.
- **API** depends on Application and references Infrastructure for dependency injection wiring in `Program.cs`.

---

## 2. Layer Deep Dive

### 2.1 NexusBusinessHub.API (Presentation Tier)
- **`Program.cs`**:
  - Initializes `WebApplicationBuilder` with User Secrets and environment configurations.
  - Configures **JWT Bearer Authentication** with HMAC-SHA256 signature validation.
  - Configures **CORS Policy** (`AllowFrontend`) allowing `http://localhost:5173`.
  - Registers `ApplicationDbContext` with SQL Server connection pooling.
  - Registers scoped services: `IProductRepository`, `IProductService`, `IUserRepository`, `IPasswordResetRepository`, `IEmailService`, `IAuthService`, and `IPasswordHasher<User>`.
  - Executes `CatalogSeeder.SeedAsync()` during startup to ensure a baseline catalog exists.
- **`Controllers/AuthController.cs`**:
  - `POST /api/Auth/register`: Validates customer registration, prevents duplicate emails/phones, hashes passwords, returns JWT.
  - `POST /api/Auth/login`: Dual-identifier login (email or 10-digit phone), validates PBKDF2 hash, triggers Admin OTP or issues JWT.
  - `POST /api/Auth/admin/send-otp`: Dispatches 6-digit administrative verification OTP.
  - `POST /api/Auth/admin/captcha`: Generates dynamic arithmetic CAPTCHA challenge for anti-bot defense.
  - `POST /api/Auth/admin/verify-otp`: Validates admin OTP and CAPTCHA before issuing admin JWT.
  - `POST /api/Auth/forgot-password`: Generates secure OTP, records attempt in database, dispatches via MailKit SMTP.
  - `POST /api/Auth/verify-reset-otp`: Validates OTP hash, enforces 5-attempt threshold, issues 32-byte hexadecimal `resetToken`.
  - `POST /api/Auth/reset-password`: Validates password complexity, updates password hash, marks OTP used.
- **`Controllers/ProductsController.cs`**:
  - `GET /api/Products`: Paginated querying with category, search, price range, rating, status, and sorting filters.
  - `GET /api/Products/{id}`: Single product retrieval with related Category and ProductImages.
  - `POST /api/Products`: Adds a new product, auto-creates Category if missing, assigns primary image.
  - `PUT /api/Products/{id}`: Updates existing product metadata and replaces or updates image galleries.
  - `DELETE /api/Products/{id}`: Soft-deactivates product by setting `IsActive = false`.
  - `GET /api/Products/categories`: Returns distinct active categories with active product counts.

### 2.2 NexusBusinessHub.Application (Use Cases & Contracts)
- **`Services/ProductService.cs`**: Implements catalog business rules, category resolution (`EnsureCategoryAsync`), input validation, and DTO transformation.
- **`Services/AuthService.cs`**: Implements authentication state machines, PBKDF2 hashing (100,000 iterations), JWT token issuance, rate limiting (60s), and OTP lifecycle management.
- **`Interfaces/`**: `IProductService`, `IAuthService`, `IEmailService`, `IProductRepository`, `IUserRepository`, `IPasswordResetRepository`.
- **`DTOs/`**: `ProductDto`, `PagedResult<T>`, `ProductQueryParameters`, `CreateProductDto`, `UpdateProductDto`, `LoginRequestDto`, `LoginResponseDto`, `RegisterRequestDto`, `ForgotPasswordRequestDto`, `VerifyResetOtpRequestDto`, `ResetPasswordRequestDto`.
- **`Mappings/ProductMapping.cs`**: Extension methods converting domain `Product` to `ProductDto` with primary image resolution.

### 2.3 NexusBusinessHub.Domain (Core Enterprise Model)
- **`Entities/BaseEntity.cs`**: `Id` (int), `CreatedAt` (DateTime UTC), `UpdatedAt` (DateTime UTC).
- **`Entities/Product.cs`**: Name, Description, Price, ImageUrl, CategoryId, Rating, StockQuantity, IsActive, Images collection.
- **`Entities/Category.cs`**: Name, Description, IsActive, Products collection.
- **`Entities/User.cs`**: FirstName, LastName, Email, PasswordHash, PhoneNumber, Role, IsActive.
- **`Entities/Order.cs` & `OrderItem.cs`**: Order header and detail records with status and unit price.
- **`Entities/Cart.cs` & `CartItem.cs`**: User shopping cart entities.
- **`Entities/Wishlist.cs` & `WishlistItem.cs`**: User favorite product containers.
- **`Entities/PasswordResetOtp.cs`**: OtpHash, ExpiresAt, AttemptCount, IsUsed, IsVerified, ResetToken, ResetTokenExpiresAt.
- **`Entities/ProductImage.cs`**: ProductId, ImageUrl, DisplayOrder, IsPrimary.
- **`Entities/ProductFeature.cs` & `ProductSpecification.cs`**: Enterprise feature bullets and key-value specs.
- **`Enums/`**: `UserRole` (`Customer`, `Admin`), `OrderStatus` (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

### 2.4 NexusBusinessHub.Infrastructure (Persistence & External Adapters)
- **`Persistence/ApplicationDbContext.cs`**: EF Core context managing 18 DbSets with automatic configuration discovery from assembly.
- **`Repositories/ProductRepository.cs`**: High-performance read-only queries with `.AsNoTracking()`, dynamic LINQ filtering, and category aggregation counts.
- **`Repositories/UserRepository.cs`**: Email and phone normalization lookups with uniqueness enforcement.
- **`Repositories/PasswordResetRepository.cs`**: Sliding window OTP queries, invalidation commands, and token lookups.
- **`Services/GmailEmailService.cs`**: MailKit SMTP client dispatching branded HTML emails over TLS on port 587.

### 2.5 NexusBusinessHub.DataImporter (Bulk Catalog Subsystem)
- High-performance, streaming ingestion tool for loading 200,000 products from 4 JSON part files (`SeedData/nexus-products-200000-part1..4.json`).
- Utilizes `SqlBulkCopy` into tempdb heaps (`#StagingProducts`, `#StagingImages`, `#StagingFeatures`, `#StagingSpecifications`).
- Performs set-based `INSERT ... OUTPUT INSERTED.Id INTO #IdMap` merge into `dbo.Products` and related child tables in atomic batches of 1,000 items.
- Delivers ~2,000 products/second throughput with GC memory recycling.

---

## 3. Database & SQL Server Architecture

### 3.1 Connection Configuration
Configured in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=NexusBusinessHubDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3.2 Database Table Catalog
1. `dbo.Products` — 200,000+ catalog items
2. `dbo.Categories` — Product taxonomy classifications
3. `dbo.ProductImages` — Secondary gallery image URLs
4. `dbo.ProductFeatures` — Key product highlights
5. `dbo.ProductSpecifications` — Technical spec key-values
6. `dbo.ProductReviews` — Customer ratings and feedback
7. `dbo.Users` — Registered customer and administrator accounts
8. `dbo.Orders` — Order transactions
9. `dbo.OrderItems` — Order line item details
10. `dbo.Carts` — Shopping cart containers
11. `dbo.CartItems` — Shopping cart line items
12. `dbo.Wishlists` — Customer wishlists
13. `dbo.WishlistItems` — Customer wishlist items
14. `dbo.PasswordResetOtps` — Cryptographically salted verification OTPs
15. `dbo.Addresses` — Shipping and billing addresses
16. `dbo.Notifications` — Customer alerts and notifications
17. `dbo.SearchHistories` — Product search analytics

### 3.3 EF Core Migrations
Migrations are tracked under `backend/NexusBusinessHub.Infrastructure/Persistence/Migrations/`:
- `20260924091000_InitialCreate` — Core tables creation
- `20260925055256_UpdateDecimalPrecision` — Decimal(18,2) precision configuration
- `20260930080805_AddUserUniqueEmailAndPhone` — Unique constraints on User credentials
- `20260930120037_AddPasswordResetOtp` — OTP table for self-service reset

---

## 4. How to Run the Backend

### Prerequisites
- .NET 10 SDK (`dotnet --version` >= 10.0)
- Microsoft SQL Server 2019/2022 or SQL Server Express running locally on `localhost`
- Database named `NexusBusinessHubDb` (or created automatically via EF Core Migrations)

### 4.1 Restore and Build
From the repository root:
```bash
# Restore NuGet dependencies
dotnet restore NexusBusinessHub.slnx

# Build all backend projects
dotnet build NexusBusinessHub.slnx
```

### 4.2 Apply Database Migrations
```bash
dotnet ef database update --project backend/NexusBusinessHub.Infrastructure --startup-project backend/NexusBusinessHub.API
```

### 4.3 Run the Web API
```bash
dotnet run --project backend/NexusBusinessHub.API
```
The API starts on:
- HTTP: `http://localhost:5133`
- HTTPS: `https://localhost:7147`
- Swagger / OpenAPI Explorer: `http://localhost:5133/swagger` (when enabled in development)

### 4.4 Run the 200,000 Product Bulk Importer
To populate or refresh the 200,000 product catalog into SQL Server:
```bash
dotnet run --project backend/NexusBusinessHub.DataImporter
```
The importer validates the database schema, loads categories, streams JSON chunks in 1,000-item batches, outputs progress metrics, and executes verification queries.
