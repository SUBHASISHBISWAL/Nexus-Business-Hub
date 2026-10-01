using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Infrastructure.Persistence.Configurations;

public class PasswordResetOtpConfiguration : IEntityTypeConfiguration<PasswordResetOtp>
{
    public void Configure(EntityTypeBuilder<PasswordResetOtp> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OtpHash)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(o => o.ResetToken)
            .HasMaxLength(256);

        builder.HasIndex(o => o.UserId);
        builder.HasIndex(o => o.ResetToken);

        builder.HasOne(o => o.User)
            .WithMany()
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
