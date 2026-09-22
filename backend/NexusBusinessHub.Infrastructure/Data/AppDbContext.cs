using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price)
                .HasPrecision(18, 2);

            entity.Property(p => p.OldPrice)
                .HasPrecision(18, 2);

            entity.Property(p => p.Rating)
                .HasPrecision(3, 2);
        });
    }
}