namespace NexusBusinessHub.Domain.Entities;

public class ProductSpecification : BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string SpecificationName { get; set; } = string.Empty;
    public string SpecificationValue { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
