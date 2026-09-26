using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Infrastructure.Persistence.Configurations;

public class SearchHistoryConfiguration : IEntityTypeConfiguration<SearchHistory>
{
    public void Configure(EntityTypeBuilder<SearchHistory> builder)
    {
        builder.HasKey(sh => sh.Id);

        builder.Property(sh => sh.Query)
            .IsRequired();

        builder.HasOne(sh => sh.User)
            .WithMany()
            .HasForeignKey(sh => sh.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
