namespace NexusBusinessHub.Application.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetOtpAsync(string recipientEmail, string recipientName, string otp, int expiryMinutes = 5);
}
