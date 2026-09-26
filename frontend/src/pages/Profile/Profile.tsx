import { useState } from "react";
import { Link } from "react-router-dom";

import "./Profile.css";

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const defaultProfile: CustomerProfile = {
  name: "Ashutosh Sahu",
  email: "ashutosh@email.com",
  phone: "+91 98765 43210",
  address: "Nexus Business Park",
  city: "New Delhi",
  state: "Delhi",
  pincode: "110001",
  country: "India",
};

export default function Profile() {
  const [profile, setProfile] =
    useState<CustomerProfile>(defaultProfile);

  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [passwordModal, setPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const initials = profile.name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    setEditProfile(false);
    showSavedMessage("Profile information updated successfully.");
  };

  const handleSaveAddress = () => {
    setEditAddress(false);
    showSavedMessage("Delivery address updated successfully.");
  };

  const showSavedMessage = (message: string) => {
    setSavedMessage(message);

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3500);
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

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* =========================
            PAGE HEADER
        ========================== */}

        <div className="profile-page-header">

          <div className="profile-heading-content">
            <span className="profile-eyebrow">
              MY ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information, delivery address
              and account security.
            </p>
          </div>

        </div>

        {/* =========================
            SUCCESS MESSAGE
        ========================== */}

        {savedMessage && (
          <div className="profile-success-message">

            <div className="profile-success-icon">
              <i className="bi bi-check-lg"></i>
            </div>

            <div>
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

        {/* =========================
            ACCOUNT HEADER
        ========================== */}

        <section className="profile-account-card">

          <div className="profile-account-main">

            <div className="profile-avatar-large">
              {initials}
            </div>

            <div className="profile-account-info">

              <div className="profile-name-row">

                <h2>{profile.name}</h2>

                <span className="profile-active-badge">
                  <span></span>
                  Active Customer
                </span>

              </div>

              <p>{profile.email}</p>

              <div className="profile-account-meta">

                <span>
                  <i className="bi bi-person-check"></i>
                  Customer Account
                </span>

                <span>
                  <i className="bi bi-shield-check"></i>
                  Account Protected
                </span>

              </div>

            </div>

          </div>

          <div className="profile-account-actions">

            <button
              type="button"
              className="profile-primary-btn"
              onClick={() => setEditProfile(true)}
            >
              <i className="bi bi-pencil"></i>
              Edit Profile
            </button>

          </div>

        </section>

        {/* =========================
            ACCOUNT SUMMARY
        ========================== */}

        <section className="profile-summary-grid">

          <Link
            to="/orders"
            className="profile-summary-card"
          >
            <div className="summary-icon blue">
              <i className="bi bi-box-seam"></i>
            </div>

            <div className="summary-content">
              <span>MY ORDERS</span>
              <strong>View Orders</strong>
              <small>Track your purchases</small>
            </div>

            <i className="bi bi-chevron-right summary-arrow"></i>
          </Link>

          <Link
            to="/wishlist"
            className="profile-summary-card"
          >
            <div className="summary-icon pink">
              <i className="bi bi-heart"></i>
            </div>

            <div className="summary-content">
              <span>WISHLIST</span>
              <strong>Saved Products</strong>
              <small>View your saved items</small>
            </div>

            <i className="bi bi-chevron-right summary-arrow"></i>
          </Link>

          <Link
            to="/support/tickets"
            className="profile-summary-card"
          >
            <div className="summary-icon purple">
              <i className="bi bi-headset"></i>
            </div>

            <div className="summary-content">
              <span>SUPPORT</span>
              <strong>Support Tickets</strong>
              <small>Get help with your orders</small>
            </div>

            <i className="bi bi-chevron-right summary-arrow"></i>
          </Link>

        </section>

        {/* =========================
            MAIN CONTENT
        ========================== */}

        <div className="profile-content-grid">

          {/* =========================
              PERSONAL INFORMATION
          ========================== */}

          <section className="profile-section-card">

            <div className="profile-section-header">

              <div className="profile-section-title">

                <div className="profile-section-icon">
                  <i className="bi bi-person"></i>
                </div>

                <div>
                  <h3>Personal Information</h3>
                  <p>
                    Your basic customer account information
                  </p>
                </div>

              </div>

              {!editProfile && (
                <button
                  type="button"
                  className="section-edit-btn"
                  onClick={() => setEditProfile(true)}
                >
                  <i className="bi bi-pencil"></i>
                  Edit
                </button>
              )}

            </div>

            <div className="profile-fields">

              <div className="profile-field">

                <label htmlFor="customerName">
                  Full Name
                </label>

                <div className="profile-input">

                  <i className="bi bi-person"></i>

                  <input
                    id="customerName"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleProfileChange}
                    disabled={!editProfile}
                  />

                </div>

              </div>

              <div className="profile-field">

                <label htmlFor="customerEmail">
                  Email Address
                </label>

                <div className="profile-input">

                  <i className="bi bi-envelope"></i>

                  <input
                    id="customerEmail"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!editProfile}
                  />

                </div>

                <small className="verified-field">
                  <i className="bi bi-patch-check-fill"></i>
                  Verified email address
                </small>

              </div>

              <div className="profile-field">

                <label htmlFor="customerPhone">
                  Mobile Number
                </label>

                <div className="profile-input">

                  <i className="bi bi-telephone"></i>

                  <input
                    id="customerPhone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={!editProfile}
                  />

                </div>

              </div>

            </div>

            {editProfile && (
              <div className="profile-section-actions">

                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={() => {
                    setProfile(defaultProfile);
                    setEditProfile(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-primary-btn"
                  onClick={handleSaveProfile}
                >
                  <i className="bi bi-check2"></i>
                  Save Changes
                </button>

              </div>
            )}

          </section>

          {/* =========================
              ACCOUNT SECURITY
          ========================== */}

          <section className="profile-section-card">

            <div className="profile-section-header">

              <div className="profile-section-title">

                <div className="profile-section-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>

                <div>
                  <h3>Account Security</h3>
                  <p>
                    Manage your account security preferences
                  </p>
                </div>

              </div>

            </div>

            <div className="security-list">

              <div className="security-item">

                <div className="security-item-left">

                  <div className="security-item-icon">
                    <i className="bi bi-key"></i>
                  </div>

                  <div>
                    <strong>Password</strong>
                    <span>
                      Your password is securely protected
                    </span>
                  </div>

                </div>

                <button
                  type="button"
                  className="security-action-btn"
                  onClick={() => setPasswordModal(true)}
                >
                  Change Password
                  <i className="bi bi-chevron-right"></i>
                </button>

              </div>

              <div className="security-item">

                <div className="security-item-left">

                  <div className="security-item-icon secure">
                    <i className="bi bi-shield-check"></i>
                  </div>

                  <div>
                    <strong>Account Protection</strong>
                    <span>
                      Your account security is active
                    </span>
                  </div>

                </div>

                <span className="security-status">
                  Protected
                </span>

              </div>

            </div>

          </section>

          {/* =========================
              DELIVERY ADDRESS
          ========================== */}

          <section className="profile-section-card profile-address-card">

            <div className="profile-section-header">

              <div className="profile-section-title">

                <div className="profile-section-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <h3>Default Delivery Address</h3>
                  <p>
                    Your primary address for order delivery
                  </p>
                </div>

              </div>

              {!editAddress && (
                <button
                  type="button"
                  className="section-edit-btn"
                  onClick={() => setEditAddress(true)}
                >
                  <i className="bi bi-pencil"></i>
                  Edit
                </button>
              )}

            </div>

            {!editAddress ? (
              <div className="address-display">

                <div className="address-label">
                  <i className="bi bi-house"></i>
                  <span>Primary Address</span>
                </div>

                <div className="address-text">
                  <strong>{profile.address}</strong>

                  <span>
                    {profile.city}, {profile.state}{" "}
                    - {profile.pincode}
                  </span>

                  <span>{profile.country}</span>
                </div>

              </div>
            ) : (
              <div className="profile-fields address-edit-fields">

                <div className="profile-field address-full">

                  <label htmlFor="customerAddress">
                    Address
                  </label>

                  <div className="profile-input">
                    <i className="bi bi-house"></i>

                    <input
                      id="customerAddress"
                      name="address"
                      type="text"
                      value={profile.address}
                      onChange={handleProfileChange}
                    />
                  </div>

                </div>

                <div className="profile-field">

                  <label htmlFor="customerCity">
                    City
                  </label>

                  <div className="profile-input">
                    <i className="bi bi-buildings"></i>

                    <input
                      id="customerCity"
                      name="city"
                      type="text"
                      value={profile.city}
                      onChange={handleProfileChange}
                    />
                  </div>

                </div>

                <div className="profile-field">

                  <label htmlFor="customerState">
                    State
                  </label>

                  <div className="profile-input">
                    <i className="bi bi-map"></i>

                    <input
                      id="customerState"
                      name="state"
                      type="text"
                      value={profile.state}
                      onChange={handleProfileChange}
                    />
                  </div>

                </div>

                <div className="profile-field">

                  <label htmlFor="customerPincode">
                    PIN Code
                  </label>

                  <div className="profile-input">
                    <i className="bi bi-mailbox"></i>

                    <input
                      id="customerPincode"
                      name="pincode"
                      type="text"
                      value={profile.pincode}
                      onChange={handleProfileChange}
                    />
                  </div>

                </div>

                <div className="profile-field">

                  <label htmlFor="customerCountry">
                    Country
                  </label>

                  <div className="profile-input">
                    <i className="bi bi-globe2"></i>

                    <input
                      id="customerCountry"
                      name="country"
                      type="text"
                      value={profile.country}
                      onChange={handleProfileChange}
                    />
                  </div>

                </div>

              </div>
            )}

            {editAddress && (
              <div className="profile-section-actions">

                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={() => {
                    setProfile(defaultProfile);
                    setEditAddress(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-primary-btn"
                  onClick={handleSaveAddress}
                >
                  <i className="bi bi-check2"></i>
                  Save Address
                </button>

              </div>
            )}

          </section>

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <section className="profile-quick-actions">

          <div className="profile-quick-header">

            <div>
              <span className="profile-eyebrow">
                QUICK ACCESS
              </span>

              <h3>Manage Your Account</h3>
            </div>

          </div>

          <div className="quick-actions-grid">

            <Link
              to="/orders"
              className="quick-action"
            >
              <i className="bi bi-box-seam"></i>

              <div>
                <strong>My Orders</strong>
                <span>View and track your orders</span>
              </div>

              <i className="bi bi-arrow-up-right"></i>
            </Link>

            <Link
              to="/wishlist"
              className="quick-action"
            >
              <i className="bi bi-heart"></i>

              <div>
                <strong>Wishlist</strong>
                <span>Manage your saved products</span>
              </div>

              <i className="bi bi-arrow-up-right"></i>
            </Link>

            <Link
              to="/support/tickets"
              className="quick-action"
            >
              <i className="bi bi-headset"></i>

              <div>
                <strong>Support Center</strong>
                <span>View your support requests</span>
              </div>

              <i className="bi bi-arrow-up-right"></i>
            </Link>

            <Link
              to="/settings"
              className="quick-action"
            >
              <i className="bi bi-gear"></i>

              <div>
                <strong>Account Settings</strong>
                <span>Manage account preferences</span>
              </div>

              <i className="bi bi-arrow-up-right"></i>
            </Link>

          </div>

        </section>

      </div>

      {/* =========================
          CHANGE PASSWORD MODAL
      ========================== */}

      {passwordModal && (
        <div
          className="profile-modal-overlay"
          onClick={() => setPasswordModal(false)}
        >

          <div
            className="profile-password-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="password-modal-header">

              <div className="password-modal-icon">
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

            <div className="password-modal-title">

              <h3>Change Password</h3>

              <p>
                Update your account password to keep your
                Nexus account secure.
              </p>

            </div>

            {passwordError && (
              <div className="password-error">
                <i className="bi bi-exclamation-circle"></i>
                {passwordError}
              </div>
            )}

            <div className="password-fields">

              <div className="profile-field">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <div className="profile-input">

                  <i className="bi bi-lock"></i>

                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                  />

                </div>

              </div>

              <div className="profile-field">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <div className="profile-input">

                  <i className="bi bi-key"></i>

                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                  />

                </div>

              </div>

              <div className="profile-field">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div className="profile-input">

                  <i className="bi bi-check2-circle"></i>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                  />

                </div>

              </div>

            </div>

            <div className="password-modal-actions">

              <button
                type="button"
                className="profile-secondary-btn"
                onClick={() => setPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-primary-btn"
                onClick={handlePasswordChange}
              >
                <i className="bi bi-shield-check"></i>
                Update Password
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}