using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Infrastructure.Data;

public static class ProductSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Do not seed again if products already exist
        if (await context.Products.AnyAsync())
        {
            return;
        }

        var products = new List<Product>
        {
            new Product
            {
                Id = 1,
                Name = "Smart IoT Gateway Pro",
                Category = "Electronics",
                Group = "Industrial IoT",
                Price = 24999,
                OldPrice = 29500,
                Rating = 4.9m,
                Reviews = 128,
                Icon = "router",
                Image = "product1.jpg",
                Specs = "Quad ARM A53 1.8GHz · Dual GbE · TPM 2.0",
                Stock = "Ships in 24h",
                Badge = "SAVE 15%",
                RequestOnly = false
            },

            new Product
            {
                Id = 2,
                Name = "EdgeCompute R500",
                Category = "Hardware",
                Group = "Edge Servers",
                Price = 78500,
                Rating = 4.8m,
                Reviews = 64,
                Icon = "dns",
                Image = "product2.jpg",
                Specs = "AMD Ryzen Embedded · 32GB ECC · NVMe RAID",
                Stock = "In Stock",
                Badge = "IP40 RATED",
                RequestOnly = false
            },

            new Product
            {
                Id = 3,
                Name = "NexusOS Fleet Control",
                Category = "Software",
                Group = "Management",
                Price = 12400,
                Rating = 4.9m,
                Reviews = 97,
                Icon = "monitoring",
                Image = "product3.jpg",
                Specs = "Remote OTA · Device telemetry · Role controls",
                Stock = "License Ready",
                Badge = "ANNUAL PLAN",
                RequestOnly = false
            },

            new Product
            {
                Id = 4,
                Name = "Rugged M12 Sensor Cable",
                Category = "Accessories",
                Group = "Cabling",
                Price = 2150,
                Rating = 4.7m,
                Reviews = 44,
                Icon = "cable",
                Image = "product4.jpg",
                Specs = "IP69K washdown · Oil resistant · 5m shielded",
                Stock = "In Stock",
                Badge = "IP69K RATED",
                RequestOnly = false
            },

            new Product
            {
                Id = 5,
                Name = "Thermal Vision Array",
                Category = "Electronics",
                Group = "Sensor Arrays",
                Price = 46800,
                Rating = 4.8m,
                Reviews = 36,
                Icon = "thermal",
                Image = "product5.jpg",
                Specs = "640 × 512 LWIR · -20°C to 85°C · PoE+",
                Stock = "In Stock",
                Badge = "CALIBRATED",
                RequestOnly = false
            },

            new Product
            {
                Id = 6,
                Name = "Nexus Rail Mount Kit",
                Category = "Accessories",
                Group = "Mounting",
                Price = 1890,
                Rating = 4.6m,
                Reviews = 71,
                Icon = "architecture",
                Image = "product6.jpg",
                Specs = "Anodized aluminum · DIN 35 compatible",
                Stock = "In Stock",
                Badge = "FIELD READY",
                RequestOnly = false
            },

            new Product
            {
                Id = 7,
                Name = "Industrial PoE Switch 8P",
                Category = "Hardware",
                Group = "Networking",
                Price = 32800,
                Rating = 4.9m,
                Reviews = 58,
                Icon = "lan",
                Image = "product7.jpg",
                Specs = "8 × GbE PoE+ · 2 × SFP · Redundant power",
                Stock = "Ships in 48h",
                Badge = "MANAGED",
                RequestOnly = false
            },

            new Product
            {
                Id = 8,
                Name = "SignalBridge CAN Module",
                Category = "Electronics",
                Group = "Modules",
                Price = 5799,
                Rating = 4.8m,
                Reviews = 22,
                Icon = "tune",
                Image = "product8.jpg",
                Specs = "2.5kV isolation · Dual CAN 2.0B · Auto-baud",
                Stock = "In Stock",
                Badge = "2.5kV ISOLATION",
                RequestOnly = false
            },

            new Product
            {
                Id = 9,
                Name = "PredictiveOps Studio",
                Category = "Software",
                Group = "Analytics",
                Price = 18900,
                Rating = 4.7m,
                Reviews = 49,
                Icon = "insights",
                Image = "product9.jpg",
                Specs = "Anomaly models · Event rules · CSV export",
                Stock = "License Ready",
                Badge = "AI ENABLED",
                RequestOnly = false
            },

            new Product
            {
                Id = 10,
                Name = "NX-12 Embedded Controller",
                Category = "Hardware",
                Group = "Controllers",
                Price = 44200,
                Rating = 4.8m,
                Reviews = 31,
                Icon = "memory",
                Image = "product10.jpg",
                Specs = "12 I/O channels · RS-485 · Conformal coating",
                Stock = "In Stock",
                Badge = "IEC CERTIFIED",
                RequestOnly = false
            },

            new Product
            {
                Id = 11,
                Name = "SecureLink VPN Gateway",
                Category = "Software",
                Group = "Security",
                Price = 9600,
                Rating = 4.9m,
                Reviews = 83,
                Icon = "shield_lock",
                Image = "product11.jpg",
                Specs = "Zero-trust access · Audit logs · SSO support",
                Stock = "License Ready",
                Badge = "AES-256",
                RequestOnly = false
            },

            new Product
            {
                Id = 12,
                Name = "Nexus Enterprise HSM Rack",
                Category = "Hardware",
                Group = "Cryptographic",
                Price = 412000,
                Rating = 5.0m,
                Reviews = 15,
                Icon = "lock",
                Image = "product12.jpg",
                Specs = "10,000 RSA-4096 ops/s · Dual redundant PSU",
                Stock = "Built-to-Order",
                Badge = "CUSTOM CALIB",
                RequestOnly = false
            },

            new Product
            {
                Id = 13,
                Name = "VibrationSense Mini",
                Category = "Electronics",
                Group = "Sensor Arrays",
                Price = 8990,
                Rating = 4.6m,
                Reviews = 54,
                Icon = "vibration",
                Image = "product13.jpg",
                Specs = "3-axis MEMS · 8kHz sample rate · IP67",
                Stock = "In Stock",
                Badge = "IP67 RATED",
                RequestOnly = false
            },

            new Product
            {
                Id = 14,
                Name = "Field Service Toolkit",
                Category = "Accessories",
                Group = "Tools",
                Price = 6750,
                Rating = 4.7m,
                Reviews = 29,
                Icon = "handyman",
                Image = "product14.jpg",
                Specs = "Crimp tools · Tester · Travel case",
                Stock = "In Stock",
                Badge = "SERVICE KIT",
                RequestOnly = false
            },

            new Product
            {
                Id = 15,
                Name = "Asset Registry Cloud",
                Category = "Software",
                Group = "Management",
                Price = 7200,
                Rating = 4.5m,
                Reviews = 42,
                Icon = "inventory_2",
                Image = "product15.jpg",
                Specs = "QR inventory · Warranty alerts · REST API",
                Stock = "License Ready",
                Badge = "API INCLUDED",
                RequestOnly = false
            },

            new Product
            {
                Id = 16,
                Name = "Nexus Runtime SDK",
                Category = "Software",
                Group = "Development",
                Price = 14800,
                Rating = 4.8m,
                Reviews = 67,
                Icon = "terminal",
                Image = "product16.jpg",
                Specs = "C++ / Python SDK · Signed firmware · CI tools",
                Stock = "License Ready",
                Badge = "DEV LICENSE",
                RequestOnly = false
            }
        };

        // Generate additional products from ID 17 to 300
        var categories = new[]
        {
            "Electronics",
            "Hardware",
            "Software",
            "Accessories"
        };

        var groups = new[]
        {
            "Industrial IoT",
            "Networking",
            "Controllers",
            "Sensor Arrays",
            "Management",
            "Security",
            "Modules",
            "Development",
            "Mounting",
            "Cabling"
        };

        var icons = new[]
        {
            "memory",
            "router",
            "dns",
            "lan",
            "sensors",
            "settings",
            "hub",
            "terminal",
            "cable",
            "inventory_2"
        };

        for (var id = 17; id <= 300; id++)
        {
            var category = categories[(id - 17) % categories.Length];
            var group = groups[(id - 17) % groups.Length];
            var icon = icons[(id - 17) % icons.Length];

            products.Add(new Product
            {
                Id = id,
                Name = $"Nexus {group} Node {id:000}",
                Category = category,
                Group = group,
                Price = 2500 + (id * 137),
                Rating = 4.1m + ((id % 9) * 0.1m),
                Reviews = 10 + (id % 150),
                Icon = icon,
                Image = $"product{((id - 1) % 16) + 1}.jpg",
                Specs = $"Industrial-grade {group} · High reliability · Enterprise ready",
                Stock = id % 5 == 0 ? "Ships in 48h" : "In Stock",
                Badge = id % 3 == 0 ? "ENTERPRISE READY" : "FIELD READY",
                RequestOnly = false
            });
        }

        // Keep the same SQL connection open while using IDENTITY_INSERT.
        await context.Database.OpenConnectionAsync();

        try
        {
            await context.Database.ExecuteSqlRawAsync(
                "SET IDENTITY_INSERT [Products] ON"
            );

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

            await context.Database.ExecuteSqlRawAsync(
                "SET IDENTITY_INSERT [Products] OFF"
            );
        }
        finally
        {
            await context.Database.CloseConnectionAsync();
        }
    }
}