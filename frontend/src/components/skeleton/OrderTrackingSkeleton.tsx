export function OrderTrackingSkeleton() {
  return (
    <div className="nx-tracking-skel-page" aria-hidden="true">
      {/* Breadcrumb */}
      <div className="nx-skel-line nx-shimmer" style={{ width: 160, height: 16, marginBottom: 24 }} />

      {/* Header card */}
      <div className="nx-tracking-skel-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div className="nx-skel-line nx-shimmer" style={{ width: 140, height: 16, marginBottom: 8 }} />
            <div className="nx-skel-line nx-shimmer" style={{ width: 220, height: 28 }} />
          </div>
          <div className="nx-skel-line nx-shimmer" style={{ width: 100, height: 28, borderRadius: 14 }} />
        </div>

        {/* Stepper */}
        <div className="nx-tracking-skel-stepper">
          {[1, 2, 3, 4].map((step, idx) => (
            <div key={step} style={{ display: "contents" }}>
              <div className="nx-tracking-skel-step">
                <div className="nx-tracking-skel-circle nx-shimmer" />
                <div className="nx-skel-line nx-shimmer" style={{ width: 64, height: 12 }} />
              </div>
              {idx < 3 && <div className="nx-tracking-skel-bar nx-shimmer" />}
            </div>
          ))}
        </div>
      </div>

      {/* Summary card */}
      <div className="nx-tracking-skel-card">
        <div className="nx-skel-line nx-shimmer" style={{ width: 140, height: 20, marginBottom: 16 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="nx-skel-line nx-shimmer" style={{ width: "80%", height: 14 }} />
          <div className="nx-skel-line nx-shimmer" style={{ width: "65%", height: 14 }} />
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingSkeleton;
