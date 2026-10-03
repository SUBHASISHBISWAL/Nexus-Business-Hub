using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NexusBusinessHub.Application.DTOs;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Domain.Entities;
using NexusBusinessHub.Domain.Enums;

namespace NexusBusinessHub.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetRepository _passwordResetRepository;
    private readonly IEmailService _emailService;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;

    private static readonly ConcurrentDictionary<string, AdminOtpData>
        AdminOtps = new();

    private static readonly ConcurrentDictionary<string, CaptchaData>
        Captchas = new();

    public AuthService(
        IUserRepository userRepository,
        IPasswordResetRepository passwordResetRepository,
        IEmailService emailService,
        IPasswordHasher<User> passwordHasher,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _passwordResetRepository = passwordResetRepository;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    // =========================================================
    // NORMAL LOGIN
    // =========================================================

    public async Task<LoginResponseDto?> LoginAsync(
        LoginRequestDto request)
    {
        var identifier = (!string.IsNullOrWhiteSpace(request.Identifier)
            ? request.Identifier
            : request.Email).Trim();

        if (string.IsNullOrWhiteSpace(identifier) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        User? user = null;

        if (identifier.Contains('@'))
        {
            user = await _userRepository.GetByEmailAsync(
                identifier.ToLower());
        }
        else
        {
            var digitsOnly =
                new string(identifier.Where(char.IsDigit).ToArray());

            if (digitsOnly.Length == 12 &&
                digitsOnly.StartsWith("91"))
            {
                digitsOnly = digitsOnly.Substring(2);
            }
            else if (digitsOnly.Length == 11 &&
                     digitsOnly.StartsWith("0"))
            {
                digitsOnly = digitsOnly.Substring(1);
            }

            user =
                await _userRepository.GetByPhoneNumberAsync(identifier)
                ?? (digitsOnly.Length == 10
                    ? await _userRepository.GetByPhoneNumberAsync(digitsOnly)
                    : null);
        }

        if (user == null)
        {
            user =
                await _userRepository.GetByEmailOrPhoneAsync(
                    identifier);
        }

        if (user == null)
        {
            return null;
        }

        if (!user.IsActive)
        {
            return null;
        }

        if (!VerifyPassword(user, request.Password))
        {
            return null;
        }

        // =====================================================
        // ADMIN LOGIN
        // =====================================================

        if (user.Role == UserRole.Admin)
        {
            var otpSent =
                await SendAdminOtpAsync(user.Email);

            if (!otpSent)
            {
                return null;
            }

            return new LoginResponseDto
            {
                Token = string.Empty,

                UserId = user.Id,

                FirstName = user.FirstName,

                LastName = user.LastName,

                Email = user.Email,

                PhoneNumber = user.PhoneNumber,

                Role = user.Role.ToString(),

                RequiresOtp = true,

                Message =
                    "OTP has been sent to the registered mobile number."
            };
        }

        // =====================================================
        // CUSTOMER LOGIN
        // =====================================================

        var token =
            GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,

            UserId = user.Id,

            FirstName = user.FirstName,

            LastName = user.LastName,

            Email = user.Email,

            PhoneNumber = user.PhoneNumber,

            Role = user.Role.ToString(),

            RequiresOtp = false,

            Message = "Login successful."
        };
    }

    // =========================================================
    // REGISTER
    // =========================================================

    public async Task<RegisterResultDto> RegisterAsync(
        RegisterRequestDto request)
    {
        var email =
            request.Email.Trim().ToLower();

        var phone =
            request.PhoneNumber.Trim();

        // 1. Check duplicate Email
        if (await _userRepository.EmailExistsAsync(email))
        {
            return new RegisterResultDto
            {
                Success = false,

                IsConflict = true,

                ErrorMessage =
                    "An account with this email already exists."
            };
        }

        // 2. Check duplicate Phone
        if (await _userRepository.PhoneNumberExistsAsync(phone))
        {
            return new RegisterResultDto
            {
                Success = false,

                IsConflict = true,

                ErrorMessage =
                    "An account with this phone number already exists."
            };
        }

        var firstName =
            request.FirstName?.Trim() ?? string.Empty;

        var lastName =
            request.LastName?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(firstName) &&
            !string.IsNullOrWhiteSpace(request.FullName))
        {
            var parts =
                request.FullName
                    .Trim()
                    .Split(
                        ' ',
                        StringSplitOptions.RemoveEmptyEntries);

            firstName =
                parts.Length > 0
                    ? parts[0]
                    : "";

            lastName =
                parts.Length > 1
                    ? string.Join(" ", parts.Skip(1))
                    : "";
        }

        var user = new User
        {
            FirstName = firstName,

            LastName = lastName,

            Email = email,

            PhoneNumber = phone,

            Role = UserRole.Customer,

            IsActive = true
        };

        user.PasswordHash =
            HashPassword(request.Password);

        try
        {
            var createdUser =
                await _userRepository.CreateAsync(user);

            var token =
                GenerateJwtToken(createdUser);

            return new RegisterResultDto
            {
                Success = true,

                Data = new LoginResponseDto
                {
                    Token = token,

                    UserId = createdUser.Id,

                    FirstName = createdUser.FirstName,

                    LastName = createdUser.LastName,

                    Email = createdUser.Email,

                    PhoneNumber = createdUser.PhoneNumber,

                    Role = createdUser.Role.ToString(),

                    RequiresOtp = false,

                    Message =
                        "Registration successful."
                }
            };
        }
        catch (Exception)
        {
            if (await _userRepository.EmailExistsAsync(email))
            {
                return new RegisterResultDto
                {
                    Success = false,

                    IsConflict = true,

                    ErrorMessage =
                        "An account with this email already exists."
                };
            }

            if (await _userRepository.PhoneNumberExistsAsync(phone))
            {
                return new RegisterResultDto
                {
                    Success = false,

                    IsConflict = true,

                    ErrorMessage =
                        "An account with this phone number already exists."
                };
            }

            throw;
        }
    }

    // =========================================================
    // SEND ADMIN OTP
    // =========================================================

    public async Task<bool> SendAdminOtpAsync(string email)
    {
        var user =
            await _userRepository.GetByEmailAsync(
                email.Trim().ToLower());

        if (user == null)
        {
            return false;
        }

        if (user.Role != UserRole.Admin)
        {
            return false;
        }

        var random =
            Random.Shared;

        var otp =
            random.Next(100000, 1000000)
                .ToString();

        var otpData = new AdminOtpData
        {
            Otp = otp,

            ExpiresAt =
                DateTime.UtcNow.AddMinutes(5)
        };

        AdminOtps[email.Trim().ToLower()] =
            otpData;

        // =====================================================
        // DEVELOPMENT / POC
        // =====================================================

        Console.ForegroundColor =
            ConsoleColor.Green;

        Console.WriteLine(
            "================================================");

        Console.WriteLine(
            $"ADMIN OTP FOR {email}: {otp}");

        Console.WriteLine(
            "OTP VALID FOR 5 MINUTES");

        Console.WriteLine(
            "================================================");

        Console.ResetColor();

        return true;
    }

    // =========================================================
    // CAPTCHA GENERATION
    // =========================================================

    public async Task<AdminCaptchaResponseDto?>
        GenerateAdminCaptchaAsync(string email)
    {
        var user =
            await _userRepository.GetByEmailAsync(
                email.Trim().ToLower());

        if (user == null)
        {
            return null;
        }

        if (user.Role != UserRole.Admin)
        {
            return null;
        }

        var random =
            Random.Shared;

        var numberOne =
            random.Next(1, 10);

        var numberTwo =
            random.Next(1, 10);

        var answer =
            numberOne + numberTwo;

        var captchaId =
            Guid.NewGuid().ToString("N");

        Captchas[captchaId] =
            new CaptchaData
            {
                Answer =
                    answer.ToString(),

                ExpiresAt =
                    DateTime.UtcNow.AddMinutes(5)
            };

        return new AdminCaptchaResponseDto
        {
            CaptchaId =
                captchaId,

            Question =
                $"What is {numberOne} + {numberTwo}?"
        };
    }

    // =========================================================
    // VERIFY ADMIN OTP + CAPTCHA
    // =========================================================

    public async Task<LoginResponseDto?>
        VerifyAdminOtpAsync(
            AdminOtpVerifyRequestDto request)
    {
        var email =
            request.Email.Trim().ToLower();

        var user =
            await _userRepository.GetByEmailAsync(email);

        if (user == null)
        {
            return null;
        }

        if (user.Role != UserRole.Admin)
        {
            return null;
        }

        // =====================================================
        // OTP
        // =====================================================

        if (!AdminOtps.TryGetValue(
                email,
                out var otpData))
        {
            return null;
        }

        if (otpData.ExpiresAt < DateTime.UtcNow)
        {
            AdminOtps.TryRemove(
                email,
                out _);

            return null;
        }

        if (otpData.Otp != request.Otp.Trim())
        {
            return null;
        }

        // =====================================================
        // CAPTCHA
        // =====================================================

        if (!Captchas.TryGetValue(
                request.CaptchaId,
                out var captchaData))
        {
            return null;
        }

        if (captchaData.ExpiresAt < DateTime.UtcNow)
        {
            Captchas.TryRemove(
                request.CaptchaId,
                out _);

            return null;
        }

        if (!string.Equals(
                captchaData.Answer,
                request.CaptchaAnswer.Trim(),
                StringComparison.Ordinal))
        {
            return null;
        }

        // =====================================================
        // REMOVE USED OTP / CAPTCHA
        // =====================================================

        AdminOtps.TryRemove(
            email,
            out _);

        Captchas.TryRemove(
            request.CaptchaId,
            out _);

        // =====================================================
        // GENERATE ADMIN JWT
        // =====================================================

        var token =
            GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,

            UserId = user.Id,

            FirstName = user.FirstName,

            LastName = user.LastName,

            Email = user.Email,

            PhoneNumber = user.PhoneNumber,

            Role = user.Role.ToString(),

            RequiresOtp = false,

            Message =
                "Admin verification successful."
        };
    }

    // =========================================================
    // JWT
    // =========================================================

    private string GenerateJwtToken(User user)
    {
        var key =
            _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT key is not configured.");

        var issuer =
            _configuration["Jwt:Issuer"]
            ?? "NexusBusinessHub.API";

        var audience =
            _configuration["Jwt:Audience"]
            ?? "NexusBusinessHub.Client";

        var expiryMinutes =
            int.TryParse(
                _configuration["Jwt:ExpiryMinutes"],
                out var parsedExpiry)
                    ? parsedExpiry
                    : 60;

        var claims = new[]
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                user.Id.ToString()),

            new Claim(
                JwtRegisteredClaimNames.Email,
                user.Email),

            new Claim(
                ClaimTypes.Name,
                $"{user.FirstName} {user.LastName}"),

            new Claim(
                ClaimTypes.Role,
                user.Role.ToString())
        };

        var securityKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key));

        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);

        var token =
            new JwtSecurityToken(
                issuer: issuer,

                audience: audience,

                claims: claims,

                expires:
                    DateTime.UtcNow.AddMinutes(
                        expiryMinutes),

                signingCredentials:
                    credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }

    // =========================================================
    // HASH PASSWORD
    // =========================================================

    private static string HashPassword(string password)
    {
        byte[] salt =
            RandomNumberGenerator.GetBytes(16);

        byte[] hash =
            Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                iterations: 100_000,
                hashAlgorithm: HashAlgorithmName.SHA256,
                outputLength: 32);

        return
            $"{Convert.ToBase64String(salt)}." +
            $"{Convert.ToBase64String(hash)}";
    }

    // =========================================================
    // VERIFY PASSWORD
    // =========================================================

    private bool VerifyPassword(
        User user,
        string password)
    {
        if (string.IsNullOrWhiteSpace(
                user.PasswordHash))
        {
            return false;
        }

        // 1. Try Microsoft Identity PasswordHasher
        try
        {
            var verifyResult =
                _passwordHasher.VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    password);

            if (verifyResult ==
                    PasswordVerificationResult.Success ||
                verifyResult ==
                    PasswordVerificationResult.SuccessRehashNeeded)
            {
                return true;
            }
        }
        catch
        {
            // Continue with legacy checks
        }

        // 2. Try legacy salt.hash
        var parts =
            user.PasswordHash.Split('.');

        if (parts.Length == 2)
        {
            try
            {
                byte[] salt =
                    Convert.FromBase64String(parts[0]);

                byte[] expectedHash =
                    Convert.FromBase64String(parts[1]);

                byte[] actualHash =
                    Rfc2898DeriveBytes.Pbkdf2(
                        password,
                        salt,
                        iterations: 100_000,
                        hashAlgorithm: HashAlgorithmName.SHA256,
                        outputLength: 32);

                return
                    CryptographicOperations
                        .FixedTimeEquals(
                            actualHash,
                            expectedHash);
            }
            catch
            {
                return false;
            }
        }

        // 3. Fallback for raw v3 binary
        try
        {
            byte[] decoded =
                Convert.FromBase64String(
                    user.PasswordHash);

            if (decoded.Length > 13 &&
                decoded[0] == 0x01)
            {
                int iterCount =
                    (int)
                    System.Buffers.Binary
                        .BinaryPrimitives
                        .ReadUInt32BigEndian(
                            decoded.AsSpan(5, 4));

                int saltLength =
                    (int)
                    System.Buffers.Binary
                        .BinaryPrimitives
                        .ReadUInt32BigEndian(
                            decoded.AsSpan(9, 4));

                byte[] salt =
                    decoded
                        .AsSpan(13, saltLength)
                        .ToArray();

                byte[] expectedSubkey =
                    decoded
                        .AsSpan(13 + saltLength)
                        .ToArray();

                byte[] actualSubkey =
                    Rfc2898DeriveBytes.Pbkdf2(
                        password,
                        salt,
                        iterations: iterCount,
                        hashAlgorithm: HashAlgorithmName.SHA256,
                        outputLength:
                            expectedSubkey.Length);

                return
                    CryptographicOperations
                        .FixedTimeEquals(
                            actualSubkey,
                            expectedSubkey);
            }
        }
        catch
        {
            // Continue
        }

        return false;
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public async Task<(bool Success, string Message, int StatusCode)>
        ForgotPasswordAsync(
            ForgotPasswordRequestDto request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(
                request.Identifier))
        {
            return (
                false,
                "Email or phone number is required.",
                400);
        }

        var identifier =
            request.Identifier.Trim();

        User? user = null;

        // =====================================================
        // FIND USER BY EMAIL
        // =====================================================

        if (identifier.Contains('@'))
        {
            user =
                await _userRepository.GetByEmailAsync(
                    identifier.ToLower());
        }
        else
        {
            // =================================================
            // FIND USER BY PHONE
            // =================================================

            var digitsOnly =
                new string(
                    identifier.Where(
                        char.IsDigit)
                    .ToArray());

            if (digitsOnly.Length == 12 &&
                digitsOnly.StartsWith("91"))
            {
                digitsOnly =
                    digitsOnly.Substring(2);
            }
            else if (digitsOnly.Length == 11 &&
                     digitsOnly.StartsWith("0"))
            {
                digitsOnly =
                    digitsOnly.Substring(1);
            }

            user =
                await _userRepository
                    .GetByPhoneNumberAsync(
                        identifier)
                ?? (digitsOnly.Length == 10
                    ? await _userRepository
                        .GetByPhoneNumberAsync(
                            digitsOnly)
                    : null);
        }

        // =====================================================
        // FALLBACK EMAIL OR PHONE SEARCH
        // =====================================================

        if (user == null)
        {
            user =
                await _userRepository
                    .GetByEmailOrPhoneAsync(
                        identifier);
        }

        // =====================================================
        // ACCOUNT NOT FOUND
        // =====================================================

        if (user == null)
        {
            if (identifier.Contains('@'))
            {
                return (
                    false,
                    "No account found with this email address. Please check your email and try again.",
                    404);
            }

            return (
                false,
                "No account found with this phone number. Please check your phone number and try again.",
                404);
        }

        // =====================================================
        // ACCOUNT INACTIVE
        // =====================================================

        if (!user.IsActive)
        {
            return (
                false,
                "This account is currently inactive. Please contact support.",
                403);
        }

        // =====================================================
        // NO REGISTERED EMAIL
        // =====================================================

        if (string.IsNullOrWhiteSpace(user.Email))
        {
            return (
                false,
                "No registered email address is available for this account.",
                400);
        }

        // =====================================================
        // RATE LIMITING - 60 SECOND COOLDOWN
        // =====================================================

        var latestOtp =
            await _passwordResetRepository
                .GetLatestActiveOtpByUserIdAsync(
                    user.Id);

        if (latestOtp != null &&
            latestOtp.CreatedAt >
                DateTime.UtcNow.AddSeconds(-60))
        {
            var remainingSeconds =
                60 -
                (int)
                (DateTime.UtcNow - latestOtp.CreatedAt)
                    .TotalSeconds;

            if (remainingSeconds > 0)
            {
                return (
                    false,
                    $"Please wait {remainingSeconds} seconds before requesting a new verification code.",
                    429);
            }
        }

        // =====================================================
        // INVALIDATE PREVIOUS OTPs
        // =====================================================

        await _passwordResetRepository
            .InvalidateExistingOtpsAsync(
                user.Id);

        // =====================================================
        // GENERATE SECURE 6-DIGIT OTP
        // =====================================================

        var otp =
            RandomNumberGenerator
                .GetInt32(
                    100000,
                    1000000)
                .ToString();

        // =====================================================
        // HASH OTP
        // =====================================================

        byte[] saltBytes =
            RandomNumberGenerator.GetBytes(16);

        string salt =
            Convert.ToBase64String(
                saltBytes);

        using var sha =
            SHA256.Create();

        byte[] hashBytes =
            sha.ComputeHash(
                Encoding.UTF8.GetBytes(
                    salt + ":" + otp));

        string otpHash =
            $"{salt}:{Convert.ToBase64String(hashBytes)}";

        // =====================================================
        // CREATE RESET OTP
        // =====================================================

        var resetOtp =
            new PasswordResetOtp
            {
                UserId =
                    user.Id,

                OtpHash =
                    otpHash,

                ExpiresAt =
                    DateTime.UtcNow.AddMinutes(5),

                AttemptCount =
                    0,

                IsUsed =
                    false,

                IsVerified =
                    false,

                CreatedAt =
                    DateTime.UtcNow,

                UpdatedAt =
                    DateTime.UtcNow
            };

        await _passwordResetRepository
            .CreateAsync(
                resetOtp);

        // =====================================================
        // SEND OTP EMAIL
        // =====================================================

        try
        {
            var recipientName =
                $"{user.FirstName} {user.LastName}"
                    .Trim();

            await _emailService
                .SendPasswordResetOtpAsync(
                    user.Email,
                    recipientName,
                    otp,
                    5);
        }
        catch (Exception)
        {
            // Do not keep OTP active
            // if email sending fails.

            resetOtp.IsUsed = true;

            await _passwordResetRepository
                .UpdateAsync(
                    resetOtp);

            return (
                false,
                "We couldn't send the verification code. Please try again later.",
                502);
        }

        // =====================================================
        // SUCCESS
        // =====================================================

        return (
            true,
            "We've sent a 6-digit verification code to your registered email.",
            200);
    }

    // =========================================================
    // VERIFY RESET OTP
    // =========================================================

    public async Task<(
        bool Success,
        string Message,
        string? ResetToken,
        int StatusCode)>
        VerifyResetOtpAsync(
            VerifyResetOtpRequestDto request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(
                request.Identifier))
        {
            return (
                false,
                "Email or phone number is required.",
                null,
                400);
        }

        var otpClean =
            request.Otp?.Trim();

        if (string.IsNullOrWhiteSpace(otpClean) ||
            otpClean.Length != 6 ||
            !otpClean.All(char.IsDigit))
        {
            return (
                false,
                "Please provide a valid 6-digit verification code.",
                null,
                400);
        }

        var identifier =
            request.Identifier.Trim();

        User? user = null;

        // =====================================================
        // FIND USER BY EMAIL OR PHONE
        // =====================================================

        if (identifier.Contains('@'))
        {
            user =
                await _userRepository
                    .GetByEmailAsync(
                        identifier.ToLower());
        }
        else
        {
            var digitsOnly =
                new string(
                    identifier.Where(
                        char.IsDigit)
                    .ToArray());

            if (digitsOnly.Length == 12 &&
                digitsOnly.StartsWith("91"))
            {
                digitsOnly =
                    digitsOnly.Substring(2);
            }
            else if (digitsOnly.Length == 11 &&
                     digitsOnly.StartsWith("0"))
            {
                digitsOnly =
                    digitsOnly.Substring(1);
            }

            user =
                await _userRepository
                    .GetByPhoneNumberAsync(
                        identifier)
                ?? (digitsOnly.Length == 10
                    ? await _userRepository
                        .GetByPhoneNumberAsync(
                            digitsOnly)
                    : null);
        }

        if (user == null)
        {
            user =
                await _userRepository
                    .GetByEmailOrPhoneAsync(
                        identifier);
        }

        if (user == null ||
            !user.IsActive)
        {
            return (
                false,
                "Invalid or expired verification code.",
                null,
                400);
        }

        // =====================================================
        // GET ACTIVE OTP
        // =====================================================

        var activeOtp =
            await _passwordResetRepository
                .GetLatestActiveOtpByUserIdAsync(
                    user.Id);

        if (activeOtp == null ||
            activeOtp.IsUsed)
        {
            return (
                false,
                "No active verification request found. Please request a new OTP.",
                null,
                400);
        }

        // =====================================================
        // OTP EXPIRY
        // =====================================================

        if (activeOtp.ExpiresAt <
            DateTime.UtcNow)
        {
            activeOtp.IsUsed = true;

            await _passwordResetRepository
                .UpdateAsync(
                    activeOtp);

            return (
                false,
                "Verification code has expired. Please request a new OTP.",
                null,
                400);
        }

        // =====================================================
        // MAX ATTEMPTS
        // =====================================================

        if (activeOtp.AttemptCount >= 5)
        {
            activeOtp.IsUsed = true;

            await _passwordResetRepository
                .UpdateAsync(
                    activeOtp);

            return (
                false,
                "Maximum verification attempts exceeded. Please request a new OTP.",
                null,
                400);
        }

        activeOtp.AttemptCount++;

        // =====================================================
        // VERIFY OTP HASH
        // =====================================================

        bool matches = false;

        var parts =
            activeOtp.OtpHash.Split(':');

        if (parts.Length == 2)
        {
            var salt =
                parts[0];

            try
            {
                var expectedHash =
                    Convert.FromBase64String(
                        parts[1]);

                using var sha =
                    SHA256.Create();

                var actualHash =
                    sha.ComputeHash(
                        Encoding.UTF8.GetBytes(
                            salt + ":" + otpClean));

                matches =
                    CryptographicOperations
                        .FixedTimeEquals(
                            actualHash,
                            expectedHash);
            }
            catch
            {
                matches = false;
            }
        }

        // =====================================================
        // INVALID OTP
        // =====================================================

        if (!matches)
        {
            if (activeOtp.AttemptCount >= 5)
            {
                activeOtp.IsUsed = true;

                await _passwordResetRepository
                    .UpdateAsync(
                        activeOtp);

                return (
                    false,
                    "Maximum verification attempts exceeded. Please request a new OTP.",
                    null,
                    400);
            }

            await _passwordResetRepository
                .UpdateAsync(
                    activeOtp);

            int remaining =
                5 - activeOtp.AttemptCount;

            return (
                false,
                $"Invalid verification code. {remaining} attempt{(remaining == 1 ? "" : "s")} remaining.",
                null,
                400);
        }

        // =====================================================
        // VALID OTP -> GENERATE RESET TOKEN
        // =====================================================

        var resetToken =
            Convert.ToHexString(
                RandomNumberGenerator
                    .GetBytes(32));

        activeOtp.IsVerified =
            true;

        activeOtp.ResetToken =
            resetToken;

        activeOtp.ResetTokenExpiresAt =
            DateTime.UtcNow.AddMinutes(15);

        await _passwordResetRepository
            .UpdateAsync(
                activeOtp);

        return (
            true,
            "OTP verified successfully.",
            resetToken,
            200);
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public async Task<(bool Success, string Message, int StatusCode)>
        ResetPasswordAsync(
            ResetPasswordRequestDto request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(
                request.ResetToken))
        {
            return (
                false,
                "Password reset token is required.",
                400);
        }

        if (string.IsNullOrWhiteSpace(
                request.NewPassword))
        {
            return (
                false,
                "New password is required.",
                400);
        }

        var password =
            request.NewPassword;

        // =====================================================
        // PASSWORD VALIDATION
        // =====================================================

        if (password.Length < 8)
        {
            return (
                false,
                "Password must be at least 8 characters long.",
                400);
        }

        if (!password.Any(char.IsUpper))
        {
            return (
                false,
                "Password must contain at least one uppercase letter.",
                400);
        }

        if (!password.Any(char.IsLower))
        {
            return (
                false,
                "Password must contain at least one lowercase letter.",
                400);
        }

        if (!password.Any(char.IsDigit))
        {
            return (
                false,
                "Password must contain at least one number.",
                400);
        }

        // =====================================================
        // FIND RESET TOKEN
        // =====================================================

        var otpEntity =
            await _passwordResetRepository
                .GetByResetTokenAsync(
                    request.ResetToken.Trim());

        if (otpEntity == null ||
            !otpEntity.IsVerified ||
            otpEntity.IsUsed)
        {
            return (
                false,
                "Invalid or expired password reset token. Please request a new OTP.",
                400);
        }

        // =====================================================
        // RESET TOKEN EXPIRY
        // =====================================================

        if (otpEntity.ResetTokenExpiresAt == null ||
            otpEntity.ResetTokenExpiresAt <
                DateTime.UtcNow)
        {
            otpEntity.IsUsed = true;

            await _passwordResetRepository
                .UpdateAsync(
                    otpEntity);

            return (
                false,
                "Password reset token has expired. Please request a new OTP.",
                400);
        }

        // =====================================================
        // GET USER
        // =====================================================

        var user =
            await _userRepository
                .GetByIdAsync(
                    otpEntity.UserId);

        if (user == null ||
            !user.IsActive)
        {
            return (
                false,
                "User account not found or inactive.",
                400);
        }

        // =====================================================
        // UPDATE PASSWORD
        // =====================================================

        user.PasswordHash =
            _passwordHasher.HashPassword(
                user,
                password);

        await _userRepository
            .UpdateAsync(
                user);

        // =====================================================
        // INVALIDATE RESET TOKEN
        // =====================================================

        otpEntity.IsUsed = true;

        otpEntity.ResetToken = null;

        await _passwordResetRepository
            .UpdateAsync(
                otpEntity);

        return (
            true,
            "Password has been reset successfully. Please login with your new password.",
            200);
    }

    // =========================================================
    // INTERNAL MODELS
    // =========================================================

    private class AdminOtpData
    {
        public string Otp { get; set; } =
            string.Empty;

        public DateTime ExpiresAt { get; set; }
    }

    private class CaptchaData
    {
        public string Answer { get; set; } =
            string.Empty;

        public DateTime ExpiresAt { get; set; }
    }
}