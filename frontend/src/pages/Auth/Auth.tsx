
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const email = loginEmail.trim().toLowerCase();

    // Admin login
    if (
      email === "admin@nexus.com" &&
      loginPassword === "Admin@123"
    ) {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/verify-otp");
      }, 900);

      return;
    }

    // Normal user login
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoading(false);
      navigate("/");
    }, 900);
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (registerPassword !== confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      setRegisterPassword("");
      setConfirmPassword("");

      // After successful registration,
      // return to Login page
      setIsRegister(false);
    }, 900);
  };

  // =========================================================
  // SWITCH TO REGISTER
  // =========================================================

  const openRegister = () => {
    if (isLoading) return;

    setIsRegister(true);
  };

  // =========================================================
  // SWITCH TO LOGIN
  // =========================================================

  const openLogin = () => {
    if (isLoading) return;

    setIsRegister(false);
  };

  return (
    <div className={`auth-page ${isRegister ? "register-mode" : ""}`}>
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="auth-background">
        <span className="auth-orb orb-one"></span>
        <span className="auth-orb orb-two"></span>
        <span className="auth-orb orb-three"></span>

        <span className="auth-grid-line line-one"></span>
        <span className="auth-grid-line line-two"></span>
      </div>

      {/* =====================================================
          AUTH CARD
      ===================================================== */}

      <div className="auth-card">

        {/* ===================================================
            BRAND / INFORMATION PANEL
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

          <div
            className={`auth-brand-content ${
              isRegister
                ? "brand-content-register"
                : "brand-content-login"
            }`}
          >
            {/* Logo */}
            <div className="auth-brand-logo">
              <i
                className={
                  isRegister
                    ? "bi bi-person-plus"
                    : "bi bi-hdd-network"
                }
              ></i>
            </div>

            {/* Eyebrow */}
            <span className="brand-eyebrow">
              NEXUS TECHNOLOGIES
            </span>

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
                      isRegister
                        ? "bi bi-person-check"
                        : "bi bi-shield-check"
                    }
                  ></i>
                </div>

                <div className="brand-feature-text">
                  <strong>
                    {isRegister
                      ? "Easy Onboarding"
                      : "Secure Platform"}
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
                      isRegister
                        ? "bi bi-diagram-3"
                        : "bi bi-lightning-charge"
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
                <i className="bi bi-person-lock"></i>
              </div>

              <span className="auth-small-title">
                Welcome Back
              </span>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Enter your details to continue to Nexus
                Technologies.
              </p>

            </div>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="auth-field">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="auth-input">

                  <i className="bi bi-envelope input-icon"></i>

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) =>
                      setLoginEmail(e.target.value)
                    }
                    autoComplete="username"
                    required
                  />

                </div>
              </div>

              {/* Password */}
              <div className="auth-field">

                <div className="auth-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-btn"
                  >
                    Forgot Password?
                  </button>

                </div>

                <div className="auth-input">

                  <i className="bi bi-lock input-icon"></i>

                  <input
                    id="login-password"
                    type={
                      showLoginPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) =>
                      setLoginPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowLoginPassword(
                        !showLoginPassword
                      )
                    }
                    aria-label="Toggle password visibility"
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

              {/* Login Button */}
              <button
                type="submit"
                className={`auth-submit-btn ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner"></span>

                    <span>
                      Signing you in...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Login
                    </span>

                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

            </form>

            {/* Security */}
            <div className="auth-security-note">
              <i className="bi bi-shield-check"></i>

              <span>
                Secure authentication protected by Nexus
              </span>
            </div>

            {/* Create Account */}
            <div className="auth-switch">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={openRegister}
              >
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

              {/* No icon here */}

              <span className="auth-small-title">
                Get Started
              </span>

              <h2>
                Create your account
              </h2>

              <p>
                Create your Nexus account and start
                managing your business.
              </p>

            </div>

            <form onSubmit={handleRegister}>

              {/* Full Name */}
              <div className="auth-field">

                <label htmlFor="register-name">
                  Full Name
                </label>

                <div className="auth-input">

                  <i className="bi bi-person input-icon"></i>

                  <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* Email */}
              <div className="auth-field">

                <label htmlFor="register-email">
                  Email Address
                </label>

                <div className="auth-input">

                  <i className="bi bi-envelope input-icon"></i>

                  <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* Phone */}
              <div className="auth-field">

                <label htmlFor="register-phone">
                  Phone Number
                </label>

                <div className="auth-input">

                  <i className="bi bi-telephone input-icon"></i>

                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                  />

                </div>

              </div>

              {/* Password */}
              <div className="auth-field">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input">

                  <i className="bi bi-lock input-icon"></i>

                  <input
                    id="register-password"
                    type={
                      showRegisterPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowRegisterPassword(
                        !showRegisterPassword
                      )
                    }
                    aria-label="Toggle password visibility"
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

              {/* Confirm Password */}
              <div className="auth-field">

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <div className="auth-input">

                  <i className="bi bi-shield-lock input-icon"></i>

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label="Toggle password visibility"
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

              {/* Create Account Button */}
              <button
                type="submit"
                className={`auth-submit-btn ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner"></span>

                    <span>
                      Creating account...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Create Account
                    </span>

                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

            </form>

            {/* Security */}
            <div className="auth-security-note">

              <i className="bi bi-shield-check"></i>

              <span>
                Your information is securely protected
              </span>

            </div>

            {/* Already Have Account */}
            <div className="auth-switch">

              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={openLogin}
              >
                Login

                <i className="bi bi-arrow-up-right"></i>
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
