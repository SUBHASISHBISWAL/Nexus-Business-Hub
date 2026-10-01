export function OrderDetailSkeleton() {
  return (
    <div className="nx-order-details-skel-page" aria-hidden="true">
      {/* Breadcrumb */}
      <div className="nx-skel-line nx-shimmer" style={{ width: 180, height: 16, marginBottom: 20 }} />

      {/* Header */}
      <div className="nx-order-details-skel-head">
        <div>
          <div className="nx-skel-line nx-shimmer" style={{ width: 100, height: 14, marginBottom: 8 }} />
          <div className="nx-skel-line nx-shimmer" style={{ width: 220, height: 32, marginBottom: 8 }} />
          <div className="nx-skel-line nx-shimmer" style={{ width: 160, height: 14 }} />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="nx-skel-line nx-shimmer" style={{ width: 90, height: 28, borderRadius: 14 }} />
          <div className="nx-skel-btn nx-shimmer" style={{ width: 120, height: 38 }} />
        </div>
      </div>

      {/* Overview 3-card grid */}
      <div className="nx-order-details-skel-overview-grid">
        <div className="nx-order-details-skel-overview-card">
          <div className="nx-order-details-skel-icon nx-shimmer" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="nx-skel-line nx-shimmer" style={{ width: 60, height: 12 }} />
            <div className="nx-skel-line nx-shimmer" style={{ width: 90, height: 20 }} />
          </div>
        </div>

        <div className="nx-order-details-skel-overview-card">
          <div className="nx-order-details-skel-icon nx-shimmer" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="nx-skel-line nx-shimmer" style={{ width: 60, height: 12 }} />
            <div className="nx-skel-line nx-shimmer" style={{ width: 90, height: 20 }} />
          </div>
        </div>

        <div className="nx-order-details-skel-overview-card">
          <div className="nx-order-details-skel-icon nx-shimmer" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="nx-skel-line nx-shimmer" style={{ width: 60, height: 12 }} />
            <div className="nx-skel-line nx-shimmer" style={{ width: 90, height: 20 }} />
          </div>
        </div>
      </div>

      {/* Items card */}
      <div className="nx-order-details-skel-items-card">
        <div className="nx-skel-line nx-shimmer" style={{ width: 120, height: 20, marginBottom: 16 }} />
        {[1, 2].map((item) => (
          <div key={item} className="nx-order-details-skel-item-row">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="nx-skel-box nx-shimmer" style={{ width: 60, height: 60 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="nx-skel-line nx-shimmer" style={{ width: 180, height: 16 }} />
                <div className="nx-skel-line nx-shimmer" style={{ width: 100, height: 14 }} />
              </div>
            </div>
            <div className="nx-skel-line nx-shimmer" style={{ width: 80, height: 18 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetailSkeleton;
