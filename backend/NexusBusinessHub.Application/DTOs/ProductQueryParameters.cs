namespace NexusBusinessHub.Application.DTOs;

public class ProductQueryParameters
{
    public int? Page { get; set; }

    public int? PageSize { get; set; }

    public string? Category { get; set; }

    public string? Search { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public decimal? MinRating { get; set; }

    public string? SortBy { get; set; }

    public bool? All { get; set; }

    public bool? IncludeInactive { get; set; }

    public bool? IsActive { get; set; }

    public string? Status { get; set; }
}
