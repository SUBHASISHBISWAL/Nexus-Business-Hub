import "./Footer.css";

function Footer() {
  return (
    <footer className="nexus-footer">
      <div className="nexus-footer-container">

        {/* Company Info */}
        <div className="footer-company">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="bi bi-image"></i>
            </div>

            <span>Nexus</span>
          </div>

          <p>
            Precision enterprise computing hardware, synchronized systems,
            and mission-critical hardware architectures.
          </p>

          <div className="system-status">
            <span className="status-dot"></span>
            <span>All Systems Operational</span>
          </div>
        </div>

        {/* Product Lines */}
        <div className="footer-column">
          <h4>PRODUCT LINES</h4>

          <a href="/products">Hardware</a>
          <a href="/products">Software</a>
          <a href="/products">Electronics</a>
          <a href="/products">Accessories</a>
        </div>

        {/* Enterprise Support */}
        <div className="footer-column">
          <h4>ENTERPRISE SUPPORT</h4>

          <a href="/support-info">Documentation</a>
          <a href="/support-info">Deployment Engineering</a>
          <a href="/support-info">API References</a>
          <a href="/support-info">Service Level Agreements</a>
        </div>

        {/* Compliance & Delivery */}
        <div className="footer-column">
          <h4>COMPLIANCE & DELIVERY</h4>

          <a href="/warranty">Warranty Coverage</a>
          <a href="/support-info">Compliance & Certifications</a>
          <a href="/tracking">Delivery & Tracking</a>
          <a href="/support-info">Returns & Repairs</a>
        </div>

        {/* Corporate Contact */}
        <div className="footer-column">
          <h4>CORPORATE CONTACT</h4>

          <a href="/about">Global Headquarters</a>
          <a href="/about">Commercial Procurement</a>
          <a href="/about">Press & Media</a>
          <a href="/about">Investor Relations</a>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="nexus-footer-bottom">
        <p>
          © 2024 Nexus Technologies Inc. All rights reserved.
          Industrial Grade Computing Systems.
        </p>

        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/warranty">Hardware Warranty</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;