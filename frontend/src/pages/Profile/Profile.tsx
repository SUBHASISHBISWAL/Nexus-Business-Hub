import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const PROFILE_PHOTO_KEY = "customerProfilePhoto";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Ashutosh Sahu",
    email: "ashutosh@email.com",
    mobile: "+91 98765 43210",
  });

  const [editedPersonalInfo, setEditedPersonalInfo] =
    useState(personalInfo);

  const [address, setAddress] = useState({
    addressLine: "123, Nexus Residency",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751001",
    country: "India",
  });

  const [editedAddress, setEditedAddress] = useState(address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* ================================
     LOAD SAVED PROFILE PHOTO
  ================================= */

  useEffect(() => {
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);

    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  /* ================================
     SUCCESS MESSAGE AUTO HIDE
  ================================= */

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  /* ================================
     INITIALS
  ================================= */

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* ================================
     PHOTO UPLOAD
  ================================= */

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSuccessMessage(
        "Please upload a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSuccessMessage(
        "Image size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result as string;

      localStorage.setItem(
        PROFILE_PHOTO_KEY,
        imageData
      );

      setProfilePhoto(imageData);

      /*
        After uploading/changing photo,
        close edit mode.
      */
      setIsEditingProfile(false);

      setSuccessMessage(
        "Profile photo updated successfully."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /* ================================
     REMOVE PHOTO
  ================================= */

  const handleRemovePhoto = () => {
    localStorage.removeItem(PROFILE_PHOTO_KEY);

    setProfilePhoto(null);
    setIsEditingProfile(false);

    setSuccessMessage(
      "Profile photo removed successfully."
    );
  };

  /* ================================
     EDIT PROFILE
  ================================= */

  const handleEditProfile = () => {
    setEditedPersonalInfo(personalInfo);
    setIsEditingProfile(true);
  };

  /* ================================
     CANCEL PROFILE EDIT
  ================================= */

  const handleCancelProfile = () => {
    setEditedPersonalInfo(personalInfo);
    setIsEditingProfile(false);
  };

  /* ================================
     SAVE PROFILE
  ================================= */

  const handleSaveProfile = () => {
    setPersonalInfo(editedPersonalInfo);
    setIsEditingProfile(false);

    setSuccessMessage(
      "Profile information updated successfully."
    );
  };

  /* ================================
     SAVE ADDRESS
  ================================= */

  const handleSaveAddress = () => {
    setAddress(editedAddress);
    setIsEditingAddress(false);

    setSuccessMessage(
      "Delivery address updated successfully."
    );
  };

  /* ================================
     CANCEL ADDRESS
  ================================= */

  const handleCancelAddress = () => {
    setEditedAddress(address);
    setIsEditingAddress(false);
  };

  /* ================================
     PASSWORD CHANGE
  ================================= */

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    setPasswordSuccess(
      "Password changed successfully."
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="profile-page">
      <div className="container-fluid profile-container">

        {/* ================================
            PAGE HEADER
        ================================= */}

        <div className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              MY ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information, delivery
              address and account security.
            </p>
          </div>
        </div>

        {/* ================================
            SUCCESS MESSAGE
        ================================= */}

        {successMessage && (
          <div
            className="alert alert-success profile-success-alert"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMessage}
          </div>
        )}

        {/* ================================
            ACCOUNT HEADER
        ================================= */}

        <div className="card profile-account-card border-0">
          <div className="card-body">

            <div className="profile-account-left">

              {/* PROFILE PHOTO */}

              <div className="profile-avatar-wrapper">

                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="profile-avatar profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar">
                    {getInitials(
                      personalInfo.fullName
                    )}
                  </div>
                )}

                {/* 
                  Pencil is shown ONLY when
                  there is no profile photo.
                  
                  It overlaps the TOP-RIGHT
                  corner of the avatar.
                */}

                {!profilePhoto && (
                  <button
                    type="button"
                    className="profile-avatar-edit"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    aria-label="Upload profile photo"
                    title="Upload profile photo"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                )}

                {/* Hidden upload input */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="d-none"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* ACCOUNT INFORMATION */}

              <div className="profile-account-info">

                <div className="profile-name-row">

                  <h2>
                    {personalInfo.fullName}
                  </h2>

                  <span className="profile-status-badge">
                    <span className="profile-status-dot"></span>
                    Active Customer
                  </span>

                </div>

                <p className="profile-email">
                  {personalInfo.email}
                </p>

                <div className="profile-account-meta">

                  <span>
                    <i className="bi bi-person-badge me-1"></i>
                    Customer Account
                  </span>

                  <span>
                    <i className="bi bi-shield-check me-1"></i>
                    Account Protected
                  </span>

                </div>

              </div>
            </div>

            {/* ================================
                PROFILE ACTIONS
            ================================= */}

            {profilePhoto && !isEditingProfile && (
              <button
                type="button"
                className="btn btn-outline-primary profile-edit-main-btn"
                onClick={handleEditProfile}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Profile
              </button>
            )}

            {/* 
              When Edit Profile is clicked,
              ONLY these 3 actions are shown:

              Change Photo
              Remove Photo
              Cancel

              Edit Profile button disappears.
            */}

            {profilePhoto && isEditingProfile && (
              <div className="profile-edit-actions">

                <button
                  type="button"
                  className="btn btn-outline-primary profile-photo-change-btn"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <i className="bi bi-camera me-2"></i>
                  Change Photo
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger profile-photo-remove-btn"
                  onClick={handleRemovePhoto}
                >
                  <i className="bi bi-trash3 me-2"></i>
                  Remove Photo
                </button>

                <button
                  type="button"
                  className="btn btn-light profile-photo-cancel-btn"
                  onClick={handleCancelProfile}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cancel
                </button>

              </div>
            )}

          </div>
        </div>

        {/* ================================
            SUMMARY CARDS
        ================================= */}

        <div className="row g-3 profile-summary-row">

          <div className="col-lg-4 col-md-6">
            <Link
              to="/orders"
              className="profile-summary-card text-decoration-none"
            >
              <div className="profile-summary-icon">
                <i className="bi bi-box-seam"></i>
              </div>

              <div>
                <span>My Orders</span>
                <strong>View your orders</strong>
              </div>

              <i className="bi bi-arrow-right profile-summary-arrow"></i>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link
              to="/wishlist"
              className="profile-summary-card text-decoration-none"
            >
              <div className="profile-summary-icon">
                <i className="bi bi-heart"></i>
              </div>

              <div>
                <span>Wishlist</span>
                <strong>Saved products</strong>
              </div>

              <i className="bi bi-arrow-right profile-summary-arrow"></i>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link
              to="/support/tickets"
              className="profile-summary-card text-decoration-none"
            >
              <div className="profile-summary-icon">
                <i className="bi bi-headset"></i>
              </div>

              <div>
                <span>Support</span>
                <strong>Manage support requests</strong>
              </div>

              <i className="bi bi-arrow-right profile-summary-arrow"></i>
            </Link>
          </div>

        </div>

        {/* ================================
            PERSONAL INFORMATION
        ================================= */}

        <div className="card profile-section-card border-0">
          <div className="card-body">

            <div className="profile-section-header">

              <div>
                <span className="profile-section-eyebrow">
                  PERSONAL DETAILS
                </span>

                <h3>Personal Information</h3>

                <p>
                  Keep your account information up to date.
                </p>
              </div>

              {!isEditingProfile && (
                <button
                  type="button"
                  className="btn btn-light profile-section-edit-btn"
                  onClick={handleEditProfile}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit
                </button>
              )}

            </div>

            <div className="row g-3">

              <div className="col-lg-4 col-md-6">

                <label className="profile-field-label">
                  Full Name
                </label>

                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedPersonalInfo.fullName}
                    onChange={(e) =>
                      setEditedPersonalInfo({
                        ...editedPersonalInfo,
                        fullName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="profile-field-value">
                    {personalInfo.fullName}
                  </div>
                )}

              </div>

              <div className="col-lg-4 col-md-6">

                <label className="profile-field-label">
                  Email Address
                </label>

                <div className="profile-email-field">

                  <div className="profile-field-value">
                    {personalInfo.email}
                  </div>

                  <span className="profile-verified-badge">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    Verified
                  </span>

                </div>

              </div>

              <div className="col-lg-4 col-md-6">

                <label className="profile-field-label">
                  Mobile Number
                </label>

                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedPersonalInfo.mobile}
                    onChange={(e) =>
                      setEditedPersonalInfo({
                        ...editedPersonalInfo,
                        mobile: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="profile-field-value">
                    {personalInfo.mobile}
                  </div>
                )}

              </div>

            </div>

            {isEditingProfile && (
              <div className="profile-form-actions">

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProfile}
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCancelProfile}
                >
                  Cancel
                </button>

              </div>
            )}

          </div>
        </div>

        {/* ================================
            ACCOUNT SECURITY
        ================================= */}

        <div className="card profile-section-card border-0">
          <div className="card-body">

            <div className="profile-section-header">

              <div>
                <span className="profile-section-eyebrow">
                  SECURITY
                </span>

                <h3>Account Security</h3>

                <p>
                  Manage your password and account protection.
                </p>
              </div>

            </div>

            <div className="profile-security-row">

              <div className="profile-security-info">

                <div className="profile-security-icon">
                  <i className="bi bi-shield-check"></i>
                </div>

                <div>
                  <strong>
                    Account Protection
                  </strong>

                  <span>
                    Your account is protected
                  </span>
                </div>

              </div>

              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target="#changePasswordModal"
              >
                <i className="bi bi-key me-2"></i>
                Change Password
              </button>

            </div>

          </div>
        </div>

        {/* ================================
            DELIVERY ADDRESS
        ================================= */}

        <div className="card profile-section-card border-0">
          <div className="card-body">

            <div className="profile-section-header">

              <div>
                <span className="profile-section-eyebrow">
                  DELIVERY
                </span>

                <h3>
                  Default Delivery Address
                </h3>

                <p>
                  This address will be used for your default deliveries.
                </p>
              </div>

              {!isEditingAddress && (
                <button
                  type="button"
                  className="btn btn-light profile-section-edit-btn"
                  onClick={() => {
                    setEditedAddress(address);
                    setIsEditingAddress(true);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit
                </button>
              )}

            </div>

            {isEditingAddress ? (
              <div className="row g-3">

                <div className="col-12">

                  <label className="profile-field-label">
                    Address
                  </label>

                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedAddress.addressLine}
                    onChange={(e) =>
                      setEditedAddress({
                        ...editedAddress,
                        addressLine: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="col-md-4">

                  <label className="profile-field-label">
                    City
                  </label>

                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedAddress.city}
                    onChange={(e) =>
                      setEditedAddress({
                        ...editedAddress,
                        city: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="col-md-4">

                  <label className="profile-field-label">
                    State
                  </label>

                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedAddress.state}
                    onChange={(e) =>
                      setEditedAddress({
                        ...editedAddress,
                        state: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="col-md-4">

                  <label className="profile-field-label">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedAddress.pincode}
                    onChange={(e) =>
                      setEditedAddress({
                        ...editedAddress,
                        pincode: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="col-md-4">

                  <label className="profile-field-label">
                    Country
                  </label>

                  <input
                    type="text"
                    className="form-control profile-form-control"
                    value={editedAddress.country}
                    onChange={(e) =>
                      setEditedAddress({
                        ...editedAddress,
                        country: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="col-12">

                  <div className="profile-form-actions">

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveAddress}
                    >
                      <i className="bi bi-check-lg me-2"></i>
                      Save Address
                    </button>

                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleCancelAddress}
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </div>
            ) : (
              <div className="profile-address-box">

                <div className="profile-address-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div className="profile-address-content">

                  <strong>
                    {address.addressLine}
                  </strong>

                  <span>
                    {address.city}, {address.state}{" "}
                    {address.pincode}
                  </span>

                  <span>
                    {address.country}
                  </span>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* ================================
            QUICK ACCESS
        ================================= */}

        <div className="card profile-section-card border-0">
          <div className="card-body">

            <div className="profile-section-header">

              <div>
                <span className="profile-section-eyebrow">
                  QUICK ACCESS
                </span>

                <h3>
                  Account Shortcuts
                </h3>

                <p>
                  Quickly access your most-used account sections.
                </p>
              </div>

            </div>

            <div className="row g-3">

              <div className="col-lg-3 col-md-6">
                <Link
                  to="/orders"
                  className="profile-quick-link"
                >
                  <i className="bi bi-box-seam"></i>
                  <span>My Orders</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link
                  to="/wishlist"
                  className="profile-quick-link"
                >
                  <i className="bi bi-heart"></i>
                  <span>Wishlist</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link
                  to="/support/tickets"
                  className="profile-quick-link"
                >
                  <i className="bi bi-headset"></i>
                  <span>Support Center</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link
                  to="/settings"
                  className="profile-quick-link"
                >
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* ================================
          CHANGE PASSWORD MODAL
      ================================= */}

      <div
        className="modal fade"
        id="changePasswordModal"
        tabIndex={-1}
        aria-labelledby="changePasswordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">

          <div className="modal-content profile-password-modal">

            <div className="modal-header">

              <div>

                <span className="profile-section-eyebrow">
                  SECURITY
                </span>

                <h5
                  className="modal-title"
                  id="changePasswordModalLabel"
                >
                  Change Password
                </h5>

              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>

            </div>

            <div className="modal-body">

              {passwordError && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  {passwordSuccess}
                </div>
              )}

              <div className="mb-3">

                <label className="profile-field-label">
                  Current Password
                </label>

                <input
                  type="password"
                  className="form-control profile-form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />

              </div>

              <div className="mb-3">

                <label className="profile-field-label">
                  New Password
                </label>

                <input
                  type="password"
                  className="form-control profile-form-control"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />

              </div>

              <div className="mb-3">

                <label className="profile-field-label">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  className="form-control profile-form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePasswordChange}
              >
                <i className="bi bi-shield-check me-2"></i>
                Update Password
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;