namespace NexusBusinessHub.Application.DTOs;

public class VerifyResetOtpResponseDto
{
    public string ResetToken { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
