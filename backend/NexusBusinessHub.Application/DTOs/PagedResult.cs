namespace NexusBusinessHub.Application.DTOs;

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalItems { get; set; }

    public int TotalPages { get; set; }

    public Dictionary<string, int>? CategoryCounts { get; set; }
 
    public int? TotalCount { get; set; }

    public int? ActiveCount { get; set; }

    public int? OutOfStockCount { get; set; }

    public int? DraftCount { get; set; }
}
