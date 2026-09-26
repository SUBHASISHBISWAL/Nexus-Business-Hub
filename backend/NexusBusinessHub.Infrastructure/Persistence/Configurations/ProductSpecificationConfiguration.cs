using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Infrastructure.Persistence.Configurations;

public class ProductSpecificationConfiguration : IEntityTypeConfiguration<ProductSpecification>
{
    public void Configure(EntityTypeBuilder<ProductSpecification> builder)
    {
        builder.HasKey(ps => ps.Id);

        builder.Property(ps => ps.SpecificationName)
            .IsRequired();

        builder.Property(ps => ps.SpecificationValue)
            .IsRequired();

        builder.HasOne(ps => ps.Product)
            .WithMany()
            .HasForeignKey(ps => ps.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
