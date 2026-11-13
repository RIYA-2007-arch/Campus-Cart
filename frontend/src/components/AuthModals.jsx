import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a14 14 0 01-3 3.8" />
      <path d="M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9.8 9.8 0 004-.9" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PasswordField({ label, value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="password-input-wrap">
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((previous) => !previous)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>
    </div>
  );
}

const MIN_PASSWORD = 8;

export default function AuthModals({ mode, setMode }) {
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerBranch, setRegisterBranch] = useState("");
  const [registerSemester, setRegisterSemester] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpVerified, setForgotOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const clearMessages = () => {
    setAuthMessage("");
    setAuthError("");
  };

  const resetOtpState = () => {
    setOtpCode("");
    setOtpSent(false);
    setEmailVerified(false);
  };

  const switchTo = (next) => {
    clearMessages();
    if (next === "register") resetOtpState();
    if (next === "forgot") {
      setForgotEmail(loginEmail);
      setForgotOtp("");
      setForgotOtpSent(false);
      setForgotOtpVerified(false);
      setNewPassword("");
      setConfirmNewPassword("");
    }
    setMode(next);
  };

  const close = () => {
    clearMessages();
    setMode(null);
  };

  const messageFrom = (error, fallback) => error.response?.data?.message || fallback;

  const handleRegisterEmailChange = (event) => {
    setRegisterEmail(event.target.value);
    resetOtpState();
    clearMessages();
  };

  const handleSendOtp = async () => {
    clearMessages();
    const email = registerEmail.trim().toLowerCase();
    if (!email) {
      setAuthError("Please enter your email address first.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await api.post("/send-otp", { email });
      setOtpSent(true);
      setEmailVerified(false);
      setOtpCode("");
      setAuthMessage(response.data.message || "OTP sent. Please check your email.");
    } catch (error) {
      setAuthError(messageFrom(error, "Unable to send OTP. Please check that the backend is running."));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    clearMessages();
    if (!/^\d{6}$/.test(otpCode)) {
      setAuthError("Please enter the 6-digit OTP.");
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await api.post("/verify-otp", {
        email: registerEmail.trim().toLowerCase(),
        otp: otpCode,
      });
      setEmailVerified(true);
      setAuthMessage(response.data.message || "Email verified successfully.");
    } catch (error) {
      setEmailVerified(false);
      setAuthError(messageFrom(error, "OTP verification failed. Please try again."));
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!registerName.trim() || !registerEmail.trim() || !registerBranch || !registerSemester || !registerPassword || !confirmPassword) {
      setAuthError("Please fill in all fields.");
      return;
    }
    if (!emailVerified) {
      setAuthError("Please verify your email with OTP before creating your account.");
      return;
    }
    if (registerPassword.length < MIN_PASSWORD) {
      setAuthError(`Password must contain at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (registerPassword !== confirmPassword) {
      setAuthError("Password and Confirm Password do not match.");
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await api.post("/register", {
        full_name: registerName.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
        college: "AKS University",
        branch: registerBranch,
        semester: Number(registerSemester),
      });

      setAuthMessage(response.data.message || "Registration successful. You can now login.");
      setLoginEmail(registerEmail.trim().toLowerCase());
      setRegisterName("");
      setRegisterEmail("");
      setRegisterBranch("");
      setRegisterSemester("");
      setRegisterPassword("");
      setConfirmPassword("");
      resetOtpState();

      window.setTimeout(() => {
        setAuthMessage("");
        setMode("login");
      }, 1200);
    } catch (error) {
      setAuthError(messageFrom(error, "Registration failed. Please try again."));
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!loginEmail.trim() || !loginPassword) {
      setAuthError("Please enter your email and password.");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await api.post("/login", {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      setLoginPassword("");
      login(response.data.user, response.data.token);
    } catch (error) {
      setAuthError(messageFrom(error, "Login failed. Please check your email and password."));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotSendOtp = async () => {
    clearMessages();
    const email = forgotEmail.trim().toLowerCase();
    if (!email) {
      setAuthError("Please enter the email address linked to your account.");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await api.post("/forgot-password/send-otp", { email });
      setForgotOtpSent(true);
      setForgotOtpVerified(false);
      setAuthMessage(response.data.message || "Password reset OTP sent.");
    } catch (error) {
      setAuthError(messageFrom(error, "Could not send the reset OTP. Please try again."));
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotVerifyOtp = async () => {
    clearMessages();
    if (!/^\d{6}$/.test(forgotOtp)) {
      setAuthError("Please enter the 6-digit OTP.");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await api.post("/forgot-password/verify-otp", {
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp,
      });
      setForgotOtpVerified(true);
      setAuthMessage(response.data.message || "OTP verified. Set your new password.");
    } catch (error) {
      setAuthError(messageFrom(error, "Could not verify the reset OTP."));
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    clearMessages();

    if (newPassword.length < MIN_PASSWORD) {
      setAuthError(`New password must contain at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAuthError("New password and Confirm Password do not match.");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await api.post("/forgot-password/reset", {
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp,
        new_password: newPassword,
      });
      setAuthMessage(response.data.message || "Password reset successful. Please login.");
      setLoginEmail(forgotEmail.trim().toLowerCase());

      window.setTimeout(() => {
        setAuthMessage("");
        setMode("login");
      }, 1200);
    } catch (error) {
      setAuthError(messageFrom(error, "Password reset failed. Please try again."));
    } finally {
      setForgotLoading(false);
    }
  };

  if (!mode) return null;

  return (
    <>
      {mode === "login" && (
        <div className="modal-overlay" onClick={close}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="login-heading" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>
            <div className="auth-brand-mark">CC</div>
            <p className="auth-eyebrow">AKS UNIVERSITY • STUDENT MARKETPLACE</p>
            <h2 id="login-heading">Welcome Back</h2>
            <p className="modal-subtitle">Sign in to continue to your CampusCart account.</p>

            {authError && <div className="auth-error" role="alert">{authError}</div>}
            {authMessage && <div className="auth-success" role="status">{authMessage}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">College Email</label>
                <input id="login-email" type="email" placeholder="Enter your email address" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} autoComplete="email" required />
              </div>

              <PasswordField
                label="Password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <div className="forgot-row">
                <button type="button" className="text-link" onClick={() => switchTo("forgot")}>Forgot Password?</button>
              </div>

              <button type="submit" className="modal-submit" disabled={loginLoading}>
                {loginLoading ? "Signing In..." : "Sign In to CampusCart"}
              </button>
            </form>

            <div className="auth-divider"><span>NEW TO CAMPUSCART?</span></div>
            <p className="switch-auth">Don't have an account? <button type="button" onClick={() => switchTo("register")}>Join Campus</button></p>
          </section>
        </div>
      )}

      {mode === "register" && (
        <div className="modal-overlay" onClick={close}>
          <section className="modal register-modal" role="dialog" aria-modal="true" aria-labelledby="register-heading" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>
            <div className="auth-brand-mark">CC</div>
            <p className="auth-eyebrow">YOUR CAMPUS. YOUR COMMUNITY.</p>
            <h2 id="register-heading">Join CampusCart</h2>
            <p className="modal-subtitle">Create your verified student marketplace account.</p>

            <div className="verification-note">Verify your email with OTP before creating your student account.</div>
            {authError && <div className="auth-error" role="alert">{authError}</div>}
            {authMessage && <div className="auth-success" role="status">{authMessage}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input id="register-name" type="text" placeholder="Enter your full name" value={registerName} onChange={(event) => setRegisterName(event.target.value)} autoComplete="name" required />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">College Email</label>
                <input id="register-email" type="email" placeholder="Enter your email address" value={registerEmail} onChange={handleRegisterEmailChange} autoComplete="email" required />
              </div>

              {!emailVerified && (
                <button type="button" className="secondary-submit" onClick={handleSendOtp} disabled={otpLoading}>
                  {otpLoading ? "Sending OTP..." : otpSent ? "Resend Verification OTP" : "Send Verification OTP"}
                </button>
              )}

              {otpSent && !emailVerified && (
                <div className="form-group otp-group">
                  <label htmlFor="register-otp">6-Digit Email OTP</label>
                  <input id="register-otp" type="text" inputMode="numeric" maxLength={6} placeholder="Enter OTP received by email" value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))} required />
                  <button type="button" className="secondary-submit" onClick={handleVerifyOtp} disabled={verifyLoading}>
                    {verifyLoading ? "Verifying..." : "Verify Email"}
                  </button>
                </div>
              )}

              {emailVerified && <div className="auth-success">✓ Email verified successfully.</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="register-branch">Branch</label>
                  <select id="register-branch" value={registerBranch} onChange={(event) => setRegisterBranch(event.target.value)} required>
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="AI & ML">AI &amp; ML</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="register-semester">Semester</label>
                  <select id="register-semester" value={registerSemester} onChange={(event) => setRegisterSemester(event.target.value)} required>
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                      <option value={String(semester)} key={semester}>Semester {semester}</option>
                    ))}
                  </select>
                </div>
              </div>

              <PasswordField
                label="Create Password"
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />

              <button type="submit" className="modal-submit" disabled={!emailVerified || registerLoading}>
                {registerLoading ? "Creating Account..." : "Create Student Account"}
              </button>
            </form>

            <p className="switch-auth">Already have an account? <button type="button" onClick={() => switchTo("login")}>Login</button></p>
          </section>
        </div>
      )}

      {mode === "forgot" && (
        <div className="modal-overlay" onClick={close}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="forgot-heading" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>
            <div className="auth-brand-mark">CC</div>
            <p className="auth-eyebrow">ACCOUNT RECOVERY</p>
            <h2 id="forgot-heading">Forgot Password?</h2>
            <p className="modal-subtitle">Recover access to your CampusCart student account.</p>

            {authError && <div className="auth-error" role="alert">{authError}</div>}
            {authMessage && <div className="auth-success" role="status">{authMessage}</div>}

            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="forgot-email">Registered Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(event) => {
                    setForgotEmail(event.target.value);
                    setForgotOtpSent(false);
                    setForgotOtpVerified(false);
                    setForgotOtp("");
                    clearMessages();
                  }}
                  autoComplete="email"
                  required
                />
              </div>

              {!forgotOtpVerified && (
                <button type="button" className="secondary-submit" onClick={handleForgotSendOtp} disabled={forgotLoading}>
                  {forgotLoading ? "Please Wait..." : forgotOtpSent ? "Resend Reset OTP" : "Send Reset OTP"}
                </button>
              )}

              {forgotOtpSent && !forgotOtpVerified && (
                <div className="form-group">
                  <label htmlFor="forgot-otp">Reset OTP</label>
                  <input id="forgot-otp" type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" value={forgotOtp} onChange={(event) => setForgotOtp(event.target.value.replace(/\D/g, ""))} required />
                  <button type="button" className="secondary-submit" onClick={handleForgotVerifyOtp} disabled={forgotLoading}>
                    {forgotLoading ? "Verifying..." : "Verify Reset OTP"}
                  </button>
                </div>
              )}

              {forgotOtpVerified && (
                <>
                  <PasswordField label="New Password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
                  <PasswordField label="Confirm New Password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} placeholder="Re-enter new password" autoComplete="new-password" />
                  <button type="submit" className="modal-submit" disabled={forgotLoading}>
                    {forgotLoading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </>
              )}
            </form>

            <p className="switch-auth"><button type="button" onClick={() => switchTo("login")}>← Back to Login</button></p>
          </section>
        </div>
      )}
    </>
  );
}