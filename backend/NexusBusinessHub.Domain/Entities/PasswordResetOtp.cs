namespace NexusBusinessHub.Domain.Entities;

public class PasswordResetOtp : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string OtpHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int AttemptCount { get; set; }
    public bool IsUsed { get; set; }
    public bool IsVerified { get; set; }

    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiresAt { get; set; }
}
