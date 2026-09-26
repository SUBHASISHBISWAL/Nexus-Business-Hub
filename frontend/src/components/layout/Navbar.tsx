import { useContext, useEffect, useRef, useState } from "react";
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

  const profileRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  /* =========================================================
     CLOSE PROFILE MENU
     - Outside click
     - Escape key
     ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =========================================================
     PROTECTED NAVIGATION
     ========================================================= */

  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  /* =========================================================
     LOGOUT
     ========================================================= */

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

        {/* =====================================================
            BRAND
            ===================================================== */}

        <Link to="/" className="navbar-brand">
          <i className="bi bi-hdd-network brand-icon"></i>
          <span>Nexus Technologies</span>
        </Link>

        {/* =====================================================
            MAIN NAVIGATION
            ===================================================== */}

        <div className="navbar-menu">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Support
          </NavLink>

        </div>

        {/* =====================================================
            RIGHT ACTIONS
            ===================================================== */}

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

            {wishlist.length > 0 && (
              <span className="badge-count">{wishlist.length}</span>
            )}
          </button>

          {/* Cart */}
          <button
            className="nav-icon-btn notification-icon"
            type="button"
            aria-label="Shopping Cart"
            onClick={() => handleProtectedNavigation("/cart")}
          >
            <i className="bi bi-bag"></i>

            {cart.length > 0 && (
              <span className="badge-count">{cart.length}</span>
            )}
          </button>

          {/* Notifications */}
          <button
            className="nav-icon-btn"
            type="button"
            aria-label="Notifications"
            onClick={() =>
              handleProtectedNavigation("/notifications")
            }
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

          {/* =================================================
              GUEST / LOGGED-IN USER
              ================================================= */}

          {!isLoggedIn ? (
            <button
              className="get-started-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          ) : (
            <div className="profile-wrapper" ref={profileRef}>

              {/* =================================================
                  PROFILE TRIGGER
                  ================================================= */}

              <button
                className={`user-btn ${
                  profileOpen ? "profile-active" : ""
                }`}
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() =>
                  setProfileOpen((previous) => !previous)
                }
              >
                <span className="user-avatar-letter">A</span>

                <i
                  className={`bi ${
                    profileOpen
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  } user-chevron`}
                ></i>
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
                  ================================================= */}

              {profileOpen && (
                <div
                  className="profile-dropdown"
                  role="menu"
                  aria-label="Account menu"
                >

                  {/* Profile Header */}
                  <div className="profile-header">

                    <div className="profile-avatar">
                      A
                    </div>

                    <div className="profile-info">
                      <strong>Ashutosh</strong>
                      <span>ashutosh@email.com</span>
                      <small>Personal Account</small>
                    </div>

                  </div>

                  <div className="profile-divider"></div>

                  <div className="profile-section-label">
                    ACCOUNT
                  </div>

                  {/* =================================================
                      MY PROFILE
                      ================================================= */}

                  <button
                    type="button"
                    className="profile-menu-item"
                    role="menuitem"
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
                      <small>
                        Personal information
                      </small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* =================================================
                      MY ORDERS
                      ================================================= */}

                  <button
                    type="button"
                    className="profile-menu-item"
                    role="menuitem"
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
                      <small>
                        View order history
                      </small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* =================================================
                      WISHLIST
                      ================================================= */}

                  <button
                    type="button"
                    className="profile-menu-item"
                    role="menuitem"
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

                    <span className="wishlist-count">
                      {wishlist.length}
                    </span>
                  </button>

                  {/* =================================================
                      ACCOUNT SETTINGS
                      ================================================= */}

                  <button
                    type="button"
                    className="profile-menu-item"
                    role="menuitem"
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
                      <small>
                        Manage your account
                      </small>
                    </span>

                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  <div className="profile-divider"></div>

                  {/* =================================================
                      SECURITY STATUS
                      ================================================= */}

                  <div className="profile-security">
                    <span className="security-icon">
                      <i className="bi bi-shield-check"></i>
                    </span>

                    <span className="security-content">
                      <strong>Account Protected</strong>
                      <small>
                        Your account is securely signed in
                      </small>
                    </span>

                    <span className="security-status">
                      <span></span>
                      Secure
                    </span>
                  </div>

                  <div className="profile-divider"></div>

                  {/* =================================================
                      LOGOUT
                      ================================================= */}

                  <button
                    type="button"
                    className="profile-menu-item logout-item"
                    role="menuitem"
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
                      <small>
                        Sign out of your account
                      </small>
                    </span>
                  </button>

                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* =========================================================
          LOGOUT CONFIRMATION MODAL
          ========================================================= */}

      {logoutConfirm && (
        <div
          className="logout-overlay"
          onClick={() => setLogoutConfirm(false)}
        >
          <div
            className="logout-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="logout-modal-icon">
              <i className="bi bi-box-arrow-right"></i>
            </div>

            <h3>Logout?</h3>

            <p>
              Are you sure you want to logout from your Nexus
              Technologies account?
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