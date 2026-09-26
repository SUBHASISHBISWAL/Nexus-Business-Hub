namespace NexusBusinessHub.Domain.Entities;

public class ProductFeature : BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string FeatureText { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
