import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  loginUser,
  registerUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../../services/authService";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loginGeneralError, setLoginGeneralError] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

  // Register Form States
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [registerGeneralError, setRegisterGeneralError] = useState("");

  // Forgot Password Flow States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);

  useEffect(() => {
    if (forgotCooldown <= 0) return;
    const timer = setInterval(() => {
      setForgotCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [forgotCooldown]);

  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // CLIENT-SIDE VALIDATION LOGIC
  // =========================================================

  const validateFullName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) {
      return "Full name is required.";
    }
    if (/\d/.test(trimmed)) {
      return "Full name cannot contain numbers.";
    }
    // Allow normal alphabetic names, spaces, apostrophes, hyphens, dots
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed) || !/[a-zA-Z]/.test(trimmed)) {
      return "Full name can only contain alphabetic characters and spaces.";
    }
    if (trimmed.length < 2) {
      return "Full name must be at least 2 characters.";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    const trimmed = email.trim();
    if (!trimmed) {
      return "Email address is required.";
    }
    // Standard email validation requiring domain with dot and at least 2 TLD chars
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validateIndianPhone = (phone: string): string => {
    const trimmed = phone.trim();
    if (!trimmed) {
      return "Phone number is required.";
    }
    // Strip spaces, dashes, and optional leading +91 or 0
    let cleanPhone = trimmed.replace(/[\s-]/g, "");
    if (cleanPhone.startsWith("+91")) {
      cleanPhone = cleanPhone.substring(3);
    } else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1);
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    return "";
  };

  // =========================================================
  // LOGIN SUBMISSION
  // =========================================================

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setLoginGeneralError("");
    setLoginSuccessMessage("");

    const errors: { identifier?: string; password?: string } = {};

    const trimmedIdentifier = loginEmail.trim();
    if (!trimmedIdentifier) {
      errors.identifier = "Email or phone number is required.";
    }

    if (!loginPassword) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});

    // Demo Admin shortcut preservation
    if (
      trimmedIdentifier.toLowerCase() === "admin@nexus.com" &&
      loginPassword === "Admin@123"
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/verify-otp");
      }, 500);
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: trimmedIdentifier,
        identifier: trimmedIdentifier,
        password: loginPassword,
      });

      if (response.role === "Admin" || response.requiresOtp) {
        setIsLoading(false);
        navigate("/admin/verify-otp");
        return;
      }

      // Customer Login Success
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", response.role);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phoneNumber: response.phoneNumber || "",
          role: response.role,
        })
      );

      window.dispatchEvent(new Event("userUpdated"));

      setIsLoading(false);
      navigate("/");
    } catch (err: unknown) {
      setIsLoading(false);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const status = err.response.status;
          const data = err.response.data as { message?: string };

          if (status === 401) {
            setLoginGeneralError("Invalid email/phone or password.");
          } else if (status === 400) {
            setLoginGeneralError(data?.message || "Invalid credentials provided.");
          } else if (status === 500) {
            setLoginGeneralError("Server error. Please try again later.");
          } else {
            setLoginGeneralError(data?.message || "Login failed. Please try again.");
          }
        } else {
          setLoginGeneralError("Unable to connect to the server. Please try again.");
        }
      } else {
        setLoginGeneralError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // =========================================================
  // REGISTER SUBMISSION
  // =========================================================

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setRegisterGeneralError("");
    setLoginSuccessMessage("");

    const errors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const nameError = validateFullName(registerFullName);
    if (nameError) errors.fullName = nameError;

    const emailError = validateEmail(registerEmail);
    if (emailError) errors.email = emailError;

    const phoneError = validateIndianPhone(registerPhone);
    if (phoneError) errors.phone = phoneError;

    const passwordError = validatePassword(registerPassword);
    if (passwordError) errors.password = passwordError;

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (registerPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setRegisterErrors({});
    setIsLoading(true);

    const cleanEmail = registerEmail.trim().toLowerCase();
    let cleanPhone = registerPhone.trim().replace(/[\s-]/g, "");
    if (cleanPhone.startsWith("+91")) cleanPhone = cleanPhone.substring(3);
    else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) cleanPhone = cleanPhone.substring(2);
    else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) cleanPhone = cleanPhone.substring(1);

    const nameParts = registerFullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await registerUser({
        fullName: registerFullName.trim(),
        firstName,
        lastName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        password: registerPassword,
      });

      setIsLoading(false);

      // Reset registration form
      setRegisterFullName("");
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterPassword("");
      setConfirmPassword("");
      setRegisterErrors({});

      // Set registered email into login form and show success
      setLoginEmail(cleanEmail);
      setLoginPassword("");
      setLoginGeneralError("");
      setLoginSuccessMessage("Registration successful. Please login.");

      // Switch to Login tab
      setIsRegister(false);
    } catch (err: unknown) {
      setIsLoading(false);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          const status = err.response.status;
          const data = err.response.data as { message?: string };

          if (status === 409) {
            setRegisterGeneralError(data?.message || "An account with this email or phone number already exists.");
          } else if (status === 400) {
            setRegisterGeneralError(data?.message || "Invalid registration information.");
          } else if (status === 500) {
            setRegisterGeneralError("Server error. Please try again later.");
          } else {
            setRegisterGeneralError(data?.message || "Registration failed. Please try again.");
          }
        } else {
          setRegisterGeneralError("Unable to connect to the server. Please try again.");
        }
      } else {
        setRegisterGeneralError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // =========================================================
  // SWITCH VIEWS
  // =========================================================

  const openRegister = () => {
    if (isLoading) return;
    setLoginGeneralError("");
    setRegisterGeneralError("");
    setLoginSuccessMessage("");
    setRegisterErrors({});
    setIsRegister(true);
  };

  const openLogin = () => {
    if (isLoading) return;
    setLoginGeneralError("");
    setRegisterGeneralError("");
    setLoginErrors({});
    setIsRegister(false);
  };

  // =========================================================
  // FORGOT PASSWORD FLOW
  // =========================================================

  const openForgotPasswordModal = () => {
    setShowForgotPassword(true);
    setForgotStep(1);
    setForgotIdentifier(loginEmail.trim());
    setForgotOtp("");
    setForgotResetToken("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setShowForgotNewPassword(false);
    setShowForgotConfirmPassword(false);
    setForgotError("");
    setForgotLoading(false);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotResetToken("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setShowForgotNewPassword(false);
    setShowForgotConfirmPassword(false);
    setForgotError("");
    setForgotLoading(false);
  };

  const getApiErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return "Unable to connect to the server. Please check your network connection.";
      }
      const status = err.response.status;
      const data = err.response.data as { message?: string; error?: string };
      if (status === 429) {
        return data?.message || "Too many requests. Please wait a moment before trying again.";
      }
      if (status === 404) {
        return data?.message || "Requested account or resource not found.";
      }
      if (status === 401) {
        return data?.message || "Verification code is invalid or expired.";
      }
      if (status === 409) {
        return data?.message || "Conflict occurred. Please try again.";
      }
      if (status === 400) {
        return data?.message || "Invalid request. Please check the provided information.";
      }
      if (status === 502) {
        return data?.message || "Email service error. Please try again later.";
      }
      if (status >= 500) {
        return data?.message || "Server error. Please try again later.";
      }
      return data?.message || defaultMsg;
    }
    return defaultMsg;
  };

  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotLoading) return;
    setForgotError("");

    const trimmed = forgotIdentifier.trim();
    if (!trimmed) {
      setForgotError("Please enter your registered email or phone number.");
      return;
    }

    if (trimmed.includes("@")) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmed)) {
        setForgotError("Please enter a valid email address.");
        return;
      }
    }

    setForgotLoading(true);
    try {
      await forgotPassword(trimmed);
      setForgotLoading(false);
      setForgotStep(2);
      setForgotCooldown(60);
    } catch (err: unknown) {
      setForgotLoading(false);
      setForgotError(getApiErrorMessage(err, "Failed to send verification code. Please try again."));
    }
  };

  const handleResendForgotOtp = async () => {
    if (forgotLoading || forgotCooldown > 0) return;
    setForgotError("");
    setForgotLoading(true);
    try {
      await forgotPassword(forgotIdentifier.trim());
      setForgotLoading(false);
      setForgotCooldown(60);
    } catch (err: unknown) {
      setForgotLoading(false);
      setForgotError(getApiErrorMessage(err, "Failed to resend verification code. Please try again."));
    }
  };

  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotLoading) return;
    setForgotError("");

    const trimmedOtp = forgotOtp.trim();
    if (!trimmedOtp) {
      setForgotError("Please enter the verification code.");
      return;
    }

    if (trimmedOtp.length !== 6 || !/^\d{6}$/.test(trimmedOtp)) {
      setForgotError("Please enter a valid 6-digit verification code.");
      return;
    }

    setForgotLoading(true);
    try {
      const result = await verifyResetOtp(forgotIdentifier.trim(), trimmedOtp);
      setForgotLoading(false);
      // Store ephemeral reset token in React state (NEVER in localStorage/sessionStorage)
      setForgotResetToken(result.resetToken);
      setForgotStep(3);
    } catch (err: unknown) {
      setForgotLoading(false);
      setForgotError(getApiErrorMessage(err, "Invalid or expired verification code."));
    }
  };

  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotLoading) return;
    setForgotError("");

    const pwdErr = validatePassword(forgotNewPassword);
    if (pwdErr) {
      setForgotError(pwdErr);
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    if (!forgotResetToken) {
      setForgotError("Password reset session has expired. Please restart the request.");
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(forgotResetToken, forgotNewPassword);
      setForgotLoading(false);

      // Clean up sensitive state in memory
      setShowForgotPassword(false);
      setForgotResetToken("");
      setForgotOtp("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
      setShowForgotNewPassword(false);
      setShowForgotConfirmPassword(false);

      // Password Reset Complete
      setLoginSuccessMessage("Password reset successfully. Please login with your new password.");
      setLoginEmail(forgotIdentifier.trim());
      setLoginPassword("");
      setLoginGeneralError("");
    } catch (err: unknown) {
      setForgotLoading(false);
      setForgotError(getApiErrorMessage(err, "Failed to reset password. Please try again."));
    }
  };

  return (
    <div className={`auth-page ${isRegister ? "register-mode" : ""}`}>
      {/* Background Elements */}
      <div className="auth-background">
        <span className="auth-orb orb-one"></span>
        <span className="auth-orb orb-two"></span>
        <span className="auth-orb orb-three"></span>

        <span className="auth-grid-line line-one"></span>
        <span className="auth-grid-line line-two"></span>
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        {/* Brand / Information Panel */}
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

          <div
            className={`auth-brand-content ${
              isRegister ? "brand-content-register" : "brand-content-login"
            }`}
          >
            {/* Logo */}
            <div className="auth-brand-logo">
              <i
                className={
                  isRegister ? "bi bi-person-plus" : "bi bi-hdd-network"
                }
              ></i>
            </div>

            {/* Eyebrow */}
            <span className="brand-eyebrow">NEXUS TECHNOLOGIES</span>

            {/* Heading */}
            <h1>
              {isRegister
                ? "Your business. Connected."
                : "Smarter business starts here."}
            </h1>

            {/* Description */}
            <p>
              {isRegister
                ? "Create your Nexus account and bring your business operations together in one connected platform."
                : "Your trusted platform for smarter business solutions, products and services."}
            </p>

            {/* Features */}
            <div className="brand-features">
              <div className="brand-feature">
                <div className="brand-feature-icon">
                  <i
                    className={
                      isRegister ? "bi bi-person-check" : "bi bi-shield-check"
                    }
                  ></i>
                </div>

                <div className="brand-feature-text">
                  <strong>
                    {isRegister ? "Easy Onboarding" : "Secure Platform"}
                  </strong>
                  <span>
                    {isRegister
                      ? "Get started in minutes"
                      : "Enterprise-grade access"}
                  </span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="brand-feature-icon">
                  <i
                    className={
                      isRegister ? "bi bi-diagram-3" : "bi bi-lightning-charge"
                    }
                  ></i>
                </div>

                <div className="brand-feature-text">
                  <strong>
                    {isRegister
                      ? "One Connected Platform"
                      : "Connected Operations"}
                  </strong>
                  <span>
                    {isRegister
                      ? "Manage everything in one place"
                      : "Everything in one place"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-brand-footer">
            <span></span>
            Enterprise Business Platform
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          {/* =================================================
              LOGIN FORM
          ================================================= */}
          <div className="auth-form login-form">
            <div className="auth-heading">
              <div className="heading-icon">
                <i className="bi bi-person-lock"></i>
              </div>

              <span className="auth-small-title">Welcome Back</span>

              <h2>Sign in to your account</h2>

              <p>Enter your details to continue to Nexus Technologies.</p>
            </div>

            {/* Login General Error */}
            {loginGeneralError && (
              <div className="auth-alert-error" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{loginGeneralError}</span>
              </div>
            )}

            {/* Login Success Alert */}
            {loginSuccessMessage && (
              <div className="auth-alert-success" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <span>{loginSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* Email or Phone */}
              <div className="auth-field">
                <label htmlFor="login-email">Email or Phone Number</label>

                <div
                  className={`auth-input ${
                    loginErrors.identifier ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-envelope input-icon"></i>

                  <input
                    id="login-email"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.identifier) {
                        setLoginErrors({ ...loginErrors, identifier: undefined });
                      }
                      if (loginGeneralError) setLoginGeneralError("");
                    }}
                    autoComplete="username"
                    required
                  />
                </div>
                {loginErrors.identifier && (
                  <span className="field-error-message">
                    {loginErrors.identifier}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="login-password">Password</label>

                  <button
                    type="button"
                    className="forgot-btn"
                    onClick={openForgotPasswordModal}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div
                  className={`auth-input ${
                    loginErrors.password ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-lock input-icon"></i>

                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) {
                        setLoginErrors({ ...loginErrors, password: undefined });
                      }
                      if (loginGeneralError) setLoginGeneralError("");
                    }}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={
                        showLoginPassword ? "bi bi-eye-slash" : "bi bi-eye"
                      }
                    ></i>
                  </button>
                </div>
                {loginErrors.password && (
                  <span className="field-error-message">
                    {loginErrors.password}
                  </span>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`auth-submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner"></span>
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Security */}
            <div className="auth-security-note">
              <i className="bi bi-shield-check"></i>
              <span>Secure authentication protected by Nexus</span>
            </div>

            {/* Switch to Register */}
            <div className="auth-switch">
              <span>Don't have an account?</span>
              <button type="button" onClick={openRegister}>
                Create Account
                <i className="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>

          {/* =================================================
              REGISTER FORM
          ================================================= */}
          <div className="auth-form register-form">
            <div className="auth-heading register-heading">
              <span className="auth-small-title">Get Started</span>

              <h2>Create your account</h2>

              <p>
                Create your Nexus account and start managing your business.
              </p>
            </div>

            {/* Register General Error */}
            {registerGeneralError && (
              <div className="auth-alert-error" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{registerGeneralError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} noValidate>
              {/* Full Name */}
              <div className="auth-field">
                <label htmlFor="register-name">Full Name</label>

                <div
                  className={`auth-input ${
                    registerErrors.fullName ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-person input-icon"></i>

                  <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerFullName}
                    onChange={(e) => {
                      setRegisterFullName(e.target.value);
                      if (registerErrors.fullName) {
                        setRegisterErrors({
                          ...registerErrors,
                          fullName: undefined,
                        });
                      }
                      if (registerGeneralError) setRegisterGeneralError("");
                    }}
                    autoComplete="name"
                    required
                  />
                </div>
                {registerErrors.fullName && (
                  <span className="field-error-message">
                    {registerErrors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="auth-field">
                <label htmlFor="register-email">Email Address</label>

                <div
                  className={`auth-input ${
                    registerErrors.email ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-envelope input-icon"></i>

                  <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      if (registerErrors.email) {
                        setRegisterErrors({
                          ...registerErrors,
                          email: undefined,
                        });
                      }
                      if (registerGeneralError) setRegisterGeneralError("");
                    }}
                    autoComplete="email"
                    required
                  />
                </div>
                {registerErrors.email && (
                  <span className="field-error-message">
                    {registerErrors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="auth-field">
                <label htmlFor="register-phone">Phone Number</label>

                <div
                  className={`auth-input ${
                    registerErrors.phone ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-telephone input-icon"></i>

                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={registerPhone}
                    onChange={(e) => {
                      setRegisterPhone(e.target.value);
                      if (registerErrors.phone) {
                        setRegisterErrors({
                          ...registerErrors,
                          phone: undefined,
                        });
                      }
                      if (registerGeneralError) setRegisterGeneralError("");
                    }}
                    autoComplete="tel"
                    required
                  />
                </div>
                {registerErrors.phone && (
                  <span className="field-error-message">
                    {registerErrors.phone}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label htmlFor="register-password">Password</label>

                <div
                  className={`auth-input ${
                    registerErrors.password ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-lock input-icon"></i>

                  <input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Create a password (min 8 chars, A-Z, a-z, 0-9)"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (registerErrors.password) {
                        setRegisterErrors({
                          ...registerErrors,
                          password: undefined,
                        });
                      }
                      if (registerGeneralError) setRegisterGeneralError("");
                    }}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={
                        showRegisterPassword ? "bi bi-eye-slash" : "bi bi-eye"
                      }
                    ></i>
                  </button>
                </div>
                {registerErrors.password && (
                  <span className="field-error-message">
                    {registerErrors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="auth-field">
                <label htmlFor="confirm-password">Confirm Password</label>

                <div
                  className={`auth-input ${
                    registerErrors.confirmPassword ? "has-error" : ""
                  }`}
                >
                  <i className="bi bi-shield-lock input-icon"></i>

                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (registerErrors.confirmPassword) {
                        setRegisterErrors({
                          ...registerErrors,
                          confirmPassword: undefined,
                        });
                      }
                      if (registerGeneralError) setRegisterGeneralError("");
                    }}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={
                        showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"
                      }
                    ></i>
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <span className="field-error-message">
                    {registerErrors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className={`auth-submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Security */}
            <div className="auth-security-note">
              <i className="bi bi-shield-check"></i>
              <span>Your information is securely protected</span>
            </div>

            {/* Switch to Login */}
            <div className="auth-switch">
              <span>Already have an account?</span>
              <button type="button" onClick={openLogin}>
                Login
                <i className="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FORGOT PASSWORD MODAL FLOW
      ========================================================= */}
      {showForgotPassword && (
        <div
          className="forgot-password-overlay"
          onClick={closeForgotPasswordModal}
        >
          <div
            className="forgot-password-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="forgot-close-btn"
              onClick={closeForgotPasswordModal}
              aria-label="Close"
            >
              <i className="bi bi-x"></i>
            </button>

            <div className="forgot-header">
              <h3>Reset Password</h3>
              <p>
                {forgotStep === 1 && "Enter your email or phone number to receive an OTP."}
                {forgotStep === 2 && "Enter the verification code sent to your email/phone."}
                {forgotStep === 3 && "Create a new secure password for your account."}
              </p>
            </div>

            <div className="forgot-steps-indicator">
              <span className={`step-dot ${forgotStep >= 1 ? "active" : ""}`}>1</span>
              <span className={`step-line ${forgotStep >= 2 ? "active" : ""}`}></span>
              <span className={`step-dot ${forgotStep >= 2 ? "active" : ""}`}>2</span>
              <span className={`step-line ${forgotStep >= 3 ? "active" : ""}`}></span>
              <span className={`step-dot ${forgotStep >= 3 ? "active" : ""}`}>3</span>
            </div>

            {forgotError && (
              <div className="auth-alert-error" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{forgotError}</span>
              </div>
            )}

            {/* STEP 1: Email / Phone */}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1}>
                <div className="auth-field">
                  <label htmlFor="forgot-identifier">Email or Phone</label>
                  <div className="auth-input">
                    <i className="bi bi-envelope input-icon"></i>
                    <input
                      id="forgot-identifier"
                      type="text"
                      placeholder="Enter registered email or phone"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={forgotLoading}>
                  <span>{forgotLoading ? "Sending OTP..." : "Send OTP"}</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2}>
                <div className="auth-field">
                  <label htmlFor="forgot-otp">Verification Code (OTP)</label>
                  <div className="auth-input">
                    <i className="bi bi-shield-check input-icon"></i>
                    <input
                      id="forgot-otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", fontSize: "12px" }}>
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setForgotError(""); }}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    Change Email/Phone
                  </button>
                  <button
                    type="button"
                    onClick={handleResendForgotOtp}
                    disabled={forgotCooldown > 0 || forgotLoading}
                    style={{
                      background: "none",
                      border: "none",
                      color: forgotCooldown > 0 ? "#94a3b8" : "#2563eb",
                      cursor: forgotCooldown > 0 ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      padding: 0
                    }}
                  >
                    {forgotCooldown > 0 ? `Resend in ${forgotCooldown}s` : "Resend OTP"}
                  </button>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={forgotLoading}>
                  <span>{forgotLoading ? "Verifying..." : "Verify OTP"}</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </form>
            )}

            {/* STEP 3: New Password & Confirm Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotStep3}>
                <div className="auth-field">
                  <label htmlFor="forgot-new-password">New Password</label>
                  <div className="auth-input">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      id="forgot-new-password"
                      type={showForgotNewPassword ? "text" : "password"}
                      placeholder="New password (min 8 chars, A-Z, a-z, 0-9)"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      aria-label="Toggle new password visibility"
                    >
                      <i className={showForgotNewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="forgot-confirm-password">Confirm New Password</label>
                  <div className="auth-input">
                    <i className="bi bi-shield-lock input-icon"></i>
                    <input
                      id="forgot-confirm-password"
                      type={showForgotConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      <i className={showForgotConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={forgotLoading}>
                  <span>{forgotLoading ? "Resetting Password..." : "Reset Password"}</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
