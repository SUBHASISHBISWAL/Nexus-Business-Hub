# Nexus Business Hub Database

## Database
NexusBusinessHubDb

## Local Setup

1. Ensure SQL Server is running.
2. Configure the connection string in the API project.
3. From the backend folder, run:

dotnet ef database update --context ApplicationDbContext --project .\NexusBusinessHub.Infrastructure\NexusBusinessHub.Infrastructure.csproj --startup-project .\NexusBusinessHub.API\NexusBusinessHub.API.csproj

## Schema Management

The EF Core migrations under:

NexusBusinessHub.Infrastructure/Persistence/Migrations

are the primary source for database schema changes.

## SQL Scripts

- Setup/ contains database setup instructions/scripts.
- Scripts/ contains seed and utility SQL scripts.

The actual local database is not committed to Git.
