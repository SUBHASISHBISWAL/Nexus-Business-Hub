import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard";
import { products, productCategories } from "../../data/products";
import type { Product } from "../../types/product";
import heroImg from "../../assets/hero.png";
import "./Home.css";

function Home() {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  // Top 4 curated enterprise nodes for featured section
  const featuredProducts = products.slice(0, 4);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="nexus-home-page">

      {/* =========================================================
          1. ENTERPRISE HERO SECTION
          ========================================================= */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">

            {/* Left Column: Heading & Actions */}
            <div className="col-lg-6">
              <div className="hero-kicker">
                <span className="hero-kicker-dot"></span>
                <span>NEXUS ARCHITECTURE 2026</span>
              </div>

              <h1 className="hero-heading">
                Technology Built for
                <br />
                the Future
              </h1>

              <p className="hero-description">
                Explore our software, hardware and electronic solutions designed
                for modern businesses. Engineered for mission-critical
                infrastructure.
              </p>

              <div className="hero-actions">
                <Link to="/products" className="btn-nx-primary">
                  Explore Products
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <a href="#contact" className="btn-nx-secondary">
                  Contact Sales
                </a>
              </div>
            </div>

            {/* Right Column: Hardware / System Visual Card */}
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="hero-visual-card">

                {/* Floating Telemetry Pill */}
                <div className="visual-floating-pill">
                  <i className="bi bi-shield-check text-primary"></i>
                  <span>Firmware Sync · 100% Locked</span>
                </div>

                <div className="visual-top">
                  <span className="visual-title">
                    ENTERPRISE EXPANSION
                  </span>

                  <span className="visual-badge">
                    <span className="visual-badge-dot"></span>
                    SYSTEM ACTIVE
                  </span>
                </div>

                <div className="visual-display-box">
                  <img
                    src={heroImg}
                    alt="Nexus Enterprise Platform Hardware Architecture"
                    className="visual-image"
                  />

                  <h3 className="visual-platform-title">
                    Nexus Enterprise Platform
                  </h3>

                  <p className="visual-platform-desc">
                    Mission-critical business infrastructure
                  </p>
                </div>

                <div className="visual-bottom">
                  <span className="visual-firmware">
                    NexusOS v4.19-LTS
                  </span>

                  <span className="visual-status-ready">
                    READY TO DEPLOY
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          2. STATISTICS SECTION
          ========================================================= */}
      <section className="stats-section">
        <div className="container">
          <div className="row g-3">

            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-label">GLOBAL NODES</div>
                <div className="stat-value">14,280+</div>
                <div className="stat-sub">Active Fabric</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-label">MEAN LATENCY</div>
                <div className="stat-value">0.42 ms</div>
                <div className="stat-sub">P99 Guaranteed</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-label">MTBF STANDARD</div>
                <div className="stat-value">&gt;120k Hrs</div>
                <div className="stat-sub">Mission Grade</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          3. ENTERPRISE TRUST SECTION
          ========================================================= */}
      <section id="trust" className="trust-section">
        <div className="container">

          <div className="section-header text-center mx-auto">
            <div className="section-kicker">
              ENTERPRISE ASSURANCE
            </div>

            <h2 className="section-title">
              Built for Mission-Critical Reliability
            </h2>

            <p className="section-desc mx-auto">
              Our hardware and software systems adhere to strict industrial standards,
              guaranteeing uptime, security, and continuous deployment capabilities.
            </p>
          </div>

          <div className="row g-4">

            <div className="col-lg-3 col-sm-6">
              <div className="trust-card">
                <div className="trust-icon-box">
                  <i className="bi bi-shield-check"></i>
                </div>

                <h3 className="trust-title">
                  ISO 27001 Certified
                </h3>

                <p className="trust-detail">
                  Cryptographic grade build with hardware root-of-trust and secure boot verification.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="trust-card">
                <div className="trust-icon-box">
                  <i className="bi bi-activity"></i>
                </div>

                <h3 className="trust-title">
                  99.99% Reliability
                </h3>

                <p className="trust-detail">
                  Hardware uptime SLA backed by redundant power architecture and failover routing.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="trust-card">
                <div className="trust-icon-box">
                  <i className="bi bi-award"></i>
                </div>

                <h3 className="trust-title">
                  3-Yr Enterprise Warranty
                </h3>

                <p className="trust-detail">
                  Hot-swap direct replacement with expedited global dispatch and telemetry diagnosis.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="trust-card">
                <div className="trust-icon-box">
                  <i className="bi bi-headset"></i>
                </div>

                <h3 className="trust-title">
                  Dedicated Solutions Eng.
                </h3>

                <p className="trust-detail">
                  Direct phone &amp; lab access for bespoke architectural integrations and firmware builds.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          4. PRODUCT CATEGORIES SECTION
          ========================================================= */}
      <section id="categories" className="categories-section">
        <div className="container">

          <div className="section-header">
            <div className="section-kicker">
              ARCHITECTURAL LINES
            </div>

            <h2 className="section-title">
              Engineered Product Categories
            </h2>

            <p className="section-desc">
              High-availability hardware, synchronised operating systems, and industrial electronics.
            </p>
          </div>

          <div className="row g-4">
            {productCategories.map((category) => (
              <div key={category.id} className="col-lg-3 col-sm-6">
                <Link to={category.path} className="category-card">

                  <div className="category-icon-bar">
                    <div className="category-icon-box">
                      <i className={`bi ${category.icon}`}></i>
                    </div>

                    <span className="category-count-badge">
                      {category.count} Products
                    </span>
                  </div>

                  <h3 className="category-name">
                    {category.name}
                  </h3>

                  <p className="category-desc">
                    {category.description}
                  </p>

                  <span className="category-link">
                    Explore Category
                    <i className="bi bi-arrow-right"></i>
                  </span>

                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. FEATURED PRODUCTS SECTION
          ========================================================= */}
      <section className="featured-section">
        <div className="container">

          <div className="featured-header-row">
            <div>
              <div className="section-kicker">
                PRODUCTION READY
              </div>

              <h2 className="section-title mb-0">
                Featured Enterprise Nodes
              </h2>
            </div>

            <Link to="/products" className="view-all-link">
              View All Enterprise Products
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {/* Reusing ProductCard in grid */}
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isLiked={wishlist.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          6. ENTERPRISE CTA SECTION
          ========================================================= */}
      <section id="contact" className="cta-section">
        <div className="container">

          <div className="cta-panel">

            <span className="cta-kicker">
              COMMERCIAL PROCUREMENT &amp; LAB ACCESS
            </span>

            <h2 className="cta-heading">
              Accelerate Your Enterprise Infrastructure
            </h2>

            <p className="cta-description">
              Speak directly with a Nexus Solutions Architect to customize hardware
              topologies, request custom firmware builds, or schedule an on-premise
              evaluation cluster.
            </p>

            <div className="cta-actions">

              <Link to="/products" className="btn-cta-white">
                Explore Products
                <i className="bi bi-arrow-right"></i>
              </Link>

              <a
                href="mailto:procurement@nexus-technologies.internal"
                className="btn-cta-outline"
              >
                <i className="bi bi-envelope"></i>
                Contact Sales
              </a>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;