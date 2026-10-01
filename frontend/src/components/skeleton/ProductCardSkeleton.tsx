type ProductCardSkeletonProps = {
  count?: number;
};

export function ProductCardSkeleton() {
  return (
    <article
      className="nx-node-card nx-skeleton-card"
      aria-hidden="true"
    >
      {/* Product Image Skeleton */}
      <div className="nx-node-visual">
        <div className="nx-skeleton-img-placeholder nx-shimmer" />
      </div>

      {/* Product Body Skeleton */}
      <div className="nx-node-body">
        <div className="nx-skeleton-meta-row">
          <div className="nx-skeleton-rating-pill nx-shimmer" />
          <div className="nx-skeleton-badge-pill nx-shimmer" />
        </div>

        <div className="nx-skeleton-title-line-1 nx-shimmer" />
        <div className="nx-skeleton-title-line-2 nx-shimmer" />
      </div>

      {/* Price & Actions Skeleton */}
      <div className="nx-node-bottom">
        <div className="nx-skeleton-price-row">
          <div className="nx-skeleton-price-main nx-shimmer" />
          <div className="nx-skeleton-price-old nx-shimmer" />
        </div>

        <div className="nx-node-actions">
          <div className="nx-skeleton-action-btn nx-shimmer" />
          <div className="nx-skeleton-action-btn nx-shimmer" />
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeletonGrid({ count = 12 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
}

export default ProductCardSkeleton;
