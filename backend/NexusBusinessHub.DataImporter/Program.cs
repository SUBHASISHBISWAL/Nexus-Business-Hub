using Microsoft.Extensions.Configuration;
using NexusBusinessHub.DataImporter.Services;

namespace NexusBusinessHub.DataImporter;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        try
        {
            var config = BuildConfiguration(args);

            // 1. Resolve Connection String
            string? connectionString = null;

            // CLI override: --connection-string "..."
            for (int i = 0; i < args.Length - 1; i++)
            {
                if (args[i].Equals("--connection-string", StringComparison.OrdinalIgnoreCase) ||
                    args[i].Equals("-c", StringComparison.OrdinalIgnoreCase))
                {
                    connectionString = args[i + 1];
                    break;
                }
            }

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = config.GetConnectionString("DefaultConnection");
            }

            // Fallback to API appsettings.json if still not found
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var apiAppSettingsPath = FindFileUpwards("NexusBusinessHub.API/appsettings.json");
                if (apiAppSettingsPath != null && File.Exists(apiAppSettingsPath))
                {
                    var apiConfig = new ConfigurationBuilder()
                        .AddJsonFile(apiAppSettingsPath, optional: true)
                        .Build();
                    connectionString = apiConfig.GetConnectionString("DefaultConnection");
                }
            }

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = "Server=localhost;Database=NexusBusinessHubDb;Trusted_Connection=True;TrustServerCertificate=True;";
            }

            // 2. Resolve Batch Size
            int batchSize = 1000;
            for (int i = 0; i < args.Length - 1; i++)
            {
                if (args[i].Equals("--batch-size", StringComparison.OrdinalIgnoreCase) ||
                    args[i].Equals("-b", StringComparison.OrdinalIgnoreCase))
                {
                    if (int.TryParse(args[i + 1], out var parsedBatchSize) && parsedBatchSize > 0)
                    {
                        batchSize = parsedBatchSize;
                    }
                    break;
                }
            }

            if (batchSize == 1000 && int.TryParse(config["ImporterSettings:BatchSize"], out var cfgBatchSize) && cfgBatchSize > 0)
            {
                batchSize = cfgBatchSize;
            }

            // 3. Resolve Seed Data Directory
            string? dataDir = null;
            for (int i = 0; i < args.Length - 1; i++)
            {
                if (args[i].Equals("--data-dir", StringComparison.OrdinalIgnoreCase) ||
                    args[i].Equals("-d", StringComparison.OrdinalIgnoreCase))
                {
                    dataDir = args[i + 1];
                    break;
                }
            }

            if (string.IsNullOrWhiteSpace(dataDir))
            {
                dataDir = ResolveSeedDataDirectory();
            }

            if (string.IsNullOrWhiteSpace(dataDir) || !Directory.Exists(dataDir))
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[ERROR] SeedData directory could not be located. Looked in expected relative paths.");
                Console.WriteLine($"Please specify with: --data-dir <path-to-SeedData>");
                Console.ResetColor();
                return 1;
            }

            // 4. Run Importer
            var importer = new ProductBulkImporter(connectionString, batchSize, dataDir);
            await importer.RunAsync();

            return 0;
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"\n[FATAL ERROR] {ex.Message}");
            Console.WriteLine(ex.ToString());
            Console.ResetColor();
            return 1;
        }
    }

    private static IConfiguration BuildConfiguration(string[] args)
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables();

        return builder.Build();
    }

    private static string? ResolveSeedDataDirectory()
    {
        var candidates = new[]
        {
            Path.Combine(Directory.GetCurrentDirectory(), "SeedData"),
            Path.Combine(Directory.GetCurrentDirectory(), "NexusBusinessHub.API", "SeedData"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "NexusBusinessHub.API", "SeedData"),
            Path.Combine(Directory.GetCurrentDirectory(), "backend", "NexusBusinessHub.API", "SeedData"),
            Path.Combine(AppContext.BaseDirectory, "SeedData"),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "NexusBusinessHub.API", "SeedData"),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "backend", "NexusBusinessHub.API", "SeedData")
        };

        foreach (var c in candidates)
        {
            var fullPath = Path.GetFullPath(c);
            if (Directory.Exists(fullPath) && File.Exists(Path.Combine(fullPath, "nexus-products-200000-part1.json")))
            {
                return fullPath;
            }
        }

        return null;
    }

    private static string? FindFileUpwards(string relativePath)
    {
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (dir != null)
        {
            var testPath = Path.Combine(dir.FullName, relativePath);
            if (File.Exists(testPath))
            {
                return testPath;
            }
            dir = dir.Parent;
        }
        return null;
    }
}
