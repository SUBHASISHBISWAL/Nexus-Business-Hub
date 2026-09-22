namespace NexusBusinessHub.Domain.Entities;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Group { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal? OldPrice { get; set; }

    public decimal Rating { get; set; }

    public int Reviews { get; set; }

    public string Icon { get; set; } = string.Empty;

    public string Image { get; set; } = string.Empty;

    public string Specs { get; set; } = string.Empty;

    public string Stock { get; set; } = string.Empty;

    public string Badge { get; set; } = string.Empty;

    public bool RequestOnly { get; set; }
}