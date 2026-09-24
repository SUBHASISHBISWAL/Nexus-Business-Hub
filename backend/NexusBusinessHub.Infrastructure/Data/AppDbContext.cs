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

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    public DbSet<Address> Addresses => Set<Address>();

    public DbSet<Payment> Payments => Set<Payment>();

    public DbSet<Shipment> Shipments => Set<Shipment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // PRODUCT
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price)
                .HasPrecision(18, 2);

            entity.Property(p => p.OldPrice)
                .HasPrecision(18, 2);

            entity.Property(p => p.Rating)
                .HasPrecision(3, 2);
        });

        // ORDER
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.Property(o => o.OrderNumber)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(o => o.Subtotal)
                .HasPrecision(18, 2);

            entity.Property(o => o.ShippingAmount)
                .HasPrecision(18, 2);

            entity.Property(o => o.DiscountAmount)
                .HasPrecision(18, 2);

            entity.Property(o => o.TaxAmount)
                .HasPrecision(18, 2);

            entity.Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            entity.HasOne(o => o.Address)
                .WithMany(a => a.Orders)
                .HasForeignKey(o => o.AddressId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ORDER ITEM
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(oi => oi.Id);

            entity.Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2);

            entity.Property(oi => oi.TotalPrice)
                .HasPrecision(18, 2);

            entity.HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // PAYMENT
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Amount)
                .HasPrecision(18, 2);

            entity.HasOne(p => p.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // SHIPMENT
        modelBuilder.Entity<Shipment>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.HasOne(s => s.Order)
                .WithOne(o => o.Shipment)
                .HasForeignKey<Shipment>(s => s.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}