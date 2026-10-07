import {
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";
import {
  type AuthState,
  clearAuthSession,
  validateCurrentSession,
  type StoredUser,
} from "../../utils/auth";

import "./Navbar.css";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
  icon: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "System Update Active",
    message: "NexusOS v4.19 LTS firmware synchronization is live.",
    time: "10m ago",
    read: false,
    link: "/products",
    icon: "bi-shield-check",
  },
  {
    id: "notif-2",
    title: "Order Dispatch Center",
    message: "Enterprise delivery tracking available for all recent orders.",
    time: "1h ago",
    read: false,
    link: "/orders",
    icon: "bi-truck",
  },
  {
    id: "notif-3",
    title: "Support Desk",
    message: "Our Solutions Engineering team is available 24/7.",
    time: "3h ago",
    read: true,
    link: "/support",
    icon: "bi-headset",
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { totalCount } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  // Search state
  const urlSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search parameter
  useEffect(() => {
    if (location.pathname === "/products") {
      setSearchQuery(searchParams.get("search") || "");
    } else {
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  }, [location.pathname, searchParams]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen) {
      const timer = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    DEFAULT_NOTIFICATIONS
  );

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const { isAuthenticated, user } = validateCurrentSession();
      setCurrentUser(user);
      setAuthState(isAuthenticated ? "authenticated" : "unauthenticated");
    };

    syncUser();

    window.addEventListener("userUpdated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const isLoggedIn = authState === "authenticated";

  const userFullName =
    [currentUser?.firstName, currentUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "User";

  const getInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return (
        currentUser.firstName[0] + currentUser.lastName[0]
      ).toUpperCase();
    }
    if (currentUser?.firstName) {
      return currentUser.firstName.slice(0, 2).toUpperCase();
    }
    if (userFullName && userFullName !== "User") {
      const parts = userFullName.split(" ").filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const userInitials = getInitials();
  const userEmail = currentUser?.email || "";

  /* =========================================================
     CLOSE MENUS ON OUTSIDE CLICK & ESCAPE
     ========================================================= */
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setIsSearchOpen(false);
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
     SEARCH HANDLERS
     ========================================================= */
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/products");
    }
    if (window.innerWidth <= 768) {
      setIsSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
    if (location.pathname === "/products" && searchParams.get("search")) {
      navigate("/products");
    }
  };

  /* =========================================================
     PROTECTED NAVIGATION
     ========================================================= */
  const handleProtectedNavigation = (path: string) => {
    const { isAuthenticated } = validateCurrentSession();
    if (!isAuthenticated) {
      const returnUrlParam =
        path.includes("?") || path.includes("&")
          ? encodeURIComponent(path)
          : path;
      navigate(`/login?returnUrl=${returnUrlParam}`);
      return;
    }
    navigate(path);
  };

  /* =========================================================
     LOGOUT
     ========================================================= */
  const handleLogout = () => {
    clearAuthSession();

    setLogoutConfirm(false);
    setProfileOpen(false);

    navigate("/");
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <nav className="nexus-navbar">
      <div className="navbar-container">

        {/* =====================================================
            1. BRAND
            ===================================================== */}
        <Link to="/" className="navbar-brand" aria-label="Nexus Technologies Home">
          <i className="bi bi-hdd-network brand-icon" aria-hidden="true"></i>
          <span>Nexus Technologies</span>
        </Link>

        {/* =====================================================
            2. MAIN NAVIGATION LINKS
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
            3. RIGHT ACTIONS (SEARCH, WISHLIST, CART, NOTIF, THEME, PROFILE)
            ===================================================== */}
        <div className="navbar-actions">

          {/* Search Trigger or Expanded Search Form */}
          <div
            className={`navbar-search-wrapper ${isSearchOpen ? "open" : ""}`}
            ref={searchRef}
          >
            {!isSearchOpen ? (
              <button
                type="button"
                className="nav-icon-btn navbar-search-toggle"
                onClick={handleOpenSearch}
                aria-label="Open search"
                title="Search products"
              >
                <i className="bi bi-search" aria-hidden="true"></i>
              </button>
            ) : (
              <form
                className="navbar-search-form"
                role="search"
                onSubmit={handleSearchSubmit}
              >
                <i className="bi bi-search search-form-icon" aria-hidden="true"></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="navbar-search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="navbar-search-clear"
                    onClick={handleClearSearch}
                    aria-label="Clear search text"
                    title="Clear text"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
                <button
                  type="submit"
                  className="navbar-search-submit"
                  aria-label="Submit search"
                >
                  Search
                </button>
                <button
                  type="button"
                  className="navbar-search-close"
                  onClick={handleCloseSearch}
                  aria-label="Close search"
                  title="Close search"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </form>
            )}
          </div>

          {/* Wishlist */}
          <button
            className="nav-icon-btn notification-icon"
            type="button"
            aria-label={`Wishlist, ${wishlist.length} items`}
            onClick={() => handleProtectedNavigation("/wishlist")}
            title="Wishlist"
          >
            <i className="bi bi-heart" aria-hidden="true"></i>
            {wishlist.length > 0 && (
              <span className="badge-count">{wishlist.length}</span>
            )}
          </button>

          {/* Cart */}
          <button
            className="nav-icon-btn notification-icon"
            type="button"
            aria-label={`Shopping Cart, ${totalCount} items`}
            onClick={() => handleProtectedNavigation("/cart")}
            title="Shopping Cart"
          >
            <i className="bi bi-bag" aria-hidden="true"></i>
            {totalCount > 0 && (
              <span className="badge-count">{totalCount}</span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="notifications-wrapper" ref={notificationsRef}>
            <button
              className="nav-icon-btn notification-icon"
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((prev) => !prev)}
              title="Notifications"
            >
              <i className="bi bi-bell" aria-hidden="true"></i>
              {unreadNotifsCount > 0 && (
                <span className="notification-dot" aria-hidden="true"></span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className="notifications-dropdown"
                role="dialog"
                aria-label="Notifications panel"
              >
                <div className="notifications-header">
                  <div>
                    <strong>Notifications</strong>
                    {unreadNotifsCount > 0 && (
                      <span className="unread-pill">{unreadNotifsCount} new</span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      type="button"
                      className="mark-read-btn"
                      onClick={markAllNotifsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notifications-list">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notification-item ${
                        item.read ? "read" : "unread"
                      }`}
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate(item.link);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="notification-item-icon">
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                      <div className="notification-item-body">
                        <strong>{item.title}</strong>
                        <p>{item.message}</p>
                        <small>{item.time}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="notifications-footer">
                  <button
                    type="button"
                    className="view-orders-link"
                    onClick={() => {
                      setNotificationsOpen(false);
                      handleProtectedNavigation("/orders");
                    }}
                  >
                    View Order Updates
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            className="theme-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to Light Theme"
                : "Switch to Dark Theme"
            }
            title={
              theme === "dark"
                ? "Switch to Light Theme"
                : "Switch to Dark Theme"
            }
          >
            <i
              className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon"}`}
              aria-hidden="true"
            ></i>
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

              {/* PROFILE TRIGGER */}
              <button
                className={`user-btn ${
                  profileOpen ? "profile-active" : ""
                }`}
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((previous) => !previous)}
              >
                <span className="user-avatar-letter">{userInitials}</span>

                <i
                  className={`bi ${
                    profileOpen ? "bi-chevron-up" : "bi-chevron-down"
                  } user-chevron`}
                  aria-hidden="true"
                ></i>
              </button>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <div
                  className="profile-dropdown"
                  role="menu"
                  aria-label="Account menu"
                >
                  {/* Profile Header */}
                  <div className="profile-header">
                    <div className="profile-avatar">{userInitials}</div>

                    <div className="profile-info">
                      <strong>{userFullName}</strong>
                      <span>{userEmail}</span>
                      <small>
                        {currentUser?.role
                          ? `${currentUser.role} Account`
                          : "Customer Account"}
                      </small>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  <div className="profile-section-label">ACCOUNT</div>

                  {/* MY PROFILE */}
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
                      <small>Personal information</small>
                    </span>
                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* MY ORDERS */}
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
                      <small>View order history</small>
                    </span>
                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  {/* WISHLIST */}
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
                    <span className="wishlist-count">{wishlist.length}</span>
                  </button>

                  {/* ACCOUNT SETTINGS */}
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
                      <small>Manage your account</small>
                    </span>
                    <i className="bi bi-chevron-right menu-arrow"></i>
                  </button>

                  <div className="profile-divider"></div>

                  {/* SECURITY STATUS */}
                  <div className="profile-security">
                    <span className="security-icon">
                      <i className="bi bi-shield-check"></i>
                    </span>
                    <span className="security-content">
                      <strong>Account Protected</strong>
                      <small>Your account is securely signed in</small>
                    </span>
                    <span className="security-status">
                      <span></span>
                      Secure
                    </span>
                  </div>

                  <div className="profile-divider"></div>

                  {/* LOGOUT */}
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
                      <small>Sign out of your account</small>
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div className="logout-modal-icon">
              <i className="bi bi-box-arrow-right"></i>
            </div>

            <h3 id="logout-title">Logout?</h3>

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