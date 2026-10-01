namespace NexusBusinessHub.Application.DTOs;

public class RegisterResultDto
{
    public bool Success { get; set; }
    public bool IsConflict { get; set; }
    public string? ErrorMessage { get; set; }
    public LoginResponseDto? Data { get; set; }
}
