# Nexus Business Hub Backend

## Projects Overview

- **NexusBusinessHub.API**: ASP.NET Core Web API with JWT Authentication, CORS, and Controllers.
- **NexusBusinessHub.Application**: Application layer with DTOs, Services, and Interfaces.
- **NexusBusinessHub.Domain**: Core Domain Entities and Enums.
- **NexusBusinessHub.Infrastructure**: EF Core `ApplicationDbContext`, Migrations, Repositories, and CatalogSeeder.
- **NexusBusinessHub.DataImporter**: Dedicated console project for one-time bulk product import (200,000 products).

---

## One-Time 200,000 Product Importer

To import the 200,000 product catalog into SQL Server without touching existing products:

From the `backend/` directory:

```bash
dotnet build
dotnet run --project NexusBusinessHub.DataImporter
```

### Connection Configuration
The importer automatically uses the database connection defined in:
- `backend/NexusBusinessHub.DataImporter/appsettings.json`
- `backend/NexusBusinessHub.API/appsettings.json`

Default connection string:
```text
Server=localhost;Database=NexusBusinessHubDb;Trusted_Connection=True;TrustServerCertificate=True;
```

For more details, see [NexusBusinessHub.DataImporter/README.md](file:///c:/Users/ATL/Nexus-Business-Hub/backend/NexusBusinessHub.DataImporter/README.md).
