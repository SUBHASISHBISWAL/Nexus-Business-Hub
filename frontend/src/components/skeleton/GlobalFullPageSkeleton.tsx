type GlobalFullPageSkeletonProps = {
  isFadingOut?: boolean;
};

export function GlobalFullPageSkeleton({
  isFadingOut = false,
}: GlobalFullPageSkeletonProps) {
  return (
    <div
      className={`nx-global-skeleton-overlay ${isFadingOut ? "nx-fade-out" : ""}`}
      aria-hidden="true"
    >
      {/* =========================================================
          1. HEADER / NAVBAR SKELETON
          ========================================================= */}
      <header className="nx-skel-nav">
        <div className="nx-skel-nav-container">
          {/* Brand */}
          <div className="nx-skel-brand">
            <div className="nx-skel-brand-logo nx-shimmer" />
            <div className="nx-skel-brand-title nx-shimmer" />
          </div>

          {/* Nav Links */}
          <div className="nx-skel-nav-links">
            <div className="nx-skel-nav-link nx-shimmer" />
            <div className="nx-skel-nav-link nx-shimmer" />
            <div className="nx-skel-nav-link nx-shimmer" />
            <div className="nx-skel-nav-link nx-shimmer" />
          </div>

          {/* Search Box */}
          <div className="nx-skel-search-box nx-shimmer" />

          {/* Nav Actions */}
          <div className="nx-skel-nav-actions">
            <div className="nx-skel-icon-circle nx-shimmer" />
            <div className="nx-skel-icon-circle nx-shimmer" />
            <div className="nx-skel-icon-circle nx-shimmer" />
            <div className="nx-skel-btn-primary nx-shimmer" />
          </div>
        </div>
      </header>

      {/* =========================================================
          2. MAIN CONTENT SKELETON
          ========================================================= */}
      <main className="nx-skel-main-container">
        {/* 2.1 Hero Banner Section */}
        <section className="nx-skel-hero">
          <div className="nx-skel-hero-left">
            <div className="nx-skel-kicker nx-shimmer" />
            <div className="nx-skel-hero-title-1 nx-shimmer" />
            <div className="nx-skel-hero-title-2 nx-shimmer" />
            <div className="nx-skel-hero-desc-1 nx-shimmer" />
            <div className="nx-skel-hero-desc-2 nx-shimmer" />
            <div className="nx-skel-hero-actions">
              <div className="nx-skel-hero-btn-1 nx-shimmer" />
              <div className="nx-skel-hero-btn-2 nx-shimmer" />
            </div>
          </div>

          <div className="nx-skel-hero-right nx-shimmer" />
        </section>

        {/* 2.2 Stats Section */}
        <section className="nx-skel-stats">
          <div className="nx-skel-stat-card">
            <div className="nx-skel-stat-label nx-shimmer" />
            <div className="nx-skel-stat-val nx-shimmer" />
            <div className="nx-skel-stat-sub nx-shimmer" />
          </div>
          <div className="nx-skel-stat-card">
            <div className="nx-skel-stat-label nx-shimmer" />
            <div className="nx-skel-stat-val nx-shimmer" />
            <div className="nx-skel-stat-sub nx-shimmer" />
          </div>
          <div className="nx-skel-stat-card">
            <div className="nx-skel-stat-label nx-shimmer" />
            <div className="nx-skel-stat-val nx-shimmer" />
            <div className="nx-skel-stat-sub nx-shimmer" />
          </div>
        </section>

        {/* 2.3 Product Categories Section */}
        <section className="nx-skel-section">
          <div className="nx-skel-section-head">
            <div className="nx-skel-sec-kicker nx-shimmer" />
            <div className="nx-skel-sec-title nx-shimmer" />
          </div>
          <div className="nx-skel-cat-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="nx-skel-cat-card">
                <div className="nx-skel-cat-icon nx-shimmer" />
                <div className="nx-skel-cat-title nx-shimmer" />
                <div className="nx-skel-cat-desc nx-shimmer" />
                <div className="nx-skel-cat-link nx-shimmer" />
              </div>
            ))}
          </div>
        </section>

        {/* 2.4 Featured Enterprise Products Grid Section */}
        <section className="nx-skel-section">
          <div className="nx-skel-section-head-split">
            <div>
              <div className="nx-skel-sec-kicker nx-shimmer" />
              <div className="nx-skel-sec-title nx-shimmer" />
            </div>
            <div className="nx-skel-view-all nx-shimmer" />
          </div>
          <div className="nx-skel-product-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="nx-skel-card">
                <div className="nx-skel-card-img nx-shimmer" />
                <div className="nx-skel-card-body">
                  <div className="nx-skel-card-rating nx-shimmer" />
                  <div className="nx-skel-card-title nx-shimmer" />
                  <div className="nx-skel-card-title-sub nx-shimmer" />
                </div>
                <div className="nx-skel-card-footer">
                  <div className="nx-skel-card-price nx-shimmer" />
                  <div className="nx-skel-card-actions">
                    <div className="nx-skel-card-btn nx-shimmer" />
                    <div className="nx-skel-card-btn nx-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* =========================================================
          3. FOOTER AREA SKELETON
          ========================================================= */}
      <footer className="nx-skel-footer">
        <div className="nx-skel-footer-container">
          <div className="nx-skel-footer-grid">
            {/* Column 1: Brand */}
            <div className="nx-skel-footer-col">
              <div className="nx-skel-footer-brand nx-shimmer" />
              <div
                className="nx-skel-footer-line nx-shimmer"
                style={{ width: "85%" }}
              />
              <div
                className="nx-skel-footer-line nx-shimmer"
                style={{ width: "65%" }}
              />
              <div className="nx-skel-footer-socials">
                <div className="nx-skel-icon-circle nx-shimmer" />
                <div className="nx-skel-icon-circle nx-shimmer" />
                <div className="nx-skel-icon-circle nx-shimmer" />
              </div>
            </div>

            {/* Column 2: Solutions */}
            <div className="nx-skel-footer-col">
              <div className="nx-skel-footer-head nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
            </div>

            {/* Column 3: Platform */}
            <div className="nx-skel-footer-col">
              <div className="nx-skel-footer-head nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
            </div>

            {/* Column 4: Support */}
            <div className="nx-skel-footer-col">
              <div className="nx-skel-footer-head nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
              <div className="nx-skel-footer-line nx-shimmer" />
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="nx-skel-footer-bottom">
            <div className="nx-skel-footer-copy nx-shimmer" />
            <div className="nx-skel-footer-terms nx-shimmer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default GlobalFullPageSkeleton;
