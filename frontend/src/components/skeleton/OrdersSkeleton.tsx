type OrdersSkeletonProps = {
  count?: number;
};

export function OrderCardSkeleton() {
  return (
    <article
      className="nx-order-card nx-order-skeleton-card"
      aria-hidden="true"
    >
      <div className="nx-order-top nx-order-skel-top">
        <div className="nx-order-skel-top-item nx-shimmer" />
        <div className="nx-order-skel-top-item nx-shimmer" />
        <div className="nx-order-skel-top-pill nx-shimmer" />
      </div>

      <div className="nx-order-body nx-order-skel-body">
        <div className="nx-order-info nx-order-skel-info">
          <div className="nx-order-skel-info-col">
            <div className="nx-order-skel-info-label nx-shimmer" />
            <div className="nx-order-skel-info-val nx-shimmer" />
          </div>

          <div className="nx-order-skel-info-col">
            <div className="nx-order-skel-info-label nx-shimmer" />
            <div className="nx-order-skel-info-val nx-shimmer" />
          </div>

          <div className="nx-order-skel-info-col">
            <div className="nx-order-skel-info-label nx-shimmer" />
            <div className="nx-order-skel-info-val nx-shimmer" />
          </div>
        </div>

        <div className="nx-order-actions nx-order-skel-actions">
          <div className="nx-order-skel-btn nx-shimmer" />
          <div className="nx-order-skel-btn nx-shimmer" />
        </div>
      </div>
    </article>
  );
}

export function OrdersSkeleton({ count = 3 }: OrdersSkeletonProps) {
  return (
    <div className="nx-orders-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default OrdersSkeleton;
