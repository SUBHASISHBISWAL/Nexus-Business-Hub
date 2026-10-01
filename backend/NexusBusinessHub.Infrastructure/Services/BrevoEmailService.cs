using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NexusBusinessHub.Application.Interfaces;

namespace NexusBusinessHub.Infrastructure.Services;

public class BrevoEmailService : IEmailService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<BrevoEmailService> _logger;

    public BrevoEmailService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<BrevoEmailService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetOtpAsync(
        string recipientEmail,
        string recipientName,
        string otp,
        int expiryMinutes = 5)
    {
        var apiKey = _configuration["Brevo:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogError("Brevo API key is missing in configuration.");
            throw new InvalidOperationException("Email service configuration error: API key is not configured.");
        }

        var senderEmail = _configuration["Brevo:SenderEmail"] ?? "subhasishbiswal2602@gmail.com";
        var senderName = _configuration["Brevo:SenderName"] ?? "Nexus Business Hub";

        var client = _httpClientFactory.CreateClient("BrevoClient");

        var displayName = !string.IsNullOrWhiteSpace(recipientName) ? recipientName : "Nexus Customer";

        var htmlContent = BuildPasswordResetEmailHtml(displayName, otp, expiryMinutes);

        var payload = new BrevoEmailPayload
        {
            Sender = new BrevoSender
            {
                Name = senderName,
                Email = senderEmail
            },
            To = new List<BrevoRecipient>
            {
                new()
                {
                    Email = recipientEmail,
                    Name = displayName
                }
            },
            Subject = $"Nexus Business Hub - Password Reset Code: {otp}",
            HtmlContent = htmlContent
        };

        var json = JsonSerializer.Serialize(payload);
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        request.Headers.Add("api-key", apiKey);

        HttpResponseMessage response;
        try
        {
            response = await client.SendAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Network error while sending email via Brevo.");
            throw new HttpRequestException("Failed to reach email service. Please check your internet connection and try again.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var rawError = await response.Content.ReadAsStringAsync();
            var statusCode = (int)response.StatusCode;

            _logger.LogWarning("Brevo email API failed with status code {StatusCode}", statusCode);

            string parsedErrorMessage = $"Email service responded with status {statusCode}.";
            try
            {
                using var doc = JsonDocument.Parse(rawError);
                if (doc.RootElement.TryGetProperty("message", out var msgProp) && !string.IsNullOrWhiteSpace(msgProp.GetString()))
                {
                    parsedErrorMessage = msgProp.GetString()!;
                }
            }
            catch
            {
                if (!string.IsNullOrWhiteSpace(rawError) && rawError.Length < 300)
                {
                    parsedErrorMessage = rawError;
                }
            }

            throw new InvalidOperationException($"Email delivery rejected by Brevo: {parsedErrorMessage}");
        }
    }

    private static string BuildPasswordResetEmailHtml(string name, string otp, int expiryMinutes)
    {
        return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
  <meta charset=""UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Password Reset OTP - Nexus Business Hub</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;"">
  <table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""background-color: #f1f5f9; padding: 40px 15px;"">
    <tr>
      <td align=""center"">
        <table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;"">
          
          <!-- Header Branding -->
          <tr>
            <td style=""background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 30px; text-align: center;"">
              <table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"">
                <tr>
                  <td align=""center"">
                    <span style=""display: inline-block; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase;"">
                      NEXUS <span style=""color: #38bdf8;"">BUSINESS HUB</span>
                    </span>
                    <p style=""margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; letter-spacing: 0.5px;"">
                      Enterprise Commerce &amp; Solutions
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style=""padding: 36px 32px;"">
              <h2 style=""margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;"">
                Password Reset Verification
              </h2>

              <p style=""margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                Hello <strong>{System.Net.WebUtility.HtmlEncode(name)}</strong>,
              </p>

              <p style=""margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                We received a request to reset your password for your <strong>Nexus Business Hub</strong> account. Use the verification code below to complete your password reset:
              </p>

              <!-- OTP Code Display Box -->
              <table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""margin: 28px 0;"">
                <tr>
                  <td align=""center"">
                    <div style=""display: inline-block; background-color: #f8fafc; border: 2px dashed #0284c7; border-radius: 10px; padding: 18px 36px; text-align: center;"">
                      <span style=""font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #0f172a; display: block;"">
                        {otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style=""margin: 0 0 24px 0; font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;"">
                ⏳ This verification code expires in <strong>{expiryMinutes} minutes</strong> and can only be used once.
              </p>

              <!-- Security Warning Box -->
              <div style=""background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; margin: 24px 0;"">
                <p style=""margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;"">
                  <strong>⚠️ Security Warning:</strong> Do not share this OTP with anyone. Nexus Business Hub support staff will never ask for your verification code. If you did not request a password reset, please ignore this email or update your account security immediately.
                </p>
              </div>

              <p style=""margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                Regards,<br>
                <strong>Nexus Business Hub Security Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style=""background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;"">
              <p style=""margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;"">
                &copy; {DateTime.UtcNow.Year} Nexus Business Hub. All rights reserved.
              </p>
              <p style=""margin: 0; font-size: 11px; color: #cbd5e1;"">
                This is an automated security notification. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
    }

    private class BrevoEmailPayload
    {
        [JsonPropertyName("sender")]
        public BrevoSender Sender { get; set; } = null!;

        [JsonPropertyName("to")]
        public List<BrevoRecipient> To { get; set; } = new();

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("htmlContent")]
        public string HtmlContent { get; set; } = string.Empty;
    }

    private class BrevoSender
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }

    private class BrevoRecipient
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}
