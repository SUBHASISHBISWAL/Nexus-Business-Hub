namespace NexusBusinessHub.Application.DTOs;

public class VerifyResetOtpRequestDto
{
    public string Identifier { get; set; } = string.Empty;
    public string Otp { get; set; } = string.Empty;
}
