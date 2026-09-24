import { useState } from "react";
import "./AdminSettings.css";

type NotificationSettings = {
  orders: boolean;
  shipments: boolean;
  tickets: boolean;
  lowStock: boolean;
  email: boolean;
  browser: boolean;
};

type IconName =
  | "verified"
  | "schedule"
  | "security"
  | "edit"
  | "store"
  | "storefront"
  | "mail"
  | "monitoring"
  | "check"
  | "info"
  | "notifications"
  | "shopping_bag"
  | "local_shipping"
  | "support_agent"
  | "inventory_2"
  | "web"
  | "shield_lock"
  | "password"
  | "login"
  | "devices"
  | "save"
  | "close";

const iconMap: Record<IconName, string> = {
  verified: "bi-patch-check-fill",
  schedule: "bi-clock",
  security: "bi-shield-check",
  edit: "bi-pencil",
  store: "bi-shop",
  storefront: "bi-shop-window",
  mail: "bi-envelope",
  monitoring: "bi-activity",
  check: "bi-check-lg",
  info: "bi-info-circle",
  notifications: "bi-bell",
  shopping_bag: "bi-bag",
  local_shipping: "bi-truck",
  support_agent: "bi-headset",
  inventory_2: "bi-box-seam",
  web: "bi-globe2",
  shield_lock: "bi-shield-lock",
  password: "bi-key",
  login: "bi-box-arrow-in-right",
  devices: "bi-pc-display-horizontal",
  save: "bi-check2",
  close: "bi-x-lg",
};

function AdminIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <i
      className={`bi ${iconMap[name]} ${className}`}
      aria-hidden="true"
    />
  );
}

function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] =
    useState<NotificationSettings>({
      orders: true,
      shipments: true,
      tickets: true,
      lowStock: true,
      email: true,
      browser: false,
    });

  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const toggleNotification = (
    key: keyof NotificationSettings
  ) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleReset = () => {
    setNotifications({
      orders: true,
      shipments: true,
      tickets: true,
      lowStock: true,
      email: true,
      browser: false,
    });

    setTwoFactor(false);
    setLoginAlerts(true);
    setSaved(false);
  };

  return (
    <div className="nx-settings-page">
      <header className="nx-settings-page-header">
        <div>
          <span className="nx-settings-kicker">SYSTEM SETTINGS</span>
          <h1>Settings</h1>
          <p>
            Manage your workspace, account preferences and
            platform configuration.
          </p>
        </div>

        <div className="nx-settings-header-meta">
          <span className="nx-settings-live-dot" />
          <span>System Operational</span>
        </div>
      </header>

      {saved && (
        <div className="nx-settings-toast" role="status">
          <AdminIcon name="check" />

          <div>
            <strong>Changes saved</strong>
            <span>
              Your settings have been updated successfully.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSaved(false)}
            aria-label="Close notification"
          >
            <AdminIcon name="close" />
          </button>
        </div>
      )}

      <section className="nx-settings-profile-card">
        <div className="nx-profile-left">
          <div className="nx-profile-avatar">AS</div>

          <div className="nx-profile-details">
            <div className="nx-profile-name-row">
              <h2>Ashutosh Sahu</h2>

              <span className="nx-admin-badge">
                <AdminIcon name="verified" />
                <span>Super Admin</span>
              </span>
            </div>

            <p>admin@nexusbusiness.com</p>

            <div className="nx-profile-meta-row">
              <span>
                <AdminIcon name="schedule" />
                <span>Last login today, 09:42 AM</span>
              </span>

              <span>
                <AdminIcon name="security" />
                <span>Account protected</span>
              </span>
            </div>
          </div>
        </div>

        <button type="button" className="nx-outline-btn">
          <AdminIcon name="edit" />
          <span>Edit Profile</span>
        </button>
      </section>

      <div className="nx-settings-grid">
        <section className="nx-settings-card">
          <div className="nx-card-heading">
            <div className="nx-card-icon">
              <AdminIcon name="store" />
            </div>

            <div>
              <h2>Store Configuration</h2>
              <p>Basic information about your storefront.</p>
            </div>
          </div>

          <div className="nx-settings-form">
            <div className="nx-form-group">
              <label htmlFor="store-name">Store Name</label>

              <div className="nx-input-wrap">
                

                <input
                  id="store-name"
                  type="text"
                  defaultValue="Nexus Business Hub"
                />
              </div>
            </div>

            <div className="nx-form-row">
              <div className="nx-form-group">
                <label htmlFor="currency">Currency</label>

                <select id="currency" defaultValue="INR">
                  <option value="INR">
                    INR — Indian Rupee (₹)
                  </option>
                  <option value="USD">
                    USD — US Dollar ($)
                  </option>
                  <option value="EUR">
                    EUR — Euro (€)
                  </option>
                </select>
              </div>

              <div className="nx-form-group">
                <label htmlFor="timezone">Time Zone</label>

                <select id="timezone" defaultValue="IST">
                  <option value="IST">
                    Asia/Kolkata — IST
                  </option>
                  <option value="GST">
                    Asia/Dubai — GST
                  </option>
                  <option value="GMT">
                    Europe/London — GMT
                  </option>
                </select>
              </div>
            </div>

            <div className="nx-form-group">
              <label htmlFor="support-email">Support Email</label>

              <div className="nx-input-wrap">
                

                <input
                  id="support-email"
                  type="email"
                  defaultValue="support@nexusbusiness.com"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="nx-settings-card">
          <div className="nx-card-heading">
            <div className="nx-card-icon nx-card-icon-green">
              <AdminIcon name="monitoring" />
            </div>

            <div>
              <h2>Store Status</h2>
              <p>Current storefront operational status.</p>
            </div>
          </div>

          <div className="nx-store-status-main">
            <div className="nx-operational-icon">
              <AdminIcon name="check" />
            </div>

            <div>
              <strong>Operational</strong>
              <p>
                Your storefront is currently available to
                customers.
              </p>
            </div>
          </div>

          <div className="nx-status-list">
            <div>
              <span>Storefront</span>
              <strong className="nx-status-ok">Online</strong>
            </div>

            <div>
              <span>Checkout</span>
              <strong className="nx-status-ok">Enabled</strong>
            </div>

            <div>
              <span>Order Processing</span>
              <strong className="nx-status-ok">Active</strong>
            </div>
          </div>

          <div className="nx-status-info">
            <AdminIcon name="info" />
            <p>
              Maintenance mode is currently disabled.
              Customers can browse products and place orders.
            </p>
          </div>
        </section>
      </div>

      <section className="nx-settings-card">
        <div className="nx-card-heading">
          <div className="nx-card-icon">
            <AdminIcon name="notifications" />
          </div>

          <div>
            <h2>Notification Preferences</h2>
            <p>
              Control which operational events you receive
              notifications for.
            </p>
          </div>
        </div>

        <div className="nx-preference-list">
          <PreferenceRow
            icon="shopping_bag"
            title="New Orders"
            description="Receive an alert whenever a new order is placed."
            checked={notifications.orders}
            onChange={() => toggleNotification("orders")}
          />

          <PreferenceRow
            icon="local_shipping"
            title="Shipment Updates"
            description="Get notified when shipment status changes."
            checked={notifications.shipments}
            onChange={() =>
              toggleNotification("shipments")
            }
          />

          <PreferenceRow
            icon="support_agent"
            title="Support Tickets"
            description="Receive alerts for new customer support tickets."
            checked={notifications.tickets}
            onChange={() => toggleNotification("tickets")}
          />

          <PreferenceRow
            icon="inventory_2"
            title="Low Stock Alerts"
            description="Get notified when products reach low inventory."
            checked={notifications.lowStock}
            onChange={() =>
              toggleNotification("lowStock")
            }
          />

          <PreferenceRow
            icon="mail"
            title="Email Notifications"
            description="Send important administrative alerts to your email."
            checked={notifications.email}
            onChange={() => toggleNotification("email")}
          />

          <PreferenceRow
            icon="web"
            title="Browser Notifications"
            description="Show real-time alerts inside your browser."
            checked={notifications.browser}
            onChange={() =>
              toggleNotification("browser")
            }
          />
        </div>
      </section>

      <section className="nx-settings-card">
        <div className="nx-card-heading">
          <div className="nx-card-icon nx-card-icon-purple">
            <AdminIcon name="shield_lock" />
          </div>

          <div>
            <h2>Security & Access</h2>
            <p>
              Protect your administrator account and manage
              access preferences.
            </p>
          </div>
        </div>

        <div className="nx-security-list">
          <div className="nx-security-row">
            <div className="nx-security-row-icon">
              <AdminIcon name="password" />
            </div>

            <div className="nx-security-content">
              <strong>Password</strong>
              <span>Last changed 30 days ago</span>
            </div>

            <button
              type="button"
              className="nx-outline-btn"
            >
              Change Password
            </button>
          </div>

          <div className="nx-security-row">
            <div className="nx-security-row-icon">
              <AdminIcon name="security" />
            </div>

            <div className="nx-security-content">
              <strong>
                Two-Factor Authentication
              </strong>
              <span>
                Add an additional layer of protection to
                your account.
              </span>
            </div>

            <Toggle
              checked={twoFactor}
              onChange={() => setTwoFactor(!twoFactor)}
            />
          </div>

          <div className="nx-security-row">
            <div className="nx-security-row-icon">
              <AdminIcon name="login" />
            </div>

            <div className="nx-security-content">
              <strong>Login Alerts</strong>
              <span>
                Receive alerts when your account is accessed
                from a new device.
              </span>
            </div>

            <Toggle
              checked={loginAlerts}
              onChange={() =>
                setLoginAlerts(!loginAlerts)
              }
            />
          </div>

          <div className="nx-security-row">
            <div className="nx-security-row-icon">
              <AdminIcon name="devices" />
            </div>

            <div className="nx-security-content">
              <strong>Active Sessions</strong>
              <span>
                2 active sessions are currently connected.
              </span>
            </div>

            <button
              type="button"
              className="nx-danger-btn"
            >
              Sign Out All
            </button>
          </div>
        </div>
      </section>

      <div className="nx-settings-action-bar">
        <div>
          <strong>Unsaved changes</strong>
          <span>Review your settings before saving.</span>
        </div>

        <div className="nx-action-buttons">
          <button
            type="button"
            className="nx-reset-btn"
            onClick={handleReset}
          >
            Discard
          </button>

          <button
            type="button"
            className="nx-primary-btn"
            onClick={handleSave}
          >
            <AdminIcon name="save" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type PreferenceRowProps = {
  icon: IconName;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function PreferenceRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: PreferenceRowProps) {
  return (
    <div className="nx-preference-row">
      <div className="nx-preference-icon">
        <AdminIcon name={icon} />
      </div>

      <div className="nx-preference-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
};

function Toggle({
  checked,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      className={`nx-toggle ${
        checked ? "active" : ""
      }`}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={
        checked ? "Disable setting" : "Enable setting"
      }
    >
      <span />
    </button>
  );
}

export default AdminSettings;
