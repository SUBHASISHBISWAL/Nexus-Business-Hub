
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOTP.css";

export default function AdminOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    if (otp !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("isAdmin", "true");
      setIsLoading(false);
      navigate("/admin/dashboard");
    }, 700);
  };

  return (
    <div className="admin-otp-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="admin-otp-background">
        <span className="admin-otp-orb otp-orb-one"></span>
        <span className="admin-otp-orb otp-orb-two"></span>
        <span className="admin-otp-orb otp-orb-three"></span>

        <span className="admin-otp-grid-line otp-line-one"></span>
        <span className="admin-otp-grid-line otp-line-two"></span>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="admin-otp-container">

        {/* ===================================================
            BRAND PANEL
        =================================================== */}

        <div className="admin-otp-brand">

          <div className="otp-brand-glow otp-brand-glow-one"></div>
          <div className="otp-brand-glow otp-brand-glow-two"></div>

          <div className="otp-brand-network">
            <span className="otp-network-node otp-node-one"></span>
            <span className="otp-network-node otp-node-two"></span>
            <span className="otp-network-node otp-node-three"></span>
            <span className="otp-network-node otp-node-four"></span>

            <span className="otp-network-line otp-network-line-one"></span>
            <span className="otp-network-line otp-network-line-two"></span>
            <span className="otp-network-line otp-network-line-three"></span>
          </div>

          <div className="admin-otp-brand-content">

            <div className="admin-otp-brand-icon">
              <i className="bi bi-shield-lock"></i>
            </div>

            <span className="admin-otp-eyebrow">
              NEXUS TECHNOLOGIES
            </span>

            <h1>
              Secure access starts here.
            </h1>

            <p>
              Protecting your administration portal with
              an additional layer of secure verification.
            </p>

            <div className="admin-otp-security">

              <div className="admin-otp-security-icon">
                <i className="bi bi-shield-check"></i>
              </div>

              <div className="admin-otp-security-text">
                <strong>
                  Multi-Factor Authentication
                </strong>

                <span>
                  Additional security for admin access
                </span>
              </div>

            </div>

            <div className="admin-otp-security">

              <div className="admin-otp-security-icon">
                <i className="bi bi-lock"></i>
              </div>

              <div className="admin-otp-security-text">
                <strong>
                  Protected Administration
                </strong>

                <span>
                  Authorized access only
                </span>
              </div>

            </div>

          </div>

          <div className="admin-otp-brand-footer">
            <span></span>
            Enterprise Business Platform
          </div>

        </div>

        {/* ===================================================
            OTP FORM PANEL
        =================================================== */}

        <div className="admin-otp-card">

          {/* Back */}
          <button
            type="button"
            className="admin-otp-back-btn"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Login
          </button>

          {/* Header */}
          <div className="admin-otp-header">

            <div className="admin-otp-icon">
              <i className="bi bi-phone"></i>
            </div>

            <span className="admin-otp-small-title">
              ADMIN VERIFICATION
            </span>

            <h2>
              Verify your identity
            </h2>

            <p>
              Enter the 6-digit verification code sent to
              your registered mobile number to continue.
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleVerify}>

            <div className="admin-otp-form-group">

              <label htmlFor="adminOtp">
                Verification Code
              </label>

              <div className="admin-otp-input-wrapper">

                <i className="bi bi-shield-check"></i>

                <input
                  id="adminOtp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setError("");

                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    );
                  }}
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />

              </div>

              <span className="admin-otp-helper">
                Enter the verification code to access the
                administration portal.
              </span>

            </div>

            {/* Error */}
            {error && (
              <div className="admin-otp-error">
                <i className="bi bi-exclamation-circle"></i>

                <span>
                  {error}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="admin-otp-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="admin-otp-spinner"></span>

                  <span>
                    Verifying...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Verify & Continue
                  </span>

                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>

          </form>

          {/* Security */}
          <div className="admin-otp-footer">

            <i className="bi bi-shield-check"></i>

            <span>
              Your account is protected with additional
              verification.
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}

