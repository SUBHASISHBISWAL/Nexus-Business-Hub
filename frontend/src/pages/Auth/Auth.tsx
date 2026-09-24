
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem("isLoggedIn", "true");

    navigate("/");
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary frontend registration
    setIsRegister(false);
  };

  return (
    <div className={`auth-page ${isRegister ? "register-mode" : ""}`}>
      <div className="auth-card">

        {/* Left Brand Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">

            <div className="auth-brand-logo">
              <i className="bi bi-hdd-network"></i>
            </div>

            <h1>Nexus Technologies</h1>

            <p>
              Your trusted platform for smarter business solutions,
              products and services.
            </p>

          </div>

          <div className="auth-brand-footer">
            Enterprise Business Platform
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">

          {/* LOGIN FORM */}
          <div className="auth-form login-form">

            <div className="auth-heading">
              <span className="auth-small-title">
                Welcome Back
              </span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your details to continue to Nexus Technologies.
              </p>
            </div>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="auth-field">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="auth-input">
                  <i className="bi bi-envelope"></i>

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
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
                  <i className="bi bi-lock"></i>

                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
              >
                Login
              </button>

            </form>

            {/* Login → Register */}
            <div className="auth-switch">
              <span>Don't have an account?</span>

              <button
                type="button"
                onClick={() => setIsRegister(true)}
              >
                Create Account
              </button>
            </div>

          </div>

          {/* REGISTER FORM */}
          <div className="auth-form register-form">

            <div className="auth-heading">
              <span className="auth-small-title">
                Get Started
              </span>

              <h2>Create your account</h2>

              <p>
                Fill in your details to create your Nexus account.
              </p>
            </div>

            <form onSubmit={handleRegister}>

              {/* Full Name */}
              <div className="auth-field">
                <label htmlFor="register-name">
                  Full Name
                </label>

                <div className="auth-input">
                  <i className="bi bi-person"></i>

                  <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
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
                  <i className="bi bi-envelope"></i>

                  <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
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
                  <i className="bi bi-telephone"></i>

                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="Enter your phone number"
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
                  <i className="bi bi-lock"></i>

                  <input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="auth-field">
                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <div className="auth-input">
                  <i className="bi bi-shield-lock"></i>

                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
              >
                Create Account
              </button>

            </form>

            {/* Register → Login */}
            <div className="auth-switch">
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={() => setIsRegister(false)}
              >
                Login
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
