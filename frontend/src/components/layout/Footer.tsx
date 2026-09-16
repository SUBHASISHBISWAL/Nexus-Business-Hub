import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="nexus-footer">
      <div className="nexus-footer-container">

        {/* Company Info */}
        <div className="footer-company">
          <Link to="/" className="footer-brand text-decoration-none">
            <div className="footer-logo">
              <i className="bi bi-hdd-network"></i>
            </div>

            <span>Nexus Technologies</span>
          </Link>

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

          <Link to="/products?category=Hardware">Hardware</Link>
          <Link to="/products?category=Software">Software</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Accessories">Accessories</Link>
        </div>

        {/* Enterprise Support */}
        <div className="footer-column">
          <h4>ENTERPRISE SUPPORT</h4>

          <Link to="/products">Documentation</Link>
          <Link to="/products">Deployment Engineering</Link>
          <Link to="/products">API References</Link>
          <Link to="/products">Service Level Agreements</Link>
        </div>

        {/* Compliance & Delivery */}
        <div className="footer-column">
          <h4>COMPLIANCE &amp; DELIVERY</h4>

          <Link to="/products">Warranty Coverage</Link>
          <Link to="/products">Compliance &amp; Certifications</Link>
          <Link to="/products">Delivery &amp; Tracking</Link>
          <Link to="/products">Returns &amp; Repairs</Link>
        </div>

        {/* Corporate Contact */}
        <div className="footer-column">
          <h4>CORPORATE CONTACT</h4>

          <a href="/#contact">Global Headquarters</a>
          <a href="/#contact">Commercial Procurement</a>
          <a href="/#contact">Press &amp; Media</a>
          <a href="/#contact">Investor Relations</a>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="nexus-footer-bottom">
        <p>
          © 2026 Nexus Technologies Inc. All rights reserved.
          Industrial Grade Computing Systems.
        </p>

        <div className="footer-bottom-links">
          <Link to="/products">Privacy Policy</Link>
          <Link to="/products">Terms of Service</Link>
          <Link to="/products">Hardware Warranty</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;