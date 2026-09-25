import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

type AdminLayoutProps = {
  children: ReactNode;
};

function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Admin Logout
  const handleLogout = () => {
    // Remove admin authentication
    localStorage.removeItem("isAdmin");

    // Close UI elements
    setProfileOpen(false);
    setSidebarOpen(false);

    // Redirect to admin login
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="nx-admin-layout">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="nx-admin-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`nx-admin-sidebar ${
          sidebarOpen ? "nx-admin-sidebar-open" : ""
        }`}
      >

        {/* Brand */}
        <div className="nx-admin-brand">

          <div className="nx-admin-brand-mark">
            N
          </div>

          <div className="nx-admin-brand-copy">
            <span className="nx-admin-brand-name">
              NEXUS
            </span>

            <span className="nx-admin-brand-subtitle">
              BUSINESS HUB
            </span>
          </div>

          <button
            type="button"
            className="nx-admin-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg" />
          </button>

        </div>


        {/* Navigation */}
        <nav className="nx-admin-nav">

          {/* Overview */}
          <div className="nx-admin-nav-section">

            <span className="nx-admin-nav-label">
              Overview
            </span>

            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `nx-admin-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeSidebar}
            >
              <span className="nx-admin-nav-icon">
                <i className="bi bi-grid-1x2" />
              </span>

              <span className="nx-admin-nav-text">
                Dashboard
              </span>
            </NavLink>

          </div>


          {/* Commerce */}
          <div className="nx-admin-nav-section">

            <span className="nx-admin-nav-label">
              Commerce
            </span>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `nx-admin-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeSidebar}
            >
              <span className="nx-admin-nav-icon">
                <i className="bi bi-box-seam" />
              </span>

              <span className="nx-admin-nav-text">
                Products
              </span>
            </NavLink>


            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `nx-admin-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeSidebar}
            >
              <span className="nx-admin-nav-icon">
                <i className="bi bi-receipt" />
              </span>

              <span className="nx-admin-nav-text">
                Orders
              </span>
            </NavLink>

          </div>


          {/* Operations */}
          <div className="nx-admin-nav-section">

            <span className="nx-admin-nav-label">
              Operations
            </span>


            <NavLink
              to="/admin/shipments"
              className={({ isActive }) =>
                `nx-admin-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeSidebar}
            >
              <span className="nx-admin-nav-icon">
                <i className="bi bi-truck" />
              </span>

              <span className="nx-admin-nav-text">
                Shipments
              </span>
            </NavLink>


            <NavLink
              to="/admin/tickets"
              className={({ isActive }) =>
                `nx-admin-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeSidebar}
            >
              <span className="nx-admin-nav-icon">
                <i className="bi bi-headset" />
              </span>

              <span className="nx-admin-nav-text">
                Support
              </span>
            </NavLink>

          </div>

        </nav>


        {/* Sidebar bottom */}
        <div className="nx-admin-sidebar-bottom">

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `nx-admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <span className="nx-admin-nav-icon">
              <i className="bi bi-gear" />
            </span>

            <span className="nx-admin-nav-text">
              Settings
            </span>
          </NavLink>


          {/* Logout */}
          <button
            type="button"
            className="nx-admin-logout"
            onClick={handleLogout}
          >
            <span className="nx-admin-nav-icon">
              <i className="bi bi-box-arrow-right" />
            </span>

            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* Main area */}
      <div className="nx-admin-main">

        {/* Topbar */}
        <header className="nx-admin-topbar">

          <div className="nx-admin-topbar-left">

            <button
              type="button"
              className="nx-admin-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <i className="bi bi-list" />
            </button>


            <div className="nx-admin-search">

              <i className="bi bi-search" />

              <input
                type="search"
                placeholder="Search..."
                aria-label="Search admin panel"
              />

              <span className="nx-admin-search-shortcut">
                /
              </span>

            </div>

          </div>


          <div className="nx-admin-topbar-right">

            {/* Notifications */}
            <button
              type="button"
              className="nx-admin-icon-button"
              aria-label="Notifications"
            >
              <i className="bi bi-bell" />

              <span className="nx-admin-notification-dot" />
            </button>


            <div className="nx-admin-topbar-divider" />


            {/* Profile */}
            <div className="nx-admin-profile-wrapper">

              <button
                type="button"
                className="nx-admin-profile"
                onClick={() =>
                  setProfileOpen(
                    (previous) => !previous
                  )
                }
              >

                <div className="nx-admin-avatar">
                  A
                </div>


                <div className="nx-admin-profile-info">

                  <strong>
                    Admin
                  </strong>

                  <span>
                    Administrator
                  </span>

                </div>


                <i
                  className={`bi bi-chevron-down ${
                    profileOpen ? "open" : ""
                  }`}
                />

              </button>


              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="nx-admin-profile-menu">

                  <button type="button">
                    <i className="bi bi-person" />
                    Profile
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                  >
                    <i className="bi bi-gear" />
                    Settings
                  </button>


                  <div className="nx-admin-profile-menu-divider" />


                  <button
                    type="button"
                    className="danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right" />
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>


        {/* Page content */}
        <main className="nx-admin-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;