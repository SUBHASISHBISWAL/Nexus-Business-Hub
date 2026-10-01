using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Domain.Entities;
using NexusBusinessHub.Infrastructure.Persistence;

namespace NexusBusinessHub.Infrastructure.Repositories;

public class PasswordResetRepository : IPasswordResetRepository
{
    private readonly ApplicationDbContext _context;

    public PasswordResetRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PasswordResetOtp> CreateAsync(PasswordResetOtp otp)
    {
        otp.CreatedAt = DateTime.UtcNow;
        otp.UpdatedAt = DateTime.UtcNow;
        _context.PasswordResetOtps.Add(otp);
        await _context.SaveChangesAsync();
        return otp;
    }

    public async Task<PasswordResetOtp?> GetLatestActiveOtpByUserIdAsync(int userId)
    {
        return await _context.PasswordResetOtps
            .Where(o => o.UserId == userId && !o.IsUsed)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<PasswordResetOtp?> GetByResetTokenAsync(string resetToken)
    {
        return await _context.PasswordResetOtps
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.ResetToken == resetToken && !o.IsUsed && o.IsVerified);
    }

    public async Task UpdateAsync(PasswordResetOtp otp)
    {
        otp.UpdatedAt = DateTime.UtcNow;
        _context.PasswordResetOtps.Update(otp);
        await _context.SaveChangesAsync();
    }

    public async Task InvalidateExistingOtpsAsync(int userId)
    {
        var existingOtps = await _context.PasswordResetOtps
            .Where(o => o.UserId == userId && !o.IsUsed)
            .ToListAsync();

        foreach (var otp in existingOtps)
        {
            otp.IsUsed = true;
            otp.UpdatedAt = DateTime.UtcNow;
        }

        if (existingOtps.Count > 0)
        {
            await _context.SaveChangesAsync();
        }
    }
}
