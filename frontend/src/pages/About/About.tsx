import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="nx-about-page">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="nx-about-hero">
        <div className="container">
          <div className="nx-about-hero-grid">

            <div className="nx-about-hero-content">
              <div className="nx-about-kicker">
                <span></span>
                ABOUT NEXUS BUSINESS HUB
              </div>

              <h1>
                Enterprise commerce
                <br />
                <strong>built for business.</strong>
              </h1>

              <p>
                Nexus Business Hub is a modern enterprise commerce
                platform designed to connect businesses with technology
                products through a structured, secure, and connected
                digital purchasing experience.
              </p>

              <div className="nx-about-actions">
                <Link
                  to="/products"
                  className="nx-about-btn-primary"
                >
                  Explore Products
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link
                  to="/"
                  className="nx-about-btn-secondary"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            <div className="nx-about-hero-panel">

              <div className="nx-about-panel-top">
                <span>PLATFORM STATUS</span>

                <div className="nx-about-status">
                  <span></span>
                  Operational
                </div>
              </div>

              <div className="nx-about-panel-main">
                <span>COMMERCE PLATFORM</span>

                <strong>
                  Nexus
                  <br />
                  Business Hub
                </strong>

                <p>
                  One connected platform for products,
                  orders, shipments and support.
                </p>
              </div>

              <div className="nx-about-panel-footer">
                <div>
                  <span>PRODUCTS</span>
                  <strong>16+</strong>
                </div>

                <div>
                  <span>CATEGORIES</span>
                  <strong>04</strong>
                </div>

                <div>
                  <span>WORKFLOW</span>
                  <strong>06</strong>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PLATFORM OVERVIEW
      ===================================================== */}
      <section className="container nx-about-section">

        <div className="nx-about-section-header">
          <div>
            <span className="nx-about-label">
              PLATFORM OVERVIEW
            </span>

            <h2>
              A connected commerce
              <br />
              experience for modern business.
            </h2>
          </div>

          <p>
            Nexus Business Hub brings product discovery,
            purchasing, order management, shipment visibility
            and customer support together within one structured
            commerce workflow.
          </p>
        </div>

        <div className="nx-about-overview-grid">

          <div className="nx-about-overview-card large">
            <span className="nx-about-card-number">01</span>

            <i className="bi bi-diagram-3"></i>

            <h3>Connected Commerce</h3>

            <p>
              A unified journey that connects customers,
              products, orders, payments, shipments and
              support processes.
            </p>
          </div>

          <div className="nx-about-overview-card">
            <span className="nx-about-card-number">02</span>

            <i className="bi bi-grid-1x2"></i>

            <h3>Structured Catalog</h3>

            <p>
              Organized enterprise products with categories,
              specifications, pricing and availability.
            </p>
          </div>

          <div className="nx-about-overview-card">
            <span className="nx-about-card-number">03</span>

            <i className="bi bi-shield-check"></i>

            <h3>Business Ready</h3>

            <p>
              Designed around reliable workflows and
              professional business requirements.
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          CAPABILITIES
      ===================================================== */}
      <section className="nx-about-capabilities">

        <div className="container nx-about-section">

          <div className="nx-about-section-heading">
            <span className="nx-about-label">
              PLATFORM CAPABILITIES
            </span>

            <h2>
              Everything connected
              <br />
              across the commerce journey.
            </h2>
          </div>

          <div className="nx-about-capability-grid">

            <div className="nx-about-capability">
              <span>01</span>

              <i className="bi bi-search"></i>

              <h3>Product Discovery</h3>

              <p>
                Search, filter and explore enterprise
                products with detailed specifications.
              </p>
            </div>

            <div className="nx-about-capability">
              <span>02</span>

              <i className="bi bi-box-seam"></i>

              <h3>Enterprise Catalog</h3>

              <p>
                Structured categories, product information,
                pricing and availability.
              </p>
            </div>

            <div className="nx-about-capability">
              <span>03</span>

              <i className="bi bi-cart-check"></i>

              <h3>Secure Checkout</h3>

              <p>
                A streamlined purchasing flow from cart
                through checkout and payment.
              </p>
            </div>

            <div className="nx-about-capability">
              <span>04</span>

              <i className="bi bi-receipt"></i>

              <h3>Order Management</h3>

              <p>
                Maintain visibility across placed orders,
                order status and purchase information.
              </p>
            </div>

            <div className="nx-about-capability">
              <span>05</span>

              <i className="bi bi-truck"></i>

              <h3>Shipment Tracking</h3>

              <p>
                Follow shipment progress through a
                connected tracking experience.
              </p>
            </div>

            <div className="nx-about-capability">
              <span>06</span>

              <i className="bi bi-headset"></i>

              <h3>Customer Support</h3>

              <p>
                Support and service workflows designed
                for post-purchase assistance.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          COMMERCE JOURNEY
      ===================================================== */}
      <section className="container nx-about-section">

        <div className="nx-about-section-heading centered">

          <span className="nx-about-label">
            END-TO-END COMMERCE JOURNEY
          </span>

          <h2>
            From discovery to support.
          </h2>

          <p>
            Every stage is connected through one
            streamlined business workflow.
          </p>

        </div>

        <div className="nx-about-journey">

          <div className="nx-about-journey-step">
            <span>01</span>
            <i className="bi bi-search"></i>
            <strong>Discover</strong>
            <small>Find products</small>
          </div>

          <div className="nx-about-journey-line"></div>

          <div className="nx-about-journey-step">
            <span>02</span>
            <i className="bi bi-eye"></i>
            <strong>Evaluate</strong>
            <small>Compare details</small>
          </div>

          <div className="nx-about-journey-line"></div>

          <div className="nx-about-journey-step">
            <span>03</span>
            <i className="bi bi-cart3"></i>
            <strong>Purchase</strong>
            <small>Complete checkout</small>
          </div>

          <div className="nx-about-journey-line"></div>

          <div className="nx-about-journey-step">
            <span>04</span>
            <i className="bi bi-receipt"></i>
            <strong>Order</strong>
            <small>Manage order</small>
          </div>

          <div className="nx-about-journey-line"></div>

          <div className="nx-about-journey-step">
            <span>05</span>
            <i className="bi bi-truck"></i>
            <strong>Shipment</strong>
            <small>Track delivery</small>
          </div>

          <div className="nx-about-journey-line"></div>

          <div className="nx-about-journey-step">
            <span>06</span>
            <i className="bi bi-headset"></i>
            <strong>Support</strong>
            <small>Get assistance</small>
          </div>

        </div>
      </section>

      {/* =====================================================
          BUSINESS FOCUS
      ===================================================== */}
      <section className="nx-about-business">

        <div className="container nx-about-section">

          <div className="nx-about-business-grid">

            <div>
              <span className="nx-about-label">
                BUILT FOR BUSINESS
              </span>

              <h2>
                Designed around
                <br />
                real business workflows.
              </h2>

              <p>
                Nexus Business Hub focuses on simplifying the
                way organizations discover, purchase and manage
                technology products while maintaining visibility
                throughout the commerce lifecycle.
              </p>
            </div>

            <div className="nx-about-business-list">

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Professional product information
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Connected order and shipment visibility
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Structured enterprise workflows
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Customer-focused support experience
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Scalable digital commerce foundation
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          PRODUCT ECOSYSTEM
      ===================================================== */}
      <section className="container nx-about-section">

        <div className="nx-about-section-heading">

          <span className="nx-about-label">
            PRODUCT ECOSYSTEM
          </span>

          <h2>
            Technology categories
            <br />
            in one platform.
          </h2>

        </div>

        <div className="nx-about-ecosystem">

          <div>
            <span>01</span>
            <i className="bi bi-cpu"></i>
            <strong>Hardware</strong>
            <small>Controllers, servers & networking</small>
          </div>

          <div>
            <span>02</span>
            <i className="bi bi-router"></i>
            <strong>Electronics</strong>
            <small>IoT, sensors & connected devices</small>
          </div>

          <div>
            <span>03</span>
            <i className="bi bi-window"></i>
            <strong>Software</strong>
            <small>Management & enterprise tools</small>
          </div>

          <div>
            <span>04</span>
            <i className="bi bi-tools"></i>
            <strong>Accessories</strong>
            <small>Components, tools & mounting</small>
          </div>

        </div>
      </section>

      {/* =====================================================
          VISION
      ===================================================== */}
      <section className="nx-about-vision">

        <div className="container">

          <div className="nx-about-vision-content">

            <span className="nx-about-label">
              OUR VISION
            </span>

            <h2>
              Making enterprise technology
              <br />
              commerce simpler and more connected.
            </h2>

            <p>
              We envision a digital commerce experience where
              businesses can discover the right technology,
              make informed purchasing decisions, track every
              order and access support through one connected
              platform.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          PLATFORM METRICS
      ===================================================== */}
      <section className="container nx-about-section">

        <div className="nx-about-metrics">

          <div>
            <strong>16+</strong>
            <span>Enterprise Products</span>
          </div>

          <div>
            <strong>04</strong>
            <span>Product Categories</span>
          </div>

          <div>
            <strong>06</strong>
            <span>Commerce Stages</span>
          </div>

          <div>
            <strong>01</strong>
            <span>Connected Platform</span>
          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="container">

        <div className="nx-about-final-cta">

          <div>
            <span className="nx-about-label">
              EXPLORE THE PLATFORM
            </span>

            <h2>
              Ready to explore
              <br />
              Nexus Business Hub?
            </h2>

            <p>
              Discover technology products through a
              connected enterprise commerce experience.
            </p>
          </div>

          <Link
            to="/products"
            className="nx-about-btn-primary"
          >
            Explore Products
            <i className="bi bi-arrow-right"></i>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default About;