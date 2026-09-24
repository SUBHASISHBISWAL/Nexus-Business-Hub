import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { wishlist } = useWishlist();

  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setLogoutConfirm(false);
    setProfileOpen(false);

    navigate("/");
    window.location.reload();
  };

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
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          {/* Products */}
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Products
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            About
          </NavLink>

          {/* Support */}
          <NavLink
            to="/support"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Support
          </NavLink>
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
            onClick={() => handleProtectedNavigation("/wishlist")}
          >
            <i className="bi bi-heart"></i>

            <span className="badge-count">{wishlist.length}</span>
          </button>

          {/* Cart */}
          <button
            className="nav-icon-btn notification-icon"
            type="button"
            aria-label="Shopping Cart"
            onClick={() => handleProtectedNavigation("/cart")}
          >
            <i className="bi bi-bag"></i>

            <span className="badge-count">{cart.length}</span>
          </button>

          {/* Notification */}
          <button
            className="nav-icon-btn"
            type="button"
            aria-label="Notifications"
            onClick={() => handleProtectedNavigation("/notifications")}
          >
            <i className="bi bi-bell"></i>
          </button>

          {/* Theme */}
          <button className="theme-btn" type="button" aria-label="Toggle theme">
            <i className="bi bi-sun"></i>
          </button>

          {/* Guest / User */}
          {!isLoggedIn ? (
            <button
              className="get-started-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          ) : (
            <div className="profile-wrapper">
              {/* User Button */}
              <button
                className={`user-btn ${profileOpen ? "profile-active" : ""}`}
                type="button"
                aria-label="User profile"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                U
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="profile-dropdown">
                  {/* User Header */}
                  <div className="profile-header">
                    <div className="profile-avatar">U</div>

                    <div className="profile-info">
                      <strong>Ashutosh</strong>
                      <span>ashutosh@email.com</span>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  {/* My Profile */}
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <span className="profile-menu-icon">
                      <i className="bi bi-person"></i>
                    </span>

                    <span className="profile-menu-text">
                      <strong>My Profile</strong>
                      <small>View your profile</small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* My Orders */}
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/orders");
                    }}
                  >
                    <span className="profile-menu-icon">
                      <i className="bi bi-box-seam"></i>
                    </span>

                    <span className="profile-menu-text">
                      <strong>My Orders</strong>
                      <small>Track your orders</small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* Wishlist */}
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/wishlist");
                    }}
                  >
                    <span className="profile-menu-icon">
                      <i className="bi bi-heart"></i>
                    </span>

                    <span className="profile-menu-text">
                      <strong>Wishlist</strong>
                      <small>
                        {wishlist.length} saved item
                        {wishlist.length !== 1 ? "s" : ""}
                      </small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* Settings */}
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <span className="profile-menu-icon">
                      <i className="bi bi-gear"></i>
                    </span>

                    <span className="profile-menu-text">
                      <strong>Account Settings</strong>
                      <small>Manage your account</small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  <div className="profile-divider"></div>

                  {/* Logout */}
                  <button
                    type="button"
                    className="profile-menu-item logout-item"
                    onClick={() => {
                      setProfileOpen(false);
                      setLogoutConfirm(true);
                    }}
                  >
                    <span className="profile-menu-icon">
                      <i className="bi bi-box-arrow-right"></i>
                    </span>

                    <span className="profile-menu-text">
                      <strong>Logout</strong>
                      <small>Sign out of your account</small>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <div className="logout-overlay" onClick={() => setLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <i className="bi bi-box-arrow-right"></i>
            </div>

            <h3>Logout?</h3>

            <p>
              Are you sure you want to logout from your Nexus Technologies
              account?
            </p>

            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-cancel-btn"
                onClick={() => setLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-confirm-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
