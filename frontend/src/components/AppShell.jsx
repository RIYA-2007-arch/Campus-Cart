import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ChatWidget from "./ChatWidget";

const TABS = [
  { to: "/home", label: "Home", icon: "🏠" },
  { to: "/browse", label: "Marketplace", icon: "🛍️" },
  { to: "/categories", label: "Categories", icon: "🗂️" },
  { to: "/wanted", label: "Wanted Board", icon: "📌" },
  { to: "/sell", label: "Sell Items", icon: "➕", highlight: true },
  { to: "/my-ads", label: "My Ads", icon: "📦" },
  { to: "/orders", label: "Orders", icon: "📑" },
  { to: "/wishlist", label: "Wishlist", icon: "♥", isPink: true },
  { to: "/chat", label: "Chat", icon: "💬" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export default function AppShell() {
  const { user, logout, wishlist } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const firstName = (user?.full_name || "Student").split(" ")[0];
  const tabs = user?.role === "admin" ? [...TABS, { to: "/admin", label: "Admin", icon: "🛡️" }] : TABS;

  const handleSearch = (event) => {
    event.preventDefault();
    const text = query.trim();
    navigate(text ? `/browse?q=${encodeURIComponent(text)}` : "/browse");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="cc-app">
      {/* ── Top Header Navigation ── */}
      <header className="cc-topbar">
        <Link to="/home" className="cc-brand-logo" title="CampusCart Home">
          <img
            src="/campuscart-logo.svg"
            alt="CampusCart"
            className="cc-topbar-logo-img"
            style={{ height: "56px", width: "auto", display: "block" }}
          />
        </Link>

        <form className="cc-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books, notes, calculators, laptops, SSDs..."
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <div className="cc-top-actions">
          <NavLink to="/wishlist" className="cc-icon-link" title="Wishlist">
            <span className="cc-pink-heart">♥</span>
            {wishlist.length > 0 && <span className="cc-count">{wishlist.length}</span>}
          </NavLink>
          <div className="cc-user-pill">
            <span className="cc-user-avatar">🎓</span>
            <span className="cc-user">Hi, {firstName}</span>
          </div>
          <button type="button" className="cc-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* ── Horizontal Navigation Bar (Full Width, No Left Border) ── */}
      <nav className="cc-tabs" aria-label="Main navigation">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `cc-tab ${isActive ? "active" : ""} ${tab.highlight ? "highlight-tab" : ""}`}
          >
            <span className={`cc-tab-icon ${tab.isPink ? "pink-heart" : ""}`}>{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Main Page Content Canvas ── */}
      <main className="cc-main">
        <Outlet />
      </main>

      {/* ── Big Screen WhatsApp Dark Theme AI Chatbot ── */}
      <ChatWidget />
    </div>
  );
}
