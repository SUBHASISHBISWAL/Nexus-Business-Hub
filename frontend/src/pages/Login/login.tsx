import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyResetOtp,
} from "../../services/authService";

import "./login.css";

type ForgotStep = 1 | 2 | 3;

const ADMIN_EMAIL = "admin@nexus.com";
const ADMIN_PASSWORD = "Admin@123";

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const phoneRegex = /^[0-9]{10}$/;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Automatically remove register popup
  useEffect(() => {
    if (!registerError) return;

    const timer = window.setTimeout(() => {
      setRegisterError("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [registerError]);

  // Automatically remove login error
  useEffect(() => {
    if (!loginError) return;

    const timer = window.setTimeout(() => {
      setLoginError("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [loginError]);

  const switchToRegister = () => {
    setIsRegisterMode(true);
    setLoginError("");
    setRegisterError("");
    setRegisterSuccess("");
  };

  const switchToLogin = () => {
    setIsRegisterMode(false);
    setLoginError("");
    setRegisterError("");
    setRegisterSuccess("");
  };

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoginError("");

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword;

    if (!cleanEmail || !cleanPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    setLoginLoading(true);

    try {
      // =========================================================
      // ADMIN LOGIN
      // =========================================================
      if (
        cleanEmail === ADMIN_EMAIL &&
        cleanPassword === ADMIN_PASSWORD
      ) {
        localStorage.setItem("adminEmail", cleanEmail);

        // IMPORTANT:
        // AdminOTP.tsx checks this exact key.
        localStorage.setItem(
          "nexus_admin_pending_otp",
          "true"
        );

        navigate("/admin/verify-otp");
        return;
      }

      // =========================================================
      // CUSTOMER LOGIN
      // =========================================================
      const response = await loginUser({
        email: cleanEmail,
        identifier: cleanEmail,
        password: cleanPassword,
      });

      // Customer must not enter admin OTP flow.
      if (
        response.role?.toLowerCase() === "admin" ||
        response.requiresOtp
      ) {
        setLoginError("Invalid email or password.");
        return;
      }

      if (!response.token) {
        setLoginError("Invalid email or password.");
        return;
      }

      // =========================================================
      // SAVE AUTHENTICATION DATA
      // =========================================================

      localStorage.setItem("authToken", response.token);

      localStorage.setItem(
        "userId",
        String(response.userId ?? "")
      );

      localStorage.setItem(
        "userEmail",
        response.email || cleanEmail
      );

      localStorage.setItem(
        "userFirstName",
        response.firstName || ""
      );

      localStorage.setItem(
        "userLastName",
        response.lastName || ""
      );

      localStorage.setItem(
        "userPhone",
        response.phoneNumber || ""
      );

      localStorage.setItem(
        "userRole",
        response.role || "Customer"
      );

      // =========================================================
      // IMPORTANT:
      // Navbar reads the complete user from localStorage key
      // "user". Save the complete customer object here.
      // =========================================================

      const storedUser = {
        userId: response.userId,
        firstName: response.firstName || "",
        lastName: response.lastName || "",
        email: response.email || cleanEmail,
        phoneNumber: response.phoneNumber || "",
        role: response.role || "Customer",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(storedUser)
      );

      // Navbar checks this value.
      localStorage.setItem("isLoggedIn", "true");

      // Navbar listens for this event.
      window.dispatchEvent(new Event("userUpdated"));

      navigate("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Invalid email or password.";

      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setRegisterError("");
    setRegisterSuccess("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = registerEmail.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    // Required field validation.
    // Error is shown as a fixed popup and does not
    // take any space inside the form.
    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !cleanPhone ||
      !registerPassword ||
      !confirmPassword
    ) {
      setRegisterError("Please fill in all required fields.");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setRegisterError("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(cleanPhone)) {
      setRegisterError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    setRegisterLoading(true);

    try {
      await registerUser({
        fullName: `${cleanFirstName} ${cleanLastName}`,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        password: registerPassword,
      });

      setRegisterSuccess(
        "Account created successfully. Please sign in."
      );

      setFirstName("");
      setLastName("");
      setRegisterEmail("");
      setPhoneNumber("");
      setRegisterPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        setRegisterSuccess("");
        setIsRegisterMode(false);
      }, 1800);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to create your account. Please try again.";

      setRegisterError(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotStep(1);
    setForgotIdentifier("");
    setForgotOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotError("");
    setForgotSuccess("");
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotIdentifier("");
    setForgotOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotError("");
    setForgotSuccess("");
  };

  const handleForgotPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setForgotError("");
    setForgotSuccess("");

    const cleanIdentifier = forgotIdentifier.trim();

    if (!cleanIdentifier) {
      setForgotError(
        "Please enter your email or phone number."
      );
      return;
    }

    const isEmail = emailRegex.test(cleanIdentifier);
    const isPhone = phoneRegex.test(cleanIdentifier);

    if (!isEmail && !isPhone) {
      setForgotError(
        "Please enter a valid email address or 10-digit phone number."
      );
      return;
    }

    setForgotLoading(true);

    try {
      const response = await forgotPassword(cleanIdentifier);

      setForgotSuccess(
        response?.message ||
          "A 6-digit verification code has been sent to your registered email address."
      );

      setForgotStep(2);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "We could not send the verification code. Please check your details and try again.";

      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyResetOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setForgotError("");
    setForgotSuccess("");

    const cleanOtp = forgotOtp.trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setForgotError(
        "Please enter a valid 6-digit verification code."
      );
      return;
    }

    setForgotLoading(true);

    try {
      const response = await verifyResetOtp(
        forgotIdentifier.trim(),
        cleanOtp
      );

      setResetToken(response.resetToken);

      setForgotSuccess("Verification successful.");

      setForgotStep(3);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Invalid or expired verification code.";

      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setForgotError("");
    setForgotSuccess("");

    if (!newPassword || !confirmNewPassword) {
      setForgotError(
        "Please fill in both password fields."
      );
      return;
    }

    if (newPassword.length < 8) {
      setForgotError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setForgotError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setForgotError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setForgotError(
        "Password must contain at least one number."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      setForgotError(
        "Your password reset session has expired. Please try again."
      );
      return;
    }

    setForgotLoading(true);

    try {
      const response = await resetPassword(
        resetToken,
        newPassword
      );

      setForgotSuccess(
        response?.message ||
          "Password reset successfully. You can now sign in."
      );

      window.setTimeout(() => {
        closeForgotPassword();
      }, 1800);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to reset your password. Please try again.";

      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className={`auth-page ${
        isRegisterMode ? "register-mode" : ""
      }`}
    >
      {/* Fixed validation popup.
          It does not occupy form space. */}
      {registerError && isRegisterMode && (
        <div
          className="auth-validation-popup"
          role="alert"
        >
          {registerError}
        </div>
      )}

      <div className="auth-card">
        {/* BRAND PANEL */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <span className="bi bi-buildings-fill"></span>
            </div>

            <div className="auth-brand-name">
              NEXUS BUSINESS HUB
            </div>

            <h1>Build your business with Nexus.</h1>

            <p>
              A unified business platform designed to simplify
              products, orders, shipments and customer support.
            </p>

            <div className="auth-brand-features">
              <div className="auth-brand-feature">
                <span className="bi bi-shield-check"></span>

                <div>
                  <strong>Secure access</strong>

                  <span>
                    Enterprise-ready authentication
                  </span>
                </div>
              </div>

              <div className="auth-brand-feature">
                <span className="bi bi-diagram-3"></span>

                <div>
                  <strong>Connected workflow</strong>

                  <span>
                    Manage your business in one place
                  </span>
                </div>
              </div>
            </div>

            <div className="auth-brand-footer">
              POWERING MODERN BUSINESS
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="auth-form-panel">
          {/* LOGIN FORM */}
          <div className="auth-form login-form">
            <div className="auth-form-header">
              <div className="auth-form-eyebrow">
                WELCOME BACK
              </div>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to continue to Nexus
                Business Hub.
              </p>
            </div>

            <form onSubmit={handleLogin} noValidate>
              {loginError && (
                <div
                  className="auth-alert-error"
                  role="alert"
                >
                  <span className="bi bi-exclamation-circle"></span>
                  <span>{loginError}</span>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <div className="auth-input">
                  <span className="input-icon bi bi-envelope"></span>

                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(event) =>
                      setLoginEmail(event.target.value)
                    }
                    placeholder="Enter your email address"
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
                    className="auth-link-button"
                    onClick={openForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="auth-input">
                  <span className="input-icon bi bi-lock"></span>

                  <input
                    id="login-password"
                    type={
                      showLoginPassword
                        ? "text"
                        : "password"
                    }
                    value={loginPassword}
                    onChange={(event) =>
                      setLoginPassword(event.target.value)
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
                    <span
                      className={`bi ${
                        showLoginPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></span>
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
                    <span className="bi bi-arrow-right"></span>
                  </>
                )}
              </button>

              <div className="auth-security-note">
                <span className="bi bi-shield-lock"></span>
                Your information is protected with secure
                authentication.
              </div>
            </form>

            <div className="auth-switch">
              <span>Don't have an account?</span>

              <button
                type="button"
                onClick={switchToRegister}
              >
                Create account
              </button>
            </div>
          </div>

          {/* REGISTER FORM */}
          <div className="auth-form register-form">
            <div className="auth-form-header">
              <div className="auth-form-eyebrow">
                GET STARTED
              </div>

              <h2>Create your account</h2>

              <p>
                Set up your Nexus Business Hub account.
              </p>
            </div>

            <form onSubmit={handleRegister} noValidate>
              {registerSuccess && (
                <div
                  className="auth-alert-success"
                  role="status"
                >
                  <span className="bi bi-check-circle"></span>
                  <span>{registerSuccess}</span>
                </div>
              )}

              <div className="auth-register-row">
                <div className="auth-field">
                  <label htmlFor="register-first-name">
                    First name
                  </label>

                  <div className="auth-input">
                    <span className="input-icon bi bi-person"></span>

                    <input
                      id="register-first-name"
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
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
                    <span className="input-icon bi bi-person"></span>

                    <input
                      id="register-last-name"
                      type="text"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="auth-input">
                  <span className="input-icon bi bi-envelope"></span>

                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(event) =>
                      setRegisterEmail(event.target.value)
                    }
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-phone">
                  Phone number
                </label>

                <div className="auth-input">
                  <span className="input-icon bi bi-telephone"></span>

                  <input
                    id="register-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) =>
                      setPhoneNumber(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="Enter 10-digit phone number"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input">
                  <span className="input-icon bi bi-lock"></span>

                  <input
                    id="register-password"
                    type={
                      showRegisterPassword
                        ? "text"
                        : "password"
                    }
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(event.target.value)
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
                    <span
                      className={`bi ${
                        showRegisterPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <div className="auth-input">
                  <span className="input-icon bi bi-lock-fill"></span>

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
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
                    <span
                      className={`bi ${
                        showConfirmPassword
                          ? "bi-eye-slash"
                          : "bi-eye"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn register-submit-btn"
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
                    <span className="bi bi-arrow-right"></span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={switchToLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPassword && (
        <div
          className="forgot-password-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForgotPassword();
            }
          }}
        >
          <div
            className="forgot-password-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
          >
            <button
              type="button"
              className="forgot-password-close"
              onClick={closeForgotPassword}
              aria-label="Close"
            >
              <span className="bi bi-x-lg"></span>
            </button>

            <div className="forgot-password-icon">
              <span className="bi bi-shield-lock"></span>
            </div>

            <h3 id="forgot-password-title">
              {forgotStep === 1 && "Forgot password?"}
              {forgotStep === 2 && "Verify your code"}
              {forgotStep === 3 && "Create new password"}
            </h3>

            <p className="forgot-password-description">
              {forgotStep === 1 &&
                "Enter your registered email address or phone number to reset your password."}

              {forgotStep === 2 &&
                "Enter the 6-digit verification code sent to your registered email address."}

              {forgotStep === 3 &&
                "Create a new password for your Nexus Business Hub account."}
            </p>

            {forgotError && (
              <div className="auth-alert-error" role="alert">
                <span className="bi bi-exclamation-circle"></span>
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div
                className="auth-alert-success"
                role="status"
              >
                <span className="bi bi-check-circle"></span>
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* FORGOT STEP 1 */}
            {forgotStep === 1 && (
              <form
                onSubmit={handleForgotPassword}
                className="forgot-password-form"
                noValidate
              >
                <div className="auth-field">
                  <label htmlFor="forgot-identifier">
                    Email or phone number
                  </label>

                  <div className="auth-input">
                    <span className="input-icon bi bi-person-vcard"></span>

                    <input
                      id="forgot-identifier"
                      type="text"
                      value={forgotIdentifier}
                      onChange={(event) =>
                        setForgotIdentifier(
                          event.target.value
                        )
                      }
                      placeholder="Enter email or phone number"
                      autoComplete="username"
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send verification code
                      <span className="bi bi-arrow-right"></span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORGOT STEP 2 */}
            {forgotStep === 2 && (
              <form
                onSubmit={handleVerifyResetOtp}
                className="forgot-password-form"
                noValidate
              >
                <div className="auth-field">
                  <label htmlFor="forgot-otp">
                    Verification code
                  </label>

                  <div className="auth-input">
                    <span className="input-icon bi bi-shield-check"></span>

                    <input
                      id="forgot-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(event) =>
                        setForgotOtp(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter 6-digit code"
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
                      <span className="bi bi-arrow-right"></span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="forgot-secondary-button"
                  onClick={() => {
                    setForgotStep(1);
                    setForgotError("");
                    setForgotSuccess("");
                  }}
                >
                  Use a different email or phone
                </button>
              </form>
            )}

            {/* FORGOT STEP 3 */}
            {forgotStep === 3 && (
              <form
                onSubmit={handleResetPassword}
                className="forgot-password-form"
                noValidate
              >
                <div className="auth-field">
                  <label htmlFor="new-password">
                    New password
                  </label>

                  <div className="auth-input">
                    <span className="input-icon bi bi-lock"></span>

                    <input
                      id="new-password"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
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
                      <span
                        className={`bi ${
                          showNewPassword
                            ? "bi-eye-slash"
                            : "bi-eye"
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="confirm-new-password">
                    Confirm new password
                  </label>

                  <div className="auth-input">
                    <span className="input-icon bi bi-lock-fill"></span>

                    <input
                      id="confirm-new-password"
                      type={
                        showConfirmNewPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmNewPassword}
                      onChange={(event) =>
                        setConfirmNewPassword(
                          event.target.value
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
                      <span
                        className={`bi ${
                          showConfirmNewPassword
                            ? "bi-eye-slash"
                            : "bi-eye"
                        }`}
                      ></span>
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
                      Updating...
                    </>
                  ) : (
                    <>
                      Reset password
                      <span className="bi bi-check2"></span>
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