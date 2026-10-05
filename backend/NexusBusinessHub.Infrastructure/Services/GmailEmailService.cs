
using System.Net;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using NexusBusinessHub.Application.Interfaces;

namespace NexusBusinessHub.Infrastructure.Services;

public class GmailEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<GmailEmailService> _logger;

    public GmailEmailService(
        IConfiguration configuration,
        ILogger<GmailEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetOtpAsync(
        string recipientEmail,
        string recipientName,
        string otp,
        int expiryMinutes = 5)
    {
        var senderEmail = _configuration["Gmail:Email"]?.Trim();
        var appPassword = _configuration["Gmail:AppPassword"]?.Replace(" ", "").Trim();

        if (string.IsNullOrWhiteSpace(senderEmail))
        {
            _logger.LogError("Gmail sender email is missing. Please configure 'Gmail:Email' in User Secrets.");

            throw new InvalidOperationException(
                "Email service configuration error: Gmail email is not configured.");
        }

        if (string.IsNullOrWhiteSpace(appPassword))
        {
            _logger.LogError("Gmail app password is missing. Please configure 'Gmail:AppPassword' in User Secrets.");

            throw new InvalidOperationException(
                "Email service configuration error: Gmail app password is not configured.");
        }

        var displayName = !string.IsNullOrWhiteSpace(recipientName)
            ? recipientName
            : "Nexus Customer";

        var message = new MimeMessage();

        message.From.Add(
            new MailboxAddress(
                "Nexus Business Hub",
                senderEmail));

        message.To.Add(
            new MailboxAddress(
                displayName,
                recipientEmail));

        message.Subject =
            $"Nexus Business Hub - Password Reset Code: {otp}";

        message.Body = new BodyBuilder
        {
            HtmlBody = BuildPasswordResetEmailHtml(
                displayName,
                otp,
                expiryMinutes)
        }.ToMessageBody();

        try
        {
            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                "smtp.gmail.com",
                587,
                SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(
                senderEmail,
                appPassword);

            await smtp.SendAsync(message);

            await smtp.DisconnectAsync(true);

            _logger.LogInformation(
                "Password reset OTP email sent successfully to {RecipientEmail}",
                recipientEmail);
        }
        catch (MailKit.Security.AuthenticationException ex)
        {
            _logger.LogError(
                "Gmail SMTP authentication failed: Invalid username or App Password. Please verify that 'Gmail:Email' and a valid 16-character Google App Password (not the normal account password) are configured in User Secrets.");

            throw new InvalidOperationException(
                "Email authentication failed. Please check the Gmail App Password configuration.",
                ex);
        }
        catch (SmtpCommandException ex) when (ex.StatusCode == SmtpStatusCode.AuthenticationRequired ||
                                              (ex.Message != null && (ex.Message.Contains("5.7.8") || ex.Message.Contains("Username and Password not accepted"))))
        {
            _logger.LogError(
                "Gmail SMTP authentication failed (5.7.8): Username and Password not accepted. Please verify that 'Gmail:Email' and a valid 16-character Google App Password (not the normal account password) are configured in User Secrets.");

            throw new InvalidOperationException(
                "Email authentication failed. Please check the Gmail App Password configuration.",
                ex);
        }
        catch (SmtpProtocolException ex) when (ex.Message != null && (ex.Message.Contains("5.7.8") || ex.Message.Contains("Username and Password not accepted")))
        {
            _logger.LogError(
                "Gmail SMTP authentication failed (5.7.8): The SMTP server disconnected because the Username and Password were not accepted. Please verify that 'Gmail:Email' and a valid 16-character Google App Password (not the normal account password) are configured in User Secrets.");

            throw new InvalidOperationException(
                "Email authentication failed. Please check the Gmail App Password configuration.",
                ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                "Failed to send password reset email through Gmail SMTP. Reason: {ErrorMessage}",
                ex.Message);

            throw new HttpRequestException(
                "Failed to send password reset email. Please try again later.",
                ex);
        }
    }

    private static string BuildPasswordResetEmailHtml(
        string name,
        string otp,
        int expiryMinutes)
    {
        var safeName = WebUtility.HtmlEncode(name);
        var safeOtp = WebUtility.HtmlEncode(otp);

        return $@"
<!DOCTYPE html>
<html lang=""en"">

<head>
    <meta charset=""UTF-8"">
    <meta
        name=""viewport""
        content=""width=device-width, initial-scale=1.0"">
    <title>Password Reset OTP - Nexus Business Hub</title>
</head>

<body
    style=""
        margin:0;
        padding:0;
        background-color:#f1f5f9;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',
        Roboto,Helvetica,Arial,sans-serif;
        color:#334155;
    "">

<table
    role=""presentation""
    border=""0""
    cellpadding=""0""
    cellspacing=""0""
    width=""100%""
    style=""
        background-color:#f1f5f9;
        padding:40px 15px;
    "">

    <tr>
        <td align=""center"">

            <table
                role=""presentation""
                border=""0""
                cellpadding=""0""
                cellspacing=""0""
                width=""100%""
                style=""
                    max-width:560px;
                    background-color:#ffffff;
                    border-radius:12px;
                    overflow:hidden;
                    box-shadow:0 4px 12px rgba(15,23,42,0.08);
                    border:1px solid #e2e8f0;
                "">

                <tr>
                    <td
                        style=""
                            background:linear-gradient(
                                135deg,
                                #0f172a 0%,
                                #1e293b 100%
                            );
                            padding:32px 30px;
                            text-align:center;
                        "">

                        <span
                            style=""
                                display:inline-block;
                                font-size:22px;
                                font-weight:800;
                                letter-spacing:1.5px;
                                color:#ffffff;
                                text-transform:uppercase;
                            "">

                            NEXUS
                            <span style=""color:#38bdf8;"">
                                BUSINESS HUB
                            </span>

                        </span>

                        <p
                            style=""
                                margin:6px 0 0 0;
                                font-size:13px;
                                color:#94a3b8;
                                letter-spacing:0.5px;
                            "">

                            Enterprise Commerce &amp; Solutions

                        </p>

                    </td>
                </tr>

                <tr>
                    <td style=""padding:36px 32px;"">

                        <h2
                            style=""
                                margin:0 0 16px 0;
                                font-size:20px;
                                font-weight:700;
                                color:#0f172a;
                            "">

                            Password Reset Verification

                        </h2>

                        <p
                            style=""
                                margin:0 0 16px 0;
                                font-size:14px;
                                line-height:1.6;
                                color:#475569;
                            "">

                            Hello <strong>{safeName}</strong>,

                        </p>

                        <p
                            style=""
                                margin:0 0 24px 0;
                                font-size:14px;
                                line-height:1.6;
                                color:#475569;
                            "">

                            We received a request to reset your
                            <strong>Nexus Business Hub</strong>
                            account password.

                            Use the verification code below to
                            complete your password reset.

                        </p>

                        <table
                            role=""presentation""
                            border=""0""
                            cellpadding=""0""
                            cellspacing=""0""
                            width=""100%""
                            style=""margin:28px 0;"">

                            <tr>
                                <td align=""center"">

                                    <div
                                        style=""
                                            display:inline-block;
                                            background-color:#f8fafc;
                                            border:2px dashed #0284c7;
                                            border-radius:10px;
                                            padding:18px 36px;
                                            text-align:center;
                                        "">

                                        <span
                                            style=""
                                                font-family:
                                                    'Courier New',
                                                    Courier,
                                                    monospace;
                                                font-size:34px;
                                                font-weight:800;
                                                letter-spacing:10px;
                                                color:#0f172a;
                                                display:block;
                                            "">

                                            {safeOtp}

                                        </span>

                                    </div>

                                </td>
                            </tr>

                        </table>

                        <p
                            style=""
                                margin:0 0 24px 0;
                                font-size:13px;
                                line-height:1.5;
                                color:#64748b;
                                text-align:center;
                            "">

                            ⏳ This verification code expires in
                            <strong>{expiryMinutes} minutes</strong>
                            and can only be used once.

                        </p>

                        <div
                            style=""
                                background-color:#fffbeb;
                                border-left:4px solid #f59e0b;
                                padding:14px 16px;
                                border-radius:6px;
                                margin:24px 0;
                            "">

                            <p
                                style=""
                                    margin:0;
                                    font-size:13px;
                                    line-height:1.5;
                                    color:#92400e;
                                "">

                                <strong>⚠️ Security Warning:</strong>

                                Do not share this OTP with anyone.

                                Nexus Business Hub support staff will
                                never ask for your verification code.

                                If you did not request a password reset,
                                please ignore this email.

                            </p>

                        </div>

                        <p
                            style=""
                                margin:24px 0 0 0;
                                font-size:14px;
                                line-height:1.6;
                                color:#475569;
                            "">

                            Regards,<br>

                            <strong>
                                Nexus Business Hub Security Team
                            </strong>

                        </p>

                    </td>
                </tr>

                <tr>
                    <td
                        style=""
                            background-color:#f8fafc;
                            padding:20px 32px;
                            border-top:1px solid #e2e8f0;
                            text-align:center;
                        "">

                        <p
                            style=""
                                margin:0 0 6px 0;
                                font-size:12px;
                                color:#94a3b8;
                            "">

                            &copy; {DateTime.UtcNow.Year}
                            Nexus Business Hub.
                            All rights reserved.

                        </p>

                        <p
                            style=""
                                margin:0;
                                font-size:11px;
                                color:#cbd5e1;
                            "">

                            This is an automated security notification.
                            Please do not reply directly to this email.

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
}
