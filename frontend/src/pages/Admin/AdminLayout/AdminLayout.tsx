import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

type AdminLayoutProps = {
  children: ReactNode;
};

type Section =
  | "overview"
  | "commerce"
  | "operations"
  | "administration"
  | "";

function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [openSection, setOpenSection] =
    useState<Section>("overview");

  // Sidebar hide/show state
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(() => {
      return (
        localStorage.getItem(
          "nexus-admin-sidebar-collapsed"
        ) === "true"
      );
    });

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSection = (
    section: Exclude<Section, "">
  ) => {
    setOpenSection((previous) =>
      previous === section ? "" : section
    );
  };

  // Hide / Show sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed((previous) => {
      const next = !previous;

      localStorage.setItem(
        "nexus-admin-sidebar-collapsed",
        String(next)
      );

      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setProfileOpen(false);
    setSidebarOpen(false);

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="nx-admin-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="nx-admin-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`nx-admin-sidebar ${
          sidebarOpen
            ? "nx-admin-sidebar-open"
            : ""
        } ${
          sidebarCollapsed
            ? "is-collapsed"
            : ""
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

          {/* Mobile Close */}
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

          {/* ================= OVERVIEW ================= */}
          <div className="nx-admin-nav-section">

            <button
              type="button"
              className="nx-admin-nav-section-header"
              onClick={() =>
                toggleSection("overview")
              }
              aria-expanded={
                openSection === "overview"
              }
            >
              <span className="nx-admin-nav-label">
                Overview
              </span>

              <i
                className={`bi ${
                  openSection === "overview"
                    ? "bi-chevron-down"
                    : "bi-chevron-right"
                }`}
              />
            </button>

            {openSection === "overview" && (
              <div className="nx-admin-nav-submenu">

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
            )}

          </div>

          {/* ================= COMMERCE ================= */}
          <div className="nx-admin-nav-section">

            <button
              type="button"
              className="nx-admin-nav-section-header"
              onClick={() =>
                toggleSection("commerce")
              }
              aria-expanded={
                openSection === "commerce"
              }
            >
              <span className="nx-admin-nav-label">
                Commerce
              </span>

              <i
                className={`bi ${
                  openSection === "commerce"
                    ? "bi-chevron-down"
                    : "bi-chevron-right"
                }`}
              />
            </button>

            {openSection === "commerce" && (
              <div className="nx-admin-nav-submenu">

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

                <NavLink
                  to="/admin/payments"
                  className={({ isActive }) =>
                    `nx-admin-nav-item ${
                      isActive ? "active" : ""
                    }`
                  }
                  onClick={closeSidebar}
                >
                  <span className="nx-admin-nav-icon">
                    <i className="bi bi-credit-card" />
                  </span>

                  <span className="nx-admin-nav-text">
                    Payments
                  </span>
                </NavLink>

              </div>
            )}

          </div>

          {/* ================= OPERATIONS ================= */}
          <div className="nx-admin-nav-section">

            <button
              type="button"
              className="nx-admin-nav-section-header"
              onClick={() =>
                toggleSection("operations")
              }
              aria-expanded={
                openSection === "operations"
              }
            >
              <span className="nx-admin-nav-label">
                Operations
              </span>

              <i
                className={`bi ${
                  openSection === "operations"
                    ? "bi-chevron-down"
                    : "bi-chevron-right"
                }`}
              />
            </button>

            {openSection === "operations" && (
              <div className="nx-admin-nav-submenu">

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
            )}

          </div>

          {/* ================= ADMINISTRATION ================= */}
          <div className="nx-admin-nav-section">

            <button
              type="button"
              className="nx-admin-nav-section-header"
              onClick={() =>
                toggleSection("administration")
              }
              aria-expanded={
                openSection === "administration"
              }
            >
              <span className="nx-admin-nav-label">
                Administration
              </span>

              <i
                className={`bi ${
                  openSection === "administration"
                    ? "bi-chevron-down"
                    : "bi-chevron-right"
                }`}
              />
            </button>

            {openSection === "administration" && (
              <div className="nx-admin-nav-submenu">

                <NavLink
                  to="/admin/administrators"
                  className={({ isActive }) =>
                    `nx-admin-nav-item ${
                      isActive ? "active" : ""
                    }`
                  }
                  onClick={closeSidebar}
                >
                  <span className="nx-admin-nav-icon">
                    <i className="bi bi-people" />
                  </span>

                  <span className="nx-admin-nav-text">
                    Administrators
                  </span>
                </NavLink>

              </div>
            )}

          </div>

        </nav>

        {/* ================= SIDEBAR BOTTOM ================= */}
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

          <button
            type="button"
            className="nx-admin-logout"
            onClick={handleLogout}
          >
            <span className="nx-admin-nav-icon">
              <i className="bi bi-box-arrow-right" />
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <div
        className={`nx-admin-main ${
          sidebarCollapsed
            ? "is-sidebar-collapsed"
            : ""
        }`}
      >

        {/* ================= TOPBAR ================= */}
        <header className="nx-admin-topbar">

          <div className="nx-admin-topbar-left">

            {/* Mobile Menu */}
            <button
              type="button"
              className="nx-admin-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open navigation"
            >
              <i className="bi bi-list" />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              className="nx-admin-sidebar-toggle"
              onClick={toggleSidebar}
              aria-label={
                sidebarCollapsed
                  ? "Show sidebar"
                  : "Hide sidebar"
              }
              title={
                sidebarCollapsed
                  ? "Show sidebar"
                  : "Hide sidebar"
              }
            >
              <i
                className={`bi ${
                  sidebarCollapsed
                    ? "bi-layout-sidebar"
                    : "bi-layout-sidebar-inset"
                }`}
              />
            </button>

            {/* Search */}
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

          {/* ================= TOPBAR RIGHT ================= */}
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
                aria-expanded={profileOpen}
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

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);

                      navigate(
                        "/admin/administrators"
                      );
                    }}
                  >
                    <i className="bi bi-people" />

                    Administrators
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);

                      navigate(
                        "/admin/settings"
                      );
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

        {/* ================= PAGE CONTENT ================= */}
        <main className="nx-admin-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;