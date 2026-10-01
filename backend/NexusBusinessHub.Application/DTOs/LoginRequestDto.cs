namespace NexusBusinessHub.Application.DTOs;

public class LoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string? Identifier { get; set; }
    public string Password { get; set; } = string.Empty;
}