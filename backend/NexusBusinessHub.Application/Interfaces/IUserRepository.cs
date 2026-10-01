using NexusBusinessHub.Domain.Entities;

namespace NexusBusinessHub.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByPhoneNumberAsync(string phoneNumber);

    Task<User?> GetByEmailOrPhoneAsync(string identifier);

    Task<bool> EmailExistsAsync(string email);

    Task<bool> PhoneNumberExistsAsync(string phoneNumber);

    Task<User> CreateAsync(User user);
    Task<User?> GetByIdAsync(int id);
    Task UpdateAsync(User user);
}