import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import "./auth-page.css";

const MIN_PASSWORD = 8;

const BRANCH_OPTIONS = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Mining Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Agriculture & Horticulture",
  "Pharmacy",
  "Management (BBA / MBA)",
  "Biotechnology",
  "Other",
];

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a14 14 0 01-3 3.8" />
      <path d="M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9.8 9.8 0 004-.9" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function AuthPage({ initialMode = "login" }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: "login", "register", "forgot"
  const [mode, setMode] = useState(initialMode);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (location.pathname === "/register") setMode("register");
    else if (location.pathname === "/forgot-password") setMode("forgot");
    else if (location.pathname === "/login") setMode("login");
  }, [location.pathname]);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerBranch, setRegisterBranch] = useState("");
  const [registerSemester, setRegisterSemester] = useState("1");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // OTP states
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpVerified, setForgotOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (user) return <Navigate to="/home" replace />;

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const switchMode = (nextMode) => {
    clearMessages();
    setMode(nextMode);
    if (nextMode === "login") navigate("/login");
    else if (nextMode === "register") {
      setOtpCode("");
      setOtpSent(false);
      setEmailVerified(false);
      navigate("/register");
    } else if (nextMode === "forgot") {
      setForgotEmail(loginEmail);
      setForgotOtp("");
      setForgotOtpSent(false);
      setForgotOtpVerified(false);
      navigate("/forgot-password");
    }
  };

  const messageFrom = (error, fallback) => error.response?.data?.message || fallback;

  // Handle Verify Mail / Send OTP (Registration)
  const handleVerifyMail = async () => {
    clearMessages();
    const email = registerEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg("Please enter your college email address first.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await api.post("/send-otp", { email });
      setOtpSent(true);
      setEmailVerified(false);
      setOtpCode("");
      setSuccessMsg(response.data.message || "OTP code sent to your email. Enter below to verify.");
    } catch (err) {
      setErrorMsg(messageFrom(err, "Unable to verify email right now. Please try again."));
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Confirm OTP (Registration)
  const handleConfirmOtp = async () => {
    clearMessages();
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setErrorMsg("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/verify-otp", {
        email: registerEmail.trim().toLowerCase(),
        otp: otpCode.trim(),
      });
      setEmailVerified(true);
      setSuccessMsg(response.data.message || "Email verified successfully! You can now create your account.");
    } catch (err) {
      setEmailVerified(false);
      setErrorMsg(messageFrom(err, "Invalid OTP code. Please enter the correct code sent to your email."));
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!registerName.trim() || !registerEmail.trim() || !registerBranch || !registerSemester || !registerPassword || !confirmPassword) {
      setErrorMsg("Please fill in all the required fields.");
      return;
    }
    if (!emailVerified) {
      setErrorMsg("Please click 'Verify Mail' and enter the OTP code before registering.");
      return;
    }
    if (registerPassword.length < MIN_PASSWORD) {
      setErrorMsg(`Password must be at least ${MIN_PASSWORD} characters long.`);
      return;
    }
    if (registerPassword !== confirmPassword) {
      setErrorMsg("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/register", {
        full_name: registerName.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
        college: "AKS University",
        branch: registerBranch,
        semester: Number(registerSemester),
      });

      setSuccessMsg(response.data.message || "Account created successfully! Redirecting to login...");
      setLoginEmail(registerEmail.trim().toLowerCase());
      setTimeout(() => {
        switchMode("login");
      }, 1400);
    } catch (err) {
      setErrorMsg(messageFrom(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg("Please enter both your college email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      const { token, user } = response.data;
      login(token, user);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect") || "/home";
      navigate(redirect, { replace: true });
    } catch (err) {
      setErrorMsg(messageFrom(err, "Invalid email or password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password - Verify Mail
  const handleForgotVerifyMail = async () => {
    clearMessages();
    const email = forgotEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg("Please enter your registered college email address.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await api.post("/forgot-password/send-otp", { email });
      setForgotOtpSent(true);
      setForgotOtpVerified(false);
      setForgotOtp("");
      setSuccessMsg(response.data.message || "OTP sent to your email. Enter it below to reset password.");
    } catch (err) {
      setErrorMsg(messageFrom(err, "Unable to send reset code."));
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Forgot Password - Confirm OTP
  const handleForgotConfirmOtp = async () => {
    clearMessages();
    if (!/^\d{6}$/.test(forgotOtp.trim())) {
      setErrorMsg("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/forgot-password/verify-otp", {
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp.trim(),
      });
      setForgotOtpVerified(true);
      setSuccessMsg(response.data.message || "OTP verified! Please enter your new password.");
    } catch (err) {
      setForgotOtpVerified(false);
      setErrorMsg(messageFrom(err, "Invalid OTP code. Please check and try again."));
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!newPassword || !confirmNewPassword) {
      setErrorMsg("Please enter and confirm your new password.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD) {
      setErrorMsg(`Password must be at least ${MIN_PASSWORD} characters long.`);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/forgot-password/reset", {
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp.trim(),
        new_password: newPassword,
      });

      setSuccessMsg(response.data.message || "Password updated successfully! Please login with your new password.");
      setLoginEmail(forgotEmail.trim().toLowerCase());
      setTimeout(() => {
        switchMode("login");
      }, 1400);
    } catch (err) {
      setErrorMsg(messageFrom(err, "Failed to reset password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-roman-page">
      {/* Background: Crystal Clear AKS University Campus Building Photo (NO BLUR) */}
      <div className="auth-campus-photo-layer" />
      <div className="auth-clear-light-overlay" />

      {/* Top Header: Official Logo on Left, Navigation on Right */}
      <header className="auth-top-navbar">
        <Link to="/" className="auth-official-brand" aria-label="CampusCart Home">
          <img src="/campuscart-logo.svg" alt="CampusCart AKS University" className="auth-official-logo" />
        </Link>

        <nav className="auth-nav-menu">
          <Link to="/" className="auth-nav-link">HOME</Link>
          <Link to="/#categories" className="auth-nav-link">CATEGORIES</Link>
          <Link to="/#about" className="auth-nav-link">ABOUT US</Link>
          <Link to="/#safety" className="auth-nav-link">CONTACT</Link>

          <button
            type="button"
            className={`auth-nav-link ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            LOG IN
          </button>
          <button
            type="button"
            className={`auth-nav-link ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            SIGN UP
          </button>
        </nav>
      </header>

      {/* Center Stage: Floating Light-Themed Roman Card */}
      <main className="auth-center-stage">
        <div className="auth-roman-card">
          {/* Card Title & Subtitle in Roman Writing */}
          <div className="auth-card-head">
            <h1 className="auth-roman-title">
              {mode === "login" ? "Log In" : mode === "register" ? "Sign Up" : "Reset Password"}
            </h1>
            <p className="auth-roman-sub">
              {mode === "login"
                ? "AKS University Student Marketplace"
                : mode === "register"
                ? "Join the Verified Campus Marketplace"
                : "Reset Your Account Password"}
            </p>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="auth-roman-alert error" role="alert">
              <span>⚠️</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="auth-roman-alert success" role="status">
              <span>✅</span> {successMsg}
            </div>
          )}

          {/* ================= 1. LOGIN MODE ================= */}
          {mode === "login" && (
            <form className="auth-card-form" onSubmit={handleLogin}>
              {/* Email Field with Mail Label & Icon */}
              <div className="auth-input-group">
                <label className="auth-roman-label">College Email Address</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Enter your college email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                    className="auth-roman-input"
                  />
                </div>
              </div>

              {/* Password Field with Lock Icon */}
              <div className="auth-input-group">
                <label className="auth-roman-label">Password</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="auth-roman-input"
                  />
                  <button
                    type="button"
                    className="auth-eye-toggle"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    <EyeIcon visible={showLoginPassword} />
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="auth-options-row">
                <label className="auth-remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => switchMode("forgot")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Royal Navy / Blue Action Button */}
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              {/* Switch link */}
              <div className="auth-switch-row">
                <span>or</span>{" "}
                <button
                  type="button"
                  className="auth-switch-text-btn"
                  onClick={() => switchMode("register")}
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* ================= 2. SIGN UP / REGISTER MODE ================= */}
          {mode === "register" && (
            <form className="auth-card-form" onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="auth-input-group">
                <label className="auth-roman-label">Full Name</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    autoFocus
                    className="auth-roman-input"
                  />
                </div>
              </div>

              {/* Branch (full width) */}
              <div className="auth-input-group">
                <label className="auth-roman-label">Branch / Department</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">🎓</span>
                  <select
                    value={registerBranch}
                    onChange={(e) => setRegisterBranch(e.target.value)}
                    required
                    className="auth-roman-select"
                  >
                    <option value="">Select Branch</option>
                    {BRANCH_OPTIONS.map((branch) => (
                      <option key={branch} value={branch.split(" (")[0]}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semester (full width, compact) */}
              <div className="auth-input-group">
                <label className="auth-roman-label">Semester</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">📚</span>
                  <select
                    value={registerSemester}
                    onChange={(e) => setRegisterSemester(e.target.value)}
                    required
                    className="auth-roman-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* College Email with "Verify Mail" Button */}
              <div className="auth-input-group">
                <label className="auth-roman-label">College Email Address</label>
                <div className="auth-roman-input-wrap has-action">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Enter your college email"
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      setOtpSent(false);
                      setEmailVerified(false);
                    }}
                    required
                    disabled={emailVerified}
                    className="auth-roman-input"
                  />
                  <button
                    type="button"
                    className="auth-verify-action-btn"
                    onClick={handleVerifyMail}
                    disabled={otpLoading || emailVerified || !registerEmail.trim()}
                  >
                    {otpLoading ? "Verifying..." : otpSent ? "Resend Mail" : "Verify Mail"}
                  </button>
                </div>
              </div>

              {/* OTP Field (Shown after clicking Verify Mail) */}
              {otpSent && !emailVerified && (
                <div className="auth-input-group otp-active-group">
                  <label className="auth-roman-label" style={{ color: "#92400E" }}>
                    Enter 6-Digit Email OTP Code
                  </label>
                  <div className="auth-roman-input-wrap has-action">
                    <span className="auth-input-icon">🔢</span>
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="auth-roman-input otp-mono"
                    />
                    <button
                      type="button"
                      className="auth-verify-action-btn submit-otp"
                      onClick={handleConfirmOtp}
                      disabled={loading || otpCode.length !== 6}
                    >
                      Confirm OTP
                    </button>
                  </div>
                </div>
              )}

              {emailVerified && (
                <div className="auth-verified-pill">
                  <span>✓</span> Email verified successfully
                </div>
              )}

              {/* Password */}
              <div className="auth-input-group">
                <label className="auth-roman-label">Password</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={MIN_PASSWORD}
                    className="auth-roman-input"
                  />
                  <button
                    type="button"
                    className="auth-eye-toggle"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                  >
                    <EyeIcon visible={showRegisterPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="auth-input-group">
                <label className="auth-roman-label">Confirm Password</label>
                <div className="auth-roman-input-wrap">
                  <span className="auth-input-icon">🛡️</span>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={MIN_PASSWORD}
                    className="auth-roman-input"
                  />
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading || !emailVerified}
              >
                {loading ? "Creating Account..." : "Create Student Account"}
              </button>

              {/* Switch link */}
              <div className="auth-switch-row">
                <span>Already have an account?</span>{" "}
                <button
                  type="button"
                  className="auth-switch-text-btn"
                  onClick={() => switchMode("login")}
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* ================= 3. FORGOT PASSWORD MODE ================= */}
          {mode === "forgot" && (
            <form className="auth-card-form" onSubmit={handleResetPassword}>
              <div className="auth-input-group">
                <label className="auth-roman-label">Registered College Email</label>
                <div className="auth-roman-input-wrap has-action">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Enter registered email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={forgotOtpVerified}
                    className="auth-roman-input"
                  />
                  <button
                    type="button"
                    className="auth-verify-action-btn"
                    onClick={handleForgotVerifyMail}
                    disabled={otpLoading || forgotOtpVerified || !forgotEmail.trim()}
                  >
                    {otpLoading ? "Verifying..." : forgotOtpSent ? "Resend Mail" : "Verify Mail"}
                  </button>
                </div>
              </div>

              {forgotOtpSent && !forgotOtpVerified && (
                <div className="auth-input-group otp-active-group">
                  <label className="auth-roman-label" style={{ color: "#1e3a8a" }}>
                    Enter 6-Digit Email OTP Code
                  </label>
                  <div className="auth-roman-input-wrap has-action">
                    <span className="auth-input-icon">🔢</span>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                      className="auth-roman-input otp-mono"
                    />
                    <button
                      type="button"
                      className="auth-verify-action-btn submit-otp"
                      onClick={handleForgotConfirmOtp}
                      disabled={loading || forgotOtp.length !== 6}
                    >
                      Confirm OTP
                    </button>
                  </div>
                </div>
              )}

              {forgotOtpVerified && (
                <>
                  <div className="auth-verified-pill">
                    <span>✓</span> Identity verified. Enter your new password below:
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-roman-label">New Password</label>
                    <div className="auth-roman-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        placeholder="Enter new password (min 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={MIN_PASSWORD}
                        className="auth-roman-input"
                      />
                      <button
                        type="button"
                        className="auth-eye-toggle"
                        onClick={() => setShowForgotNewPassword((prev) => !prev)}
                      >
                        <EyeIcon visible={showForgotNewPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-roman-label">Confirm New Password</label>
                    <div className="auth-roman-input-wrap">
                      <span className="auth-input-icon">🛡️</span>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        minLength={MIN_PASSWORD}
                        className="auth-roman-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-primary-btn"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password & Log In"}
                  </button>
                </>
              )}

              <div className="auth-switch-row">
                <button
                  type="button"
                  className="auth-switch-text-btn"
                  onClick={() => switchMode("login")}
                >
                  ← Back to Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
