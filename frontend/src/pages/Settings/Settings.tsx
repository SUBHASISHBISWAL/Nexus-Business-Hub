import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Settings.css";

interface PreferenceState {
  emailNotifications: boolean;
  orderUpdates: boolean;
  shipmentUpdates: boolean;
  supportUpdates: boolean;
  marketingEmails: boolean;
  productAnnouncements: boolean;
  offersUpdates: boolean;
  profileVisibility: boolean;
  dataPersonalization: boolean;
}

const defaultPreferences: PreferenceState = {
  emailNotifications: true,
  orderUpdates: true,
  shipmentUpdates: true,
  supportUpdates: true,
  marketingEmails: false,
  productAnnouncements: true,
  offersUpdates: false,
  profileVisibility: false,
  dataPersonalization: true,
};

export default function Settings() {
  const navigate = useNavigate();

  const [preferences, setPreferences] =
    useState<PreferenceState>(defaultPreferences);

  const [savedMessage, setSavedMessage] = useState("");

  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const showSavedMessage = (message: string) => {
    setSavedMessage(message);

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3500);
  };

  const handleToggle = (key: keyof PreferenceState) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    showSavedMessage("Preference updated successfully.");
  };

  const handleSavePreferences = () => {
    showSavedMessage("Account preferences saved successfully.");
  };

  const handlePasswordChange = () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation password do not match."
      );
      return;
    }

    setPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    showSavedMessage("Password updated successfully.");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setLogoutModal(false);
    navigate("/login");
  };

  return (
    <main className="settings-page">
      <div className="container-fluid settings-container">

        {/* PAGE HEADER */}
        <div className="settings-page-header d-flex justify-content-between align-items-end flex-wrap gap-3">
          <div>
            <span className="settings-eyebrow">
              ACCOUNT
            </span>

            <h1>Account Settings</h1>

            <p>
              Manage your preferences, security and privacy
              settings.
            </p>
          </div>

          <Link
            to="/profile"
            className="settings-profile-link"
          >
            <i className="bi bi-person"></i>
            Back to Profile
          </Link>
        </div>

        {/* SUCCESS MESSAGE */}
        {savedMessage && (
          <div className="settings-success-message">
            <div className="settings-success-icon">
              <i className="bi bi-check-lg"></i>
            </div>

            <div className="settings-success-content">
              <strong>Changes saved</strong>
              <span>{savedMessage}</span>
            </div>

            <button
              type="button"
              aria-label="Close notification"
              onClick={() => setSavedMessage("")}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        )}

        {/* ACCOUNT NAVIGATION */}
        <section className="settings-account-nav row g-3">
          <div className="col-lg-4 col-md-6">
            <Link to="/profile" className="settings-nav-item">
              <div className="settings-nav-icon blue">
                <i className="bi bi-person"></i>
              </div>

              <div>
                <strong>My Profile</strong>
                <span>Personal information</span>
              </div>

              <i className="bi bi-chevron-right"></i>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link to="/orders" className="settings-nav-item">
              <div className="settings-nav-icon green">
                <i className="bi bi-box-seam"></i>
              </div>

              <div>
                <strong>My Orders</strong>
                <span>Orders and tracking</span>
              </div>

              <i className="bi bi-chevron-right"></i>
            </Link>
          </div>

          <div className="col-lg-4 col-md-12">
            <Link
              to="/support/tickets"
              className="settings-nav-item"
            >
              <div className="settings-nav-icon purple">
                <i className="bi bi-headset"></i>
              </div>

              <div>
                <strong>Support</strong>
                <span>Tickets and assistance</span>
              </div>

              <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="row g-4 settings-content-grid">

          {/* LEFT */}
          <div className="col-lg-8">

            {/* ACCOUNT PREFERENCES */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-heading">
                  <div className="settings-section-icon blue">
                    <i className="bi bi-bell"></i>
                  </div>

                  <div>
                    <h2>Account Preferences</h2>
                    <p>
                      Choose how you want to receive important
                      account notifications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="settings-list">

                <SettingToggle
                  icon="bi-envelope"
                  title="Email Notifications"
                  description="Receive important account-related notifications by email."
                  checked={preferences.emailNotifications}
                  onChange={() =>
                    handleToggle("emailNotifications")
                  }
                />

                <SettingToggle
                  icon="bi-bag-check"
                  title="Order Updates"
                  description="Get updates about order confirmation, processing and delivery."
                  checked={preferences.orderUpdates}
                  onChange={() =>
                    handleToggle("orderUpdates")
                  }
                />

                <SettingToggle
                  icon="bi-truck"
                  title="Shipment Updates"
                  description="Receive shipment and delivery tracking notifications."
                  checked={preferences.shipmentUpdates}
                  onChange={() =>
                    handleToggle("shipmentUpdates")
                  }
                />

                <SettingToggle
                  icon="bi-chat-left-text"
                  title="Support Updates"
                  description="Get notifications when your support tickets are updated."
                  checked={preferences.supportUpdates}
                  onChange={() =>
                    handleToggle("supportUpdates")
                  }
                />

              </div>
            </section>

            {/* COMMUNICATION */}
            <section className="settings-card mt-4">
              <div className="settings-card-header">
                <div className="settings-card-heading">
                  <div className="settings-section-icon purple">
                    <i className="bi bi-megaphone"></i>
                  </div>

                  <div>
                    <h2>Communication Preferences</h2>
                    <p>
                      Control optional product and promotional
                      communications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="settings-list">

                <SettingToggle
                  icon="bi-envelope-paper"
                  title="Marketing Emails"
                  description="Receive occasional marketing and promotional emails."
                  checked={preferences.marketingEmails}
                  onChange={() =>
                    handleToggle("marketingEmails")
                  }
                />

                <SettingToggle
                  icon="bi-stars"
                  title="Product Announcements"
                  description="Receive information about new products and platform features."
                  checked={preferences.productAnnouncements}
                  onChange={() =>
                    handleToggle("productAnnouncements")
                  }
                />

                <SettingToggle
                  icon="bi-tag"
                  title="Offers & Updates"
                  description="Receive special offers and relevant product updates."
                  checked={preferences.offersUpdates}
                  onChange={() =>
                    handleToggle("offersUpdates")
                  }
                />

              </div>
            </section>

            {/* PRIVACY */}
            <section className="settings-card mt-4">
              <div className="settings-card-header">
                <div className="settings-card-heading">
                  <div className="settings-section-icon green">
                    <i className="bi bi-lock"></i>
                  </div>

                  <div>
                    <h2>Privacy & Data</h2>
                    <p>
                      Manage how your account information and
                      preferences are handled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="settings-list">

                <SettingToggle
                  icon="bi-eye-slash"
                  title="Profile Visibility"
                  description="Keep your customer profile private from other users."
                  checked={preferences.profileVisibility}
                  onChange={() =>
                    handleToggle("profileVisibility")
                  }
                />

                <SettingToggle
                  icon="bi-sliders"
                  title="Personalized Experience"
                  description="Allow your preferences to improve your shopping experience."
                  checked={preferences.dataPersonalization}
                  onChange={() =>
                    handleToggle("dataPersonalization")
                  }
                />

              </div>

              <div className="privacy-info">
                <i className="bi bi-info-circle"></i>

                <div>
                  <strong>Your privacy matters</strong>
                  <span>
                    Your account preferences are used to
                    personalize your Nexus experience. Sensitive
                    account information should never be shared
                    publicly.
                  </span>
                </div>
              </div>
            </section>

            {/* SAVE */}
            <div className="settings-save-row mt-4 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() =>
                  setPreferences(defaultPreferences)
                }
              >
                Reset Changes
              </button>

              <button
                type="button"
                className="settings-primary-btn"
                onClick={handleSavePreferences}
              >
                <i className="bi bi-check2"></i>
                Save Preferences
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">

            {/* SECURITY */}
            <section className="settings-card security-card">
              <div className="settings-card-heading">
                <div className="settings-section-icon orange">
                  <i className="bi bi-shield-lock"></i>
                </div>

                <div>
                  <h2>Security</h2>
                  <p>Protect your account.</p>
                </div>
              </div>

              <div className="security-status-box">
                <div className="security-status-icon">
                  <i className="bi bi-shield-check"></i>
                </div>

                <div>
                  <strong>Account Protected</strong>
                  <span>
                    Your account security is active.
                  </span>
                </div>

                <span className="security-protected">
                  Protected
                </span>
              </div>

              <button
                type="button"
                className="settings-security-btn"
                onClick={() => setPasswordModal(true)}
              >
                <i className="bi bi-key"></i>
                Change Password
                <i className="bi bi-chevron-right"></i>
              </button>

              <div className="security-note">
                <i className="bi bi-info-circle"></i>
                <span>
                  Use a strong password that you do not use
                  elsewhere.
                </span>
              </div>
            </section>

            {/* ACCOUNT STATUS */}
            <section className="settings-card account-status-card mt-4">
              <div className="settings-card-heading">
                <div className="settings-section-icon blue">
                  <i className="bi bi-person-check"></i>
                </div>

                <div>
                  <h2>Account Status</h2>
                  <p>Your current account information.</p>
                </div>
              </div>

              <div className="account-status-list">
                <div>
                  <span>Account Type</span>
                  <strong>Customer</strong>
                </div>

                <div>
                  <span>Email Status</span>
                  <strong className="status-verified">
                    <i className="bi bi-check-circle-fill"></i>
                    Verified
                  </strong>
                </div>

                <div>
                  <span>Security</span>
                  <strong className="status-verified">
                    <i className="bi bi-shield-check"></i>
                    Protected
                  </strong>
                </div>
              </div>
            </section>

            {/* ACCOUNT ACTIONS */}
            <section className="settings-card danger-card mt-4">
              <div className="settings-card-heading">
                <div className="settings-section-icon red">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>

                <div>
                  <h2>Account Actions</h2>
                  <p>Actions that affect your account.</p>
                </div>
              </div>

              <button
                type="button"
                className="danger-action"
                onClick={() => setLogoutModal(true)}
              >
                <div>
                  <strong>Sign Out</strong>
                  <span>
                    Sign out from your current account.
                  </span>
                </div>

                <i className="bi bi-box-arrow-right"></i>
              </button>

              <button
                type="button"
                className="danger-action delete"
                onClick={() => setDeleteModal(true)}
              >
                <div>
                  <strong>Request Account Deletion</strong>
                  <span>
                    Submit a request to remove your account.
                  </span>
                </div>

                <i className="bi bi-trash3"></i>
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {passwordModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => setPasswordModal(false)}
        >
          <div
            className="settings-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-modal-header">
              <div className="settings-modal-icon">
                <i className="bi bi-shield-lock"></i>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setPasswordModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="settings-modal-title">
              <h3>Change Password</h3>
              <p>
                Update your password to keep your Nexus account
                secure.
              </p>
            </div>

            {passwordError && (
              <div className="settings-password-error">
                <i className="bi bi-exclamation-circle"></i>
                {passwordError}
              </div>
            )}

            <div className="settings-password-fields">

              <div className="settings-field">
                <label htmlFor="settingsCurrentPassword">
                  Current Password
                </label>

                <div className="settings-input">
                  <i className="bi bi-lock"></i>

                  <input
                    id="settingsCurrentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="settings-field">
                <label htmlFor="settingsNewPassword">
                  New Password
                </label>

                <div className="settings-input">
                  <i className="bi bi-key"></i>

                  <input
                    id="settingsNewPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="settings-field">
                <label htmlFor="settingsConfirmPassword">
                  Confirm New Password
                </label>

                <div className="settings-input">
                  <i className="bi bi-check2-circle"></i>

                  <input
                    id="settingsConfirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

            </div>

            <div className="settings-modal-actions">
              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() => setPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="settings-primary-btn"
                onClick={handlePasswordChange}
              >
                <i className="bi bi-shield-check"></i>
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {logoutModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => setLogoutModal(false)}
        >
          <div
            className="settings-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon logout">
              <i className="bi bi-box-arrow-right"></i>
            </div>

            <h3>Sign out of your account?</h3>

            <p>
              You will need to sign in again to access your
              account.
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() => setLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-danger-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="settings-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon delete">
              <i className="bi bi-trash3"></i>
            </div>

            <h3>Request account deletion?</h3>

            <p>
              This will submit an account deletion request. Your
              account will not be deleted immediately.
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-danger-btn"
                onClick={() => {
                  setDeleteModal(false);
                  showSavedMessage(
                    "Your account deletion request has been recorded."
                  );
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* Reusable setting row */

interface SettingToggleProps {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function SettingToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="settings-option">
      <div className="settings-option-info">
        <div className="settings-option-icon">
          <i className={`bi ${icon}`}></i>
        </div>

        <div>
          <strong>{title}</strong>
          <span>{description}</span>
        </div>
      </div>

      <button
        type="button"
        className={`settings-toggle ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        aria-pressed={checked}
      >
        <span></span>
      </button>
    </div>
  );
}