import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!adminId.trim() || !password.trim()) {
      setError("Please enter your Admin ID and password.");
      return;
    }

    // Temporary frontend credentials
    if (
      adminId === "admin@nexus.com" &&
      password === "Admin@123"
    ) {
      navigate("/admin/verify-otp");
      return;
    }

    setError("Invalid Admin ID or password.");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">

        {/* Left Section */}
        <div className="admin-login-brand">
          <div className="admin-brand-icon">
            <i className="bi bi-shield-lock"></i>
          </div>

          <h1>Nexus Technologies</h1>

          <p>
            Secure administration portal for managing
            your business operations.
          </p>

          <div className="admin-security-info">
            <i className="bi bi-shield-check"></i>
            <span>Protected Admin Access</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="admin-login-card">

          <button
            type="button"
            className="admin-back-btn"
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Customer Login
          </button>

          <div className="admin-login-header">
            <div className="admin-login-icon">
              <i className="bi bi-person-lock"></i>
            </div>

            <h2>Admin Login</h2>

            <p>
              Sign in to access the Nexus admin portal.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* Admin ID */}
            <div className="admin-form-group">
              <label htmlFor="adminId">
                Admin ID / Email
              </label>

              <div className="admin-input-wrapper">
                <i className="bi bi-person"></i>

                <input
                  id="adminId"
                  type="text"
                  placeholder="Enter your Admin ID or email"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="admin-form-group">
              <label htmlFor="adminPassword">
                Password
              </label>

              <div className="admin-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  <i
                    className={
                      showPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="admin-login-error">
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="admin-login-submit"
            >
              <span>Continue to Admin Login</span>
              <i className="bi bi-arrow-right"></i>
            </button>

          </form>

          <div className="admin-login-footer">
            <i className="bi bi-shield-check"></i>
            <span>
              Your admin account is protected with
              additional verification.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}