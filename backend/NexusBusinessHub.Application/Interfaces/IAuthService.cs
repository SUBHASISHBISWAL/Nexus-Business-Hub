using NexusBusinessHub.Application.DTOs;

namespace NexusBusinessHub.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

    Task<RegisterResultDto> RegisterAsync(RegisterRequestDto request);

    Task<bool> SendAdminOtpAsync(string email);

    Task<AdminCaptchaResponseDto?> GenerateAdminCaptchaAsync(string email);

    Task<LoginResponseDto?> VerifyAdminOtpAsync(AdminOtpVerifyRequestDto request);

    Task<(bool Success, string Message, int StatusCode)> ForgotPasswordAsync(ForgotPasswordRequestDto request);

    Task<(bool Success, string Message, string? ResetToken, int StatusCode)> VerifyResetOtpAsync(VerifyResetOtpRequestDto request);

    Task<(bool Success, string Message, int StatusCode)> ResetPasswordAsync(ResetPasswordRequestDto request);
}