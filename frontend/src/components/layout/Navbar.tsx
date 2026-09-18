import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import "./Navbar.css";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { wishlist } = useWishlist();

  return (
    <nav className="nexus-navbar">
      <div className="navbar-container">

        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <i className="bi bi-hdd-network brand-icon"></i>
          <span>Nexus Technologies</span>
        </Link>

        {/* Navigation */}
        <div className="navbar-menu">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          {/* Products */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Products
          </NavLink>

          {/* Categories */}
          <a
            href="/#categories"
            className="nav-link"
          >
            Categories
          </a>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            About
          </NavLink>

          {/* Support */}
          <a
            href="/#contact"
            className="nav-link"
          >
            Support
          </a>

        </div>

        {/* Right Actions */}
        <div className="navbar-actions">

          {/* Search */}
          <Link
            to="/products"
            className="nav-icon-btn"
            aria-label="Search catalog"
          >
            <i className="bi bi-search"></i>
          </Link>

          {/* Wishlist */}
          <button
            className="nav-icon-btn notification-icon"
            type="button"
            aria-label="Wishlist"
          >
            <i className="bi bi-heart"></i>

            <span className="badge-count">
              {wishlist.length}
            </span>
          </button>

          {/* Cart */}
          <Link
            to="/products"
            className="nav-icon-btn notification-icon"
            aria-label="Shopping Cart"
          >
            <i className="bi bi-bag"></i>

            <span className="badge-count">
              {cart.length}
            </span>
          </Link>

          {/* Notification */}
          <button
            className="nav-icon-btn"
            type="button"
            aria-label="Notifications"
          >
            <i className="bi bi-bell"></i>
          </button>

          {/* Theme */}
          <button
            className="theme-btn"
            type="button"
            aria-label="Toggle theme"
          >
            <i className="bi bi-sun"></i>
          </button>

          {/* View Products */}
          <Link
            to="/products"
            className="view-products-btn"
          >
            View Products
          </Link>

          {/* User */}
          <button
            className="user-btn"
            type="button"
            aria-label="User profile"
          >
            U
          </button>

        </div>
      </div>
    </nav>
  );
}