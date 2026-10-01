type OrderHistorySkeletonProps = {
  count?: number;
};

export function OrderHistoryCardSkeleton() {
  return (
    <article
      className="nx-order-history-card nx-history-skel-card"
      aria-hidden="true"
    >
      <div className="nx-order-card-header nx-history-skel-header">
        <div className="nx-skel-line nx-shimmer" style={{ width: 110, height: 16 }} />
        <div className="nx-skel-line nx-shimmer" style={{ width: 100, height: 16 }} />
        <div className="nx-skel-line nx-shimmer" style={{ width: 90, height: 16 }} />
        <div className="nx-skel-line nx-shimmer" style={{ width: 95, height: 16 }} />
      </div>

      <div className="nx-order-card-content nx-history-skel-content">
        <div className="nx-history-skel-product">
          <div className="nx-history-skel-img nx-shimmer" />
          <div className="nx-history-skel-meta">
            <div className="nx-history-skel-title nx-shimmer" />
            <div className="nx-history-skel-sub nx-shimmer" />
            <div className="nx-skel-line nx-shimmer" style={{ width: 80, height: 14 }} />
          </div>
        </div>

        <div className="nx-history-skel-actions">
          <div className="nx-skel-btn nx-shimmer" style={{ width: 110, height: 36 }} />
          <div className="nx-skel-btn nx-shimmer" style={{ width: 100, height: 36 }} />
        </div>
      </div>
    </article>
  );
}

export function OrderHistorySkeleton({ count = 3 }: OrderHistorySkeletonProps) {
  return (
    <div className="nx-order-history-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <OrderHistoryCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default OrderHistorySkeleton;
