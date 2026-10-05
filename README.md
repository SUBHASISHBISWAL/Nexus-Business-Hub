# Nexus Business Hub — Enterprise Solutions & Commerce Platform

Welcome to **Nexus Business Hub**, an enterprise-scale distributed commerce platform engineered with **React 19**, **ASP.NET Core 10**, **Entity Framework Core 10**, and **Microsoft SQL Server 2022**.

---

## 1. High-Level Architectural Hierarchy

```text
Nexus Business Hub
│
├── Frontend
│     React 19 + TypeScript + Vite Single Page Application (SPA)
│
├── Backend
│     ASP.NET Core 10 Web API (Clean Architecture)
│
├── Database
│     Microsoft SQL Server 2022 (NexusBusinessHubDb)
│
├── Data Importer
│     High-Performance .NET 10 Console Ingestion Tool (200,000 Products)
│
└── Documentation & PDF
      Comprehensive Architecture Specifications and Audits (docs/)
```

---

## 2. End-to-End Data Communication Pipeline

```text
Frontend (React 19 SPA)
         │
         ▼  HTTPS REST API (Axios JSON)
ASP.NET Core 10 Web API (NexusBusinessHub.API)
         │
         ▼  Dependency Inversion (DI)
Application Services (NexusBusinessHub.Application)
         │
         ▼  Repository Pattern (LINQ queries)
Data Repositories (NexusBusinessHub.Infrastructure)
         │
         ▼  Object-Relational Mapping (AsNoTracking)
Entity Framework Core 10
         │
         ▼  T-SQL (TCP/IP Port 1433)
Microsoft SQL Server 2022 (NexusBusinessHubDb)
```

> [!NOTE]
> **Strict Tier Decoupling**: The React frontend has **no direct database connection** or SQL credentials. All data is retrieved, mutated, and verified strictly through secured REST endpoints.

---

## 3. Subsystem Overview

| Component | Path | Technology | Port / Scope | Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | `frontend/` | React 19, TypeScript, Vite | `http://localhost:5173` | Customer storefront, 48-item paginated catalog, persistent cart, wishlist, checkout, payment simulation, admin portal. |
| **Backend API** | `backend/NexusBusinessHub.API/` | ASP.NET Core 10 | `http://localhost:5133` | JWT bearer auth, CORS, route controllers (`AuthController`, `ProductsController`), Swagger API explorer. |
| **Application** | `backend/NexusBusinessHub.Application/` | .NET 10 Class Library | Internal DI | Business logic, DTOs, interfaces, service layer, PBKDF2 hashing, OTP state management. |
| **Domain** | `backend/NexusBusinessHub.Domain/` | .NET 10 Class Library | Core Invariants | 18 core domain entities (`Product`, `Category`, `User`, `Order`, `Cart`, `Wishlist`, etc.) and enums. |
| **Infrastructure**| `backend/NexusBusinessHub.Infrastructure/` | EF Core 10, MailKit | Persistence | `ApplicationDbContext`, repositories, EF migrations, MailKit Gmail SMTP notification adapter. |
| **Data Importer** | `backend/NexusBusinessHub.DataImporter/` | .NET 10 Console | Batch Task | Streaming bulk ingestion of 200,000 products into SQL Server staging tables via `SqlBulkCopy`. |
| **Architecture PDF** | `docs/Nexus-Business-Hub-Architecture.pdf` | PDF Document | 10 Pages | Executive architecture report covering all system flows, security models, and entity graphs. |

---

## 4. Quick Start Guide

### Step 1: Start Backend API
```bash
# 1. Restore NuGet dependencies
dotnet restore NexusBusinessHub.slnx

# 2. Build backend projects
dotnet build NexusBusinessHub.slnx

# 3. Launch the API Gateway
dotnet run --project backend/NexusBusinessHub.API
```
*API is accessible at: `http://localhost:5133`*

### Step 2: Ingest 200,000 Product Catalog (Optional / One-Time)
```bash
dotnet run --project backend/NexusBusinessHub.DataImporter
```

### Step 3: Start Frontend SPA
```bash
# 1. Open new terminal and enter frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```
*Frontend is accessible at: `http://localhost:5173`*

---

## 5. Security & Sensitive Information Controls

- All sensitive keys (JWT secrets, SMTP credentials, database connection strings) are managed via `appsettings.json`, environment variables, or .NET User Secrets.
- Passwords are encrypted using **PBKDF2** (100,000 iterations of HMAC-SHA256 with 16-byte random salt).
- Administrative access is guarded by Multi-Factor Authentication (OTP + CAPTCHA) and role-based client route guards.

---

## 6. Architecture Specification & Documentation

Detailed technical documentation and architecture blueprints are located in:
- [Frontend Documentation](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/README.md)
- [Backend Documentation](file:///c:/Users/ATL/Nexus-Business-Hub/backend/README.md)
- [Bulk Data Importer Documentation](file:///c:/Users/ATL/Nexus-Business-Hub/backend/NexusBusinessHub.DataImporter/README.md)
- **Executive Architecture PDF**: [`docs/Nexus-Business-Hub-Architecture.pdf`](file:///c:/Users/ATL/Nexus-Business-Hub/docs/Nexus-Business-Hub-Architecture.pdf) (10 Pages)
