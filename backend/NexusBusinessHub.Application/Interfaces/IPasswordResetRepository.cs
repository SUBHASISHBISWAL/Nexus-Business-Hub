using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Interfaces;

public interface IPasswordResetRepository
{
    Task<PasswordResetOtp> CreateAsync(PasswordResetOtp otp);
    Task<PasswordResetOtp?> GetLatestActiveOtpByUserIdAsync(int userId);
    Task<PasswordResetOtp?> GetByResetTokenAsync(string resetToken);
    Task UpdateAsync(PasswordResetOtp otp);
    Task InvalidateExistingOtpsAsync(int userId);
}
