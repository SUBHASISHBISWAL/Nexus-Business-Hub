using Microsoft.AspNetCore.Mvc;
using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Application.Interfaces;

namespace NexusBusinessHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequestDto request)
    {
        var fullName = !string.IsNullOrWhiteSpace(request.FullName)
            ? request.FullName.Trim()
            : $"{request.FirstName} {request.LastName}".Trim();

        if (
            string.IsNullOrWhiteSpace(fullName) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.PhoneNumber) ||
            string.IsNullOrWhiteSpace(request.Password)
        )
        {
            return BadRequest(new
            {
                message =
                    "Full name, email, phone number and password are required."
            });
        }

        var result =
            await _authService.RegisterAsync(request);

        if (!result.Success)
        {
            if (result.IsConflict)
            {
                return Conflict(new
                {
                    message = result.ErrorMessage
                });
            }

            return BadRequest(new
            {
                message = result.ErrorMessage ?? "Registration failed."
            });
        }

        return Ok(result.Data);
    }

    // =========================================================
    // LOGIN
    // =========================================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto request)
    {
        var identifier = !string.IsNullOrWhiteSpace(request.Identifier)
            ? request.Identifier
            : request.Email;

        if (
            string.IsNullOrWhiteSpace(identifier) ||
            string.IsNullOrWhiteSpace(request.Password)
        )
        {
            return BadRequest(new
            {
                message =
                    "Email/phone and password are required."
            });
        }

        var result =
            await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new
            {
                message =
                    "Invalid email/phone or password."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // RESEND ADMIN OTP
    // =========================================================

    [HttpPost("admin/send-otp")]
    public async Task<IActionResult> SendAdminOtp(
        [FromBody] AdminOtpRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        var result =
            await _authService.SendAdminOtpAsync(
                request.Email);

        if (!result)
        {
            return BadRequest(new
            {
                message =
                    "Unable to send admin OTP."
            });
        }

        return Ok(new
        {
            message =
                "OTP sent successfully."
        });
    }

    // =========================================================
    // CAPTCHA
    // =========================================================

    [HttpPost("admin/captcha")]
    public async Task<IActionResult> GenerateCaptcha(
        [FromBody] AdminOtpRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        var result =
            await _authService
                .GenerateAdminCaptchaAsync(
                    request.Email);

        if (result == null)
        {
            return BadRequest(new
            {
                message =
                    "Unable to generate CAPTCHA."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // VERIFY ADMIN OTP + CAPTCHA
    // =========================================================

    [HttpPost("admin/verify-otp")]
    public async Task<IActionResult> VerifyAdminOtp(
        [FromBody] AdminOtpVerifyRequestDto request)
    {
        if (
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Otp) ||
            string.IsNullOrWhiteSpace(request.CaptchaId) ||
            string.IsNullOrWhiteSpace(request.CaptchaAnswer)
        )
        {
            return BadRequest(new
            {
                message =
                    "Email, OTP and CAPTCHA are required."
            });
        }

        var result =
            await _authService.VerifyAdminOtpAsync(
                request);

        if (result == null)
        {
            return Unauthorized(new
            {
                message =
                    "Invalid OTP or CAPTCHA."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequestDto request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Identifier))
        {
            return BadRequest(new
            {
                message = "Email or phone number is required."
            });
        }

        var result = await _authService.ForgotPasswordAsync(request);

        return StatusCode(result.StatusCode, new
        {
            message = result.Message
        });
    }

    // =========================================================
    // VERIFY RESET OTP
    // =========================================================

    [HttpPost("verify-reset-otp")]
    public async Task<IActionResult> VerifyResetOtp(
        [FromBody] VerifyResetOtpRequestDto request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(request.Identifier) ||
            string.IsNullOrWhiteSpace(request.Otp))
        {
            return BadRequest(new
            {
                message = "Identifier and verification code are required."
            });
        }

        var result = await _authService.VerifyResetOtpAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            resetToken = result.ResetToken,
            message = result.Message
        });
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequestDto request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(request.ResetToken) ||
            string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest(new
            {
                message = "Reset token and new password are required."
            });
        }

        var result = await _authService.ResetPasswordAsync(request);

        return StatusCode(result.StatusCode, new
        {
            message = result.Message
        });
    }
}