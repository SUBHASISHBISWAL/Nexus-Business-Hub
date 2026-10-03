import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  registerUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../../services/authService";

import "./login.css";

// =========================================================
// LOCAL DEMO ADMIN CREDENTIALS
// =========================================================

const ADMIN_EMAIL = "admin@nexus.com";
const ADMIN_PASSWORD = "Admin@123";

type ForgotStep = 1 | 2 | 3;

const Login: React.FC = () => {
  const navigate = useNavigate();

  // =========================================================
  // LOGIN / REGISTER MODE
  // =========================================================

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [showLoginPassword, setShowLoginPassword] =
    useState(false);

  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // =========================================================
  // REGISTER STATE
  // =========================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registerPassword, setRegisterPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // =========================================================
  // LOADING / MESSAGE STATE
  // =========================================================

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] =
    useState(false);

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginFieldError, setLoginFieldError] =
    useState("");

  // =========================================================
  // FORGOT PASSWORD STATE
  // =========================================================

  const [showForgot, setShowForgot] = useState(false);

  const [forgotStep, setForgotStep] =
    useState<ForgotStep>(1);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState(false);

  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] =
    useState("");

  const [forgotLoading, setForgotLoading] =
    useState(false);

  // =========================================================
  // EMAIL VALIDATION
  // =========================================================

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // =========================================================
  // CLEAR MESSAGES
  // =========================================================

  const clearMessages = () => {
    setLoginError("");
    setRegisterError("");
    setLoginFieldError("");
    setSuccessMessage("");
  };

  // =========================================================
  // LOGIN
  //
  // FLOW:
  // 1. Check local demo admin credentials FIRST.
  // 2. Correct admin -> OTP page.
  // 3. Everything else -> backend customer login.
  // 4. Customer -> home page directly.
  // =========================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    clearMessages();

    const email =
      loginEmail.trim().toLowerCase();

    const password =
      loginPassword;

    // ---------------------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------------------

    if (!email || !password) {
      setLoginError(
        "Please enter your email and password."
      );
      return;
    }

    if (!emailRegex.test(email)) {
      setLoginError(
        "Please enter a valid email address."
      );
      return;
    }

    // ---------------------------------------------------------
    // ADMIN LOGIN
    // ---------------------------------------------------------

    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      setLoginLoading(true);

      localStorage.removeItem("authToken");
      localStorage.removeItem("isAdmin");

      localStorage.setItem(
        "nexus_admin_pending_otp",
        "true"
      );

      localStorage.setItem(
        "userRole",
        "Admin"
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: "local-admin-001",
          firstName: "Admin",
          lastName: "User",
          email: ADMIN_EMAIL,
          phoneNumber: "",
          role: "Admin",
        })
      );

      setTimeout(() => {
        setLoginLoading(false);
        navigate("/admin/verify-otp");
      }, 300);

      return;
    }

    // ---------------------------------------------------------
    // CUSTOMER LOGIN
    // ---------------------------------------------------------

    setLoginLoading(true);

    try {
      const response = await loginUser({
        email,
        identifier: email,
        password,
      });

      // -------------------------------------------------------
      // STRICT ADMIN PROTECTION
      // -------------------------------------------------------

      if (
        response.role?.toLowerCase() === "admin" ||
        response.requiresOtp === true
      ) {
        setLoginLoading(false);

        setLoginError(
          "Invalid email or password."
        );

        return;
      }

      // -------------------------------------------------------
      // CUSTOMER LOGIN SUCCESS
      // -------------------------------------------------------

      localStorage.setItem(
        "authToken",
        response.token
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "userRole",
        response.role
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phoneNumber:
            response.phoneNumber || "",
          role: response.role,
        })
      );

      localStorage.removeItem("isAdmin");

      localStorage.removeItem(
        "nexus_admin_pending_otp"
      );

      window.dispatchEvent(
        new Event("userUpdated")
      );

      setLoginLoading(false);

      navigate("/");
    } catch (error: any) {
      setLoginLoading(false);

      const message =
        error?.response?.data?.message ||
        "Invalid email or password.";

      setLoginError(message);
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    clearMessages();

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanEmail =
      registerEmail.trim().toLowerCase();

    const cleanPhone =
      phoneNumber.trim();

    // ---------------------------------------------------------
    // REQUIRED FIELD VALIDATION
    // ---------------------------------------------------------

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !cleanPhone ||
      !registerPassword ||
      !confirmPassword
    ) {
      setRegisterError(
        "Please fill in all required fields."
      );
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setRegisterError(
        "Please enter a valid email address."
      );
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      registerPassword !==
      confirmPassword
    ) {
      setRegisterError(
        "Passwords do not match."
      );
      return;
    }

    setRegisterLoading(true);

    try {
      await registerUser({
        fullName:
          `${cleanFirstName} ${cleanLastName}`,

        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        email:
          cleanEmail,

        phoneNumber:
          cleanPhone,

        password:
          registerPassword,
      });

      setRegisterLoading(false);

      setSuccessMessage(
        "Account created successfully. Please login."
      );

      // Clear registration fields.
      setFirstName("");
      setLastName("");
      setRegisterEmail("");
      setPhoneNumber("");
      setRegisterPassword("");
      setConfirmPassword("");

      // Return to login mode.
      setIsRegisterMode(false);
    } catch (error: any) {
      setRegisterLoading(false);

      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      setRegisterError(message);
    }
  };

  // =========================================================
  // OPEN FORGOT PASSWORD
  // =========================================================

  const openForgotPassword = () => {
    setShowForgot(true);

    setForgotStep(1);

    setForgotEmail("");

    setForgotOtp("");

    setResetToken("");

    setNewPassword("");

    setConfirmNewPassword("");

    setShowNewPassword(false);

    setShowConfirmNewPassword(false);

    setForgotError("");

    setForgotSuccess("");
  };

  // =========================================================
  // CLOSE FORGOT PASSWORD
  // =========================================================

  const closeForgotPassword = () => {
    if (forgotLoading) return;

    setShowForgot(false);

    setForgotStep(1);

    setForgotEmail("");

    setForgotOtp("");

    setResetToken("");

    setNewPassword("");

    setConfirmNewPassword("");

    setShowNewPassword(false);

    setShowConfirmNewPassword(false);

    setForgotError("");

    setForgotSuccess("");
  };

  // =========================================================
  // FORGOT PASSWORD - STEP 1
  // =========================================================

  const handleForgotEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setForgotError("");
    setForgotSuccess("");

    const identifier =
      forgotEmail.trim();

    if (!identifier) {
      setForgotError(
        "Please enter your email address or phone number."
      );
      return;
    }

    // ---------------------------------------------------------
    // EMAIL VALIDATION
    // ---------------------------------------------------------

    if (identifier.includes("@")) {
      if (
        !emailRegex.test(
          identifier.toLowerCase()
        )
      ) {
        setForgotError(
          "Please enter a valid email address."
        );
        return;
      }
    }
    // ---------------------------------------------------------
    // PHONE VALIDATION
    // ---------------------------------------------------------
    else {
      const digitsOnly =
        identifier.replace(/\D/g, "");

      if (
        digitsOnly.length < 10 ||
        digitsOnly.length > 12
      ) {
        setForgotError(
          "Please enter a valid phone number."
        );
        return;
      }
    }

    setForgotLoading(true);

    try {
      const response =
        await forgotPassword(identifier);

      setForgotLoading(false);

      setForgotSuccess(
        response.message ||
          "We've sent a 6-digit verification code to your registered email."
      );

      setForgotStep(2);
    } catch (error: any) {
      setForgotLoading(false);

      const message =
        error?.response?.data?.message ||
        "Unable to send the verification code. Please try again.";

      setForgotError(message);
    }
  };

  // =========================================================
  // FORGOT PASSWORD - STEP 2
  // =========================================================

  const handleVerifyForgotOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setForgotError("");
    setForgotSuccess("");

    const otp =
      forgotOtp.trim();

    if (!otp) {
      setForgotError(
        "Please enter the verification code."
      );
      return;
    }

    if (
      otp.length !== 6 ||
      !/^\d{6}$/.test(otp)
    ) {
      setForgotError(
        "Please enter a valid 6-digit verification code."
      );
      return;
    }

    setForgotLoading(true);

    try {
      const response =
        await verifyResetOtp(
          forgotEmail.trim(),
          otp
        );

      setResetToken(
        response.resetToken
      );

      setForgotLoading(false);

      setForgotSuccess(
        response.message ||
          "Verification code verified successfully."
      );

      setForgotStep(3);
    } catch (error: any) {
      setForgotLoading(false);

      setForgotError(
        error?.response?.data?.message ||
          "Invalid or expired verification code."
      );
    }
  };

  // =========================================================
  // FORGOT PASSWORD - STEP 3
  // RESET PASSWORD
  // =========================================================

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setForgotError("");
    setForgotSuccess("");

    // ---------------------------------------------------------
    // NEW PASSWORD REQUIRED
    // ---------------------------------------------------------

    if (!newPassword) {
      setForgotError(
        "Please enter a new password."
      );
      return;
    }

    // ---------------------------------------------------------
    // CONFIRM PASSWORD REQUIRED
    // ---------------------------------------------------------

    if (!confirmNewPassword) {
      setForgotError(
        "Please confirm your new password."
      );
      return;
    }

    // ---------------------------------------------------------
    // PASSWORD LENGTH
    // Backend requires minimum 8 characters.
    // ---------------------------------------------------------

    if (newPassword.length < 8) {
      setForgotError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    // ---------------------------------------------------------
    // UPPERCASE
    // ---------------------------------------------------------

    if (!/[A-Z]/.test(newPassword)) {
      setForgotError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    // ---------------------------------------------------------
    // LOWERCASE
    // ---------------------------------------------------------

    if (!/[a-z]/.test(newPassword)) {
      setForgotError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    // ---------------------------------------------------------
    // NUMBER
    // ---------------------------------------------------------

    if (!/[0-9]/.test(newPassword)) {
      setForgotError(
        "Password must contain at least one number."
      );
      return;
    }

    // ---------------------------------------------------------
    // CONFIRM PASSWORD MATCH
    // ---------------------------------------------------------

    if (
      newPassword !==
      confirmNewPassword
    ) {
      setForgotError(
        "Passwords do not match."
      );
      return;
    }

    // ---------------------------------------------------------
    // RESET TOKEN
    // ---------------------------------------------------------

    if (!resetToken) {
      setForgotError(
        "Reset session expired. Please request a new verification code."
      );
      return;
    }

    setForgotLoading(true);

    try {
      const response =
        await resetPassword(
          resetToken,
          newPassword
        );

      setForgotLoading(false);

      setForgotSuccess(
        response.message ||
          "Password has been reset successfully. Please login with your new password."
      );

      setTimeout(() => {
        closeForgotPassword();
      }, 1200);
    } catch (error: any) {
      setForgotLoading(false);

      setForgotError(
        error?.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className={`auth-page ${
        isRegisterMode
          ? "register-mode"
          : ""
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="auth-background">
        <div className="auth-orb orb-one"></div>
        <div className="auth-orb orb-two"></div>
        <div className="auth-orb orb-three"></div>

        <div className="auth-grid-line line-one"></div>
        <div className="auth-grid-line line-two"></div>
      </div>

      <div className="auth-card">

        {/* ===================================================
            BRAND PANEL
        =================================================== */}

        <div className="auth-brand-panel">

          <div className="brand-glow brand-glow-one"></div>
          <div className="brand-glow brand-glow-two"></div>

          <div className="brand-network">

            <span className="network-node node-one"></span>
            <span className="network-node node-two"></span>
            <span className="network-node node-three"></span>
            <span className="network-node node-four"></span>

            <span className="network-line network-line-one"></span>
            <span className="network-line network-line-two"></span>
            <span className="network-line network-line-three"></span>

          </div>

          <div className="auth-brand-content">

            <div className="auth-brand-logo">
              <i className="bi bi-buildings"></i>
            </div>

            <span className="brand-eyebrow">
              NEXUS BUSINESS HUB
            </span>

            <h1>
              {isRegisterMode
                ? "Build your business with Nexus."
                : "Business operations, connected."}
            </h1>

            <p>
              A unified business platform designed
              to simplify products, orders, shipments
              and customer support.
            </p>

            <div className="brand-features">

              <div className="brand-feature">

                <div className="brand-feature-icon">
                  <i className="bi bi-shield-check"></i>
                </div>

                <div className="brand-feature-text">

                  <strong>
                    Secure access
                  </strong>

                  <span>
                    Enterprise-ready authentication
                  </span>

                </div>

              </div>

              <div className="brand-feature">

                <div className="brand-feature-icon">
                  <i className="bi bi-diagram-3"></i>
                </div>

                <div className="brand-feature-text">

                  <strong>
                    Connected workflow
                  </strong>

                  <span>
                    Manage your business in one place
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="auth-brand-footer">
            <span></span>
            <div>
              POWERING MODERN BUSINESS
            </div>
          </div>

        </div>

        {/* ===================================================
            FORM PANEL
        =================================================== */}

        <div className="auth-form-panel">

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <div className="auth-form login-form">

            <div className="auth-heading">

              <div className="heading-icon">
                <i className="bi bi-person"></i>
              </div>

              <span className="auth-small-title">
                Welcome back
              </span>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Enter your credentials to continue to
                Nexus Business Hub.
              </p>

            </div>

            {loginError && (
              <div className="auth-alert-error">
                <i className="bi bi-exclamation-circle"></i>
                <span>
                  {loginError}
                </span>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert-success">
                <i className="bi bi-check-circle"></i>
                <span>
                  {successMessage}
                </span>
              </div>
            )}

            <form onSubmit={handleLogin}>

              <div className="auth-field">

                <label htmlFor="login-email">
                  Email address
                </label>

                <div
                  className={`auth-input ${
                    loginFieldError
                      ? "has-error"
                      : ""
                  }`}
                >

                  <span className="input-icon">
                    <i className="bi bi-envelope"></i>
                  </span>

                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) =>
                      setLoginEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                </div>

              </div>

              <div className="auth-field">

                <div className="auth-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-btn"
                    onClick={
                      openForgotPassword
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-lock"></i>
                  </span>

                  <input
                    id="login-password"
                    type={
                      showLoginPassword
                        ? "text"
                        : "password"
                    }
                    value={loginPassword}
                    onChange={(e) =>
                      setLoginPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowLoginPassword(
                        !showLoginPassword
                      )
                    }
                    aria-label={
                      showLoginPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <i
                      className={
                        showLoginPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loginLoading}
              >

                {loginLoading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}

              </button>

            </form>

            <div className="auth-security-note">
              <i className="bi bi-shield-check"></i>
              <span>
                Your information is securely protected
              </span>
            </div>

            <div className="auth-switch">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setIsRegisterMode(true);
                }}
              >
                Create account
                <i className="bi bi-arrow-up-right"></i>
              </button>

            </div>

          </div>

          {/* =================================================
              REGISTER FORM
          ================================================= */}

          <div className="auth-form register-form">

            <div className="auth-heading register-heading">

              <div className="heading-icon">
                <i className="bi bi-person-plus"></i>
              </div>

              <span className="auth-small-title">
                Get started
              </span>

              <h2>
                Create your account
              </h2>

              <p>
                Set up your Nexus Business Hub account.
              </p>

            </div>

            {registerError && (
              <div className="auth-alert-error">
                <i className="bi bi-exclamation-circle"></i>
                <span>
                  {registerError}
                </span>
              </div>
            )}

            <form onSubmit={handleRegister}>

              <div className="auth-field">

                <label htmlFor="register-first-name">
                  First name
                </label>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-person"></i>
                  </span>

                  <input
                    id="register-first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value
                      )
                    }
                    placeholder="First name"
                    autoComplete="given-name"
                  />

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="register-last-name">
                  Last name
                </label>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-person"></i>
                  </span>

                  <input
                    id="register-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value
                      )
                    }
                    placeholder="Last name"
                    autoComplete="family-name"
                  />

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-envelope"></i>
                  </span>

                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) =>
                      setRegisterEmail(
                        e.target.value
                      )
                    }
                    placeholder="Email address"
                    autoComplete="email"
                  />

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="register-phone">
                  Phone number
                </label>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-phone"></i>
                  </span>

                  <input
                    id="register-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value
                      )
                    }
                    placeholder="Phone number"
                    autoComplete="tel"
                  />

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-lock"></i>
                  </span>

                  <input
                    id="register-password"
                    type={
                      showRegisterPassword
                        ? "text"
                        : "password"
                    }
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(
                        e.target.value
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowRegisterPassword(
                        !showRegisterPassword
                      )
                    }
                    aria-label={
                      showRegisterPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <i
                      className={
                        showRegisterPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>

              </div>

              <div className="auth-field">

                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <div className="auth-input">

                  <span className="input-icon">
                    <i className="bi bi-lock-fill"></i>
                  </span>

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={registerLoading}
              >

                {registerLoading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}

              </button>

            </form>

            <div className="auth-security-note">
              <i className="bi bi-shield-check"></i>
              <span>
                Your information is securely protected
              </span>
            </div>

            <div className="auth-switch">

              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setIsRegisterMode(false);
                }}
              >
                Sign in
                <i className="bi bi-arrow-up-right"></i>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ===================================================== */}

      {showForgot && (
        <div
          className="forgot-password-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeForgotPassword();
            }
          }}
        >

          <div className="forgot-password-card">

            <button
              type="button"
              className="forgot-close-btn"
              onClick={closeForgotPassword}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="forgot-header">

              <h3>
                Reset your password
              </h3>

              <p>
                {forgotStep === 1 &&
                  "Enter your registered email address or phone number."}

                {forgotStep === 2 &&
                  "Enter the verification code sent to your registered email."}

                {forgotStep === 3 &&
                  "Create a new password for your account."}
              </p>

            </div>

            <div className="forgot-steps-indicator">

              <span
                className={`step-dot ${
                  forgotStep >= 1
                    ? "active"
                    : ""
                }`}
              >
                1
              </span>

              <span
                className={`step-line ${
                  forgotStep >= 2
                    ? "active"
                    : ""
                }`}
              ></span>

              <span
                className={`step-dot ${
                  forgotStep >= 2
                    ? "active"
                    : ""
                }`}
              >
                2
              </span>

              <span
                className={`step-line ${
                  forgotStep >= 3
                    ? "active"
                    : ""
                }`}
              ></span>

              <span
                className={`step-dot ${
                  forgotStep >= 3
                    ? "active"
                    : ""
                }`}
              >
                3
              </span>

            </div>

            {forgotError && (
              <div className="auth-alert-error">

                <i className="bi bi-exclamation-circle"></i>

                <span>
                  {forgotError}
                </span>

              </div>
            )}

            {forgotSuccess && (
              <div className="auth-alert-success">

                <i className="bi bi-check-circle"></i>

                <span>
                  {forgotSuccess}
                </span>

              </div>
            )}

            {/* =================================================
                STEP 1 - EMAIL / PHONE
            ================================================= */}

            {forgotStep === 1 && (
              <form
                onSubmit={
                  handleForgotEmail
                }
              >

                <div className="auth-field">

                  <label htmlFor="forgot-email">
                    Email address or phone number
                  </label>

                  <div className="auth-input">

                    <span className="input-icon">
                      <i className="bi bi-person-vcard"></i>
                    </span>

                    <input
                      id="forgot-email"
                      type="text"
                      value={forgotEmail}
                      onChange={(e) =>
                        setForgotEmail(
                          e.target.value
                        )
                      }
                      placeholder="Enter your email or phone number"
                      autoComplete="email"
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={forgotLoading}
                >

                  {forgotLoading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}

                </button>

              </form>
            )}

            {/* =================================================
                STEP 2 - OTP
            ================================================= */}

            {forgotStep === 2 && (
              <form
                onSubmit={
                  handleVerifyForgotOtp
                }
              >

                <div className="auth-field">

                  <label htmlFor="forgot-otp">
                    Verification code
                  </label>

                  <div className="auth-input">

                    <span className="input-icon">
                      <i className="bi bi-shield-lock"></i>
                    </span>

                    <input
                      id="forgot-otp"
                      type="text"
                      value={forgotOtp}
                      onChange={(e) =>
                        setForgotOtp(
                          e.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter 6-digit verification code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={forgotLoading}
                >

                  {forgotLoading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify code
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}

                </button>

              </form>
            )}

            {/* =================================================
                STEP 3 - NEW PASSWORD + CONFIRM PASSWORD
            ================================================= */}

            {forgotStep === 3 && (
              <form
                onSubmit={
                  handleResetPassword
                }
              >

                {/* NEW PASSWORD */}

                <div className="auth-field">

                  <label htmlFor="new-password">
                    New password
                  </label>

                  <div className="auth-input">

                    <span className="input-icon">
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      id="new-password"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      aria-label={
                        showNewPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      <i
                        className={
                          showNewPassword
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      ></i>

                    </button>

                  </div>

                </div>

                {/* CONFIRM NEW PASSWORD */}

                <div className="auth-field">

                  <label htmlFor="confirm-new-password">
                    Confirm new password
                  </label>

                  <div
                    className={`auth-input ${
                      confirmNewPassword &&
                      newPassword !==
                        confirmNewPassword
                        ? "has-error"
                        : ""
                    }`}
                  >

                    <span className="input-icon">
                      <i className="bi bi-lock-fill"></i>
                    </span>

                    <input
                      id="confirm-new-password"
                      type={
                        showConfirmNewPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmNewPassword
                      }
                      onChange={(e) =>
                        setConfirmNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmNewPassword(
                          !showConfirmNewPassword
                        )
                      }
                      aria-label={
                        showConfirmNewPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      <i
                        className={
                          showConfirmNewPassword
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      ></i>

                    </button>

                  </div>

                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={forgotLoading}
                >

                  {forgotLoading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset password
                      <i className="bi bi-check2"></i>
                    </>
                  )}

                </button>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default Login;