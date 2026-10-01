using Microsoft.EntityFrameworkCore;
using NexusBusinessHub.Application.Interfaces;
using NexusBusinessHub.Domain.Entities;
using NexusBusinessHub.Infrastructure.Persistence;

namespace NexusBusinessHub.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLower();

        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.Email.ToLower() == normalizedEmail &&
                u.IsActive);
    }

    public async Task<User?> GetByPhoneNumberAsync(string phoneNumber)
    {
        var cleanPhone = phoneNumber.Trim();

        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.PhoneNumber == cleanPhone &&
                u.IsActive);
    }

    public async Task<User?> GetByEmailOrPhoneAsync(string identifier)
    {
        var clean = identifier.Trim();
        var cleanLower = clean.ToLower();

        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u =>
                (u.Email.ToLower() == cleanLower || u.PhoneNumber == clean) &&
                u.IsActive);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLower();

        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail);
    }

    public async Task<bool> PhoneNumberExistsAsync(string phoneNumber)
    {
        var cleanPhone = phoneNumber.Trim();

        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.PhoneNumber == cleanPhone);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
    }

    public async Task UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}