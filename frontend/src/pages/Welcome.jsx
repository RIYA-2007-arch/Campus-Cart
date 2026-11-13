import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./welcome.css";

const CATEGORIES_DATA = [
  {
    icon: "📚",
    title: "Books & Notes",
    desc: "B.Tech, Mining, Agriculture, Pharmacy & MBA semester books.",
    tag: "DBMS • Maths • Python",
    color: "cyan",
  },
  {
    icon: "🧮",
    title: "Calculators",
    desc: "Verified scientific calculators for engineering exams.",
    tag: "Casio 991EX • 991ES Plus",
    color: "yellow",
  },
  {
    icon: "🤖",
    title: "IoT & Lab Gear",
    desc: "Microcontrollers, sensor kits, breadboards, jumper wires.",
    tag: "Arduino • ESP32 • Sensors",
    color: "emerald",
  },
  {
    icon: "🥼",
    title: "Lab Coats & Kits",
    desc: "White lab coats, engineering mini-drafters, geometry tools.",
    tag: "Lab Coat (M/L) • Drafter",
    color: "purple",
  },
  {
    icon: "🎒",
    title: "Hostel Essentials",
    desc: "Laptop bags, study lamps, kettles, induction cooktops.",
    tag: "15.6\" Bag • Induction • Lamp",
    color: "orange",
  },
  {
    icon: "🏸",
    title: "Sports & Fitness",
    desc: "Badminton rackets, cricket bats, gym gear & balls.",
    tag: "Yonex • Cricket • Weights",
    color: "pink",
  },
];

const STEPS_DATA = [
  {
    step: "01",
    title: "Register & Verify",
    desc: "Sign up with college email and verify with quick 6-digit OTP.",
    icon: "✉️",
    glowClass: "step-glow-cyan",
  },
  {
    step: "02",
    title: "Post Ad in 60s",
    desc: "Snap a quick photo, set asking price, and list on campus feed.",
    icon: "📸",
    glowClass: "step-glow-emerald",
  },
  {
    step: "03",
    title: "Direct In-App Chat",
    desc: "Buyers message directly to agree on price and meetup spot.",
    icon: "💬",
    glowClass: "step-glow-purple",
  },
  {
    step: "04",
    title: "Meetup on Campus",
    desc: "Meet safely at Library or Canteen to inspect the item in person.",
    icon: "🤝",
    glowClass: "step-glow-orange",
  },
  {
    step: "05",
    title: "Handover OTP & Pay",
    desc: "Buyer shares 6-digit OTP after checking item. Pay direct UPI/Cash.",
    icon: "🔐",
    glowClass: "step-glow-yellow",
  },
];

const STATS = [
  { value: "100%", label: "AKS Students", color: "cyan" },
  { value: "₹0", label: "Commission Fee", color: "yellow" },
  { value: "6-Digit", label: "Handover OTP", color: "emerald" },
  { value: "24/7", label: "Campus Chat", color: "purple" },
];

export default function Welcome() {
  const { user } = useAuth();

  // Theme state: "bright" (default) or "dark", saved in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("campuscart_welcome_theme") || "bright";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "bright" ? "dark" : "bright";
    setTheme(nextTheme);
    localStorage.setItem("campuscart_welcome_theme", nextTheme);
  };

  // If already authenticated, redirect straight to marketplace
  if (user) return <Navigate to="/home" replace />;

  const isDark = theme === "dark";
  const currentLogo = isDark ? "/campuscart-logo-bright.svg" : "/campuscart-logo.svg";

  return (
    <div className={`wlc-page theme-${theme}`}>
      {/* ── Fixed Real AKS Campus Background Layer ── */}
      <div className="wlc-campus-bg" />
      <div className="wlc-ambient-overlay" />

      {/* ── Floating Top Navigation ── */}
      <header className="wlc-navbar">
        <Link to="/" className="wlc-nav-brand" aria-label="CampusCart Home">
          <img src={currentLogo} alt="CampusCart AKS University" className="wlc-nav-logo" />
        </Link>

        <nav className="wlc-nav-links">
          <a href="#how-it-works" className="wlc-nav-item">How It Works</a>
          <a href="#categories" className="wlc-nav-item">Categories</a>
          <a href="#safety" className="wlc-nav-item">Safety</a>
        </nav>

        <div className="wlc-nav-buttons">
          <Link to="/login" className="wlc-nav-btn-login">Log In</Link>
          <Link to="/register" className="wlc-nav-btn-join">Join Campus →</Link>
        </div>
      </header>

      {/* ── Hero Section with Big Glowing Logo & Color Light Effects ── */}
      <main className="wlc-hero-section">
        {/* Glowing Campus Tag */}
        <div className="wlc-hero-badge">
          <span className="wlc-badge-dot" />
          <span>VERIFIED STUDENT MARKETPLACE • AKS UNIVERSITY, SATNA</span>
        </div>

        {/* Big Yellow Glowing Logo Container */}
        <div className="wlc-hero-logo-box">
          <div className="wlc-logo-neon-glow" />
          <img
            src={currentLogo}
            alt="CampusCart Logo"
            className="wlc-hero-big-logo"
          />
        </div>

        {/* Short & Punchy Hero Headline */}
        <h1 className="wlc-hero-heading">
          Buy Smart. Sell Easy. <span className="wlc-heading-gold">Reuse on Campus.</span>
        </h1>

        <p className="wlc-hero-subtitle">
          Exchange books, Casio calculators, lab tools &amp; hostel gear directly with AKS students.
          Zero delivery charges, zero commission fees.
        </p>

        {/* Primary Call to Actions */}
        <div className="wlc-hero-cta-row">
          <Link to="/register" className="wlc-cta-btn-gold">
            <span>✨</span> Join Campus (Sign Up Free) ➔
          </Link>
          <Link to="/home" className="wlc-cta-btn-glass">
            <span>🛍️</span> Explore Marketplace
          </Link>
          <Link to="/login" className="wlc-cta-btn-subtle">
            <span>🔑</span> Student Log In
          </Link>
        </div>

        {/* Shimmering Trust Stats Bar */}
        <div className="wlc-stats-grid">
          {STATS.map((s, idx) => (
            <div className={`wlc-stat-box stat-${s.color}`} key={idx}>
              <div className="wlc-stat-val">{s.value}</div>
              <div className="wlc-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* ── How It Works: 5 Steps in Separate Glowing Color Boxes ── */}
      <section className="wlc-section" id="how-it-works">
        <div className="wlc-section-header">
          <div className="wlc-section-pill">HOW IT WORKS</div>
          <h2 className="wlc-section-title">5 Easy Steps to Trade on Campus</h2>
          <p className="wlc-section-sub">Simple, peer-to-peer, physical handover verified by OTP.</p>
        </div>

        <div className="wlc-steps-container">
          {STEPS_DATA.map((step, idx) => (
            <div className={`wlc-step-box ${step.glowClass}`} key={idx}>
              <div className="wlc-step-top">
                <span className="wlc-step-num">{step.step}</span>
                <span className="wlc-step-icon">{step.icon}</span>
              </div>
              <h3 className="wlc-step-title">{step.title}</h3>
              <p className="wlc-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories: Colorful Neon Cards ── */}
      <section className="wlc-section" id="categories">
        <div className="wlc-section-header">
          <div className="wlc-section-pill">CAMPUS CATEGORIES</div>
          <h2 className="wlc-section-title">What AKS Students Buy &amp; Sell</h2>
          <p className="wlc-section-sub">Save up to 70% compared to new retail prices.</p>
        </div>

        <div className="wlc-cat-grid">
          {CATEGORIES_DATA.map((cat, idx) => (
            <div className={`wlc-cat-card card-glow-${cat.color}`} key={idx}>
              <div className="wlc-cat-icon">{cat.icon}</div>
              <div className="wlc-cat-info">
                <h3 className="wlc-cat-title">{cat.title}</h3>
                <p className="wlc-cat-desc">{cat.desc}</p>
                <div className="wlc-cat-tag">{cat.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Campus Safety & Handover OTP Highlight ── */}
      <section className="wlc-section" id="safety">
        <div className="wlc-safety-neon-box">
          <div className="wlc-safety-left">
            <span className="wlc-safety-badge">🛡️ TRUST &amp; SECURITY</span>
            <h2 className="wlc-safety-title">
              Safe In-Person Handover <span className="wlc-text-gold">with 6-Digit OTP</span>
            </h2>
            <p className="wlc-safety-desc">
              No online scams or advance payments. Pay with Cash or UPI only after you hold and check the item!
            </p>

            <div className="wlc-safety-points">
              <div className="wlc-point-row">
                <span className="wlc-check-badge">✓</span>
                <div>
                  <strong>Mandatory Physical Inspection</strong>
                  <span>Test calculators, inspect book pages, verify lab gear in person.</span>
                </div>
              </div>
              <div className="wlc-point-row">
                <span className="wlc-check-badge">✓</span>
                <div>
                  <strong>Secure 6-Digit Handover OTP</strong>
                  <span>Buyer gives OTP to seller only after confirming everything is fine.</span>
                </div>
              </div>
              <div className="wlc-point-row">
                <span className="wlc-check-badge">✓</span>
                <div>
                  <strong>Safe Campus Meetup Spots</strong>
                  <span>Central Library, Canteen, or Main University Gate during daytime.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="wlc-safety-protocol-card">
            <div className="wlc-protocol-title">⚡ Safe Meetup Protocol</div>
            <div className="wlc-protocol-list">
              <div className="wlc-protocol-item">
                <span className="wlc-proto-label">Safe Zones</span>
                <span className="wlc-proto-val gold">Library &amp; Canteen</span>
              </div>
              <div className="wlc-protocol-item">
                <span className="wlc-proto-label">Timing</span>
                <span className="wlc-proto-val cyan">Campus Daylight Hours</span>
              </div>
              <div className="wlc-protocol-item">
                <span className="wlc-proto-label">Payment</span>
                <span className="wlc-proto-val emerald">Direct UPI or Cash</span>
              </div>
              <div className="wlc-protocol-item">
                <span className="wlc-proto-label">Platform Cut</span>
                <span className="wlc-proto-val yellow">₹0 (Zero Commission)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Call To Action ── */}
      <section className="wlc-cta-section">
        <div className="wlc-cta-card">
          <div className="wlc-cta-glow-ring" />
          <h2 className="wlc-cta-title">Ready to Start Saving &amp; Selling?</h2>
          <p className="wlc-cta-sub">
            Join hundreds of AKS University students already using CampusCart.
          </p>
          <div className="wlc-cta-actions">
            <Link to="/register" className="wlc-cta-btn-gold">
              Join Campus Now ➔
            </Link>
            <Link to="/login" className="wlc-cta-btn-outline">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="wlc-footer">
        <div className="wlc-footer-inner">
          <div className="wlc-footer-brand">
            <img src={currentLogo} alt="CampusCart" className="wlc-footer-logo" />
            <p>Peer-to-Peer Student Marketplace • AKS University, Satna (M.P.)</p>
          </div>

          <div className="wlc-footer-links">
            <Link to="/login">Student Login</Link>
            <Link to="/register">Create Account</Link>
            <a href="#how-it-works">How It Works</a>
            <a href="#safety">Safety Protocol</a>
          </div>
        </div>

        <div className="wlc-footer-bottom">
          <span>© 2026 CampusCart AKS University. All rights reserved.</span>
          <span className="wlc-footer-tag">Official Verified Marketplace • v2.0</span>
        </div>
      </footer>

      {/* ── Floating Bottom-Right Theme Switcher (Dark / Bright) ── */}
      <div className="wlc-theme-switcher-container">
        <button
          type="button"
          onClick={toggleTheme}
          className="wlc-theme-switcher-btn"
          aria-label="Toggle Bright / Dark Theme"
          title={isDark ? "Switch to Bright Mode" : "Switch to Dark Neon Mode"}
        >
          <span className="wlc-theme-btn-icon">{isDark ? "☀️" : "🌙"}</span>
          <span className="wlc-theme-btn-label">{isDark ? "Bright Mode" : "Dark Mode"}</span>
          <span className="wlc-theme-btn-badge">{isDark ? "LIGHT" : "DARK"}</span>
        </button>
      </div>
    </div>
  );
}
