export function ProductDetailsSkeleton() {
  return (
    <div
      className="nx-product-details-page nx-details-skeleton-wrap"
      aria-hidden="true"
    >
      {/* Breadcrumb Skeleton */}
      <div className="container nx-details-skeleton-breadcrumb">
        <div className="nx-skel-bread-item nx-shimmer" />
        <div className="nx-skel-bread-sep" />
        <div className="nx-skel-bread-item nx-shimmer" />
        <div className="nx-skel-bread-sep" />
        <div className="nx-skel-bread-current nx-shimmer" />
      </div>

      {/* Main Product Card */}
      <main className="container nx-product-details-container">
        <section className="nx-details-skeleton-card">
          {/* Gallery Skeleton */}
          <div className="nx-details-image-section">
            <div className="nx-details-skel-image-box nx-shimmer" />
            <div className="nx-details-skel-thumbs">
              <div className="nx-details-skel-thumb nx-shimmer" />
              <div className="nx-details-skel-thumb nx-shimmer" />
              <div className="nx-details-skel-thumb nx-shimmer" />
              <div className="nx-details-skel-thumb nx-shimmer" />
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="nx-details-skel-info">
            <div className="nx-details-skel-category nx-shimmer" />
            <div className="nx-details-skel-title-1 nx-shimmer" />
            <div className="nx-details-skel-title-2 nx-shimmer" />
            <div className="nx-details-skel-rating nx-shimmer" />
            <div className="nx-details-skel-divider" />
            <div className="nx-details-skel-price-row">
              <div className="nx-details-skel-price nx-shimmer" />
              <div className="nx-details-skel-old-price nx-shimmer" />
            </div>
            <div className="nx-details-skel-stock nx-shimmer" />
            <div className="nx-details-skel-desc-1 nx-shimmer" />
            <div className="nx-details-skel-desc-2 nx-shimmer" />
            <div className="nx-details-skel-desc-3 nx-shimmer" />

            <div className="nx-details-skel-quick-spec">
              <div className="nx-details-skel-spec-item nx-shimmer" />
              <div className="nx-details-skel-spec-item nx-shimmer" />
            </div>

            <div className="nx-details-skel-actions">
              <div className="nx-details-skel-qty nx-shimmer" />
              <div className="nx-details-skel-btn-cart nx-shimmer" />
              <div className="nx-details-skel-btn-buy nx-shimmer" />
            </div>

            <div className="nx-details-skel-ref nx-shimmer" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProductDetailsSkeleton;
