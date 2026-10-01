namespace NexusBusinessHub.Application.DTOs;

public class AdminOtpVerifyRequestDto
{
    public string Email { get; set; } = string.Empty;

    public string Otp { get; set; } = string.Empty;

    public string CaptchaId { get; set; } = string.Empty;

    public string CaptchaAnswer { get; set; } = string.Empty;
}