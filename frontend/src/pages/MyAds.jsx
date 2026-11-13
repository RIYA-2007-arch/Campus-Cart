import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function MyAds() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await api.get("/my/products");
      setItems(response.data.items || []);
    } catch (err) {
      setItems([]);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not connect to backend server. Please verify backend is running on port 5000.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (request) => {
    try {
      const response = await request();
      setMessage({ type: "success", text: response.data.message });
      await load();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Something went wrong." });
    }
  };

  const changeStatus = (item, status) => run(() => api.put(`/products/${item.product_id}`, { status }));

  const editPrice = (item) => {
    const value = window.prompt(`Update price for "${item.product_name}" (in ₹):`, item.price);
    if (value === null || value.trim() === "") return;
    const num = Number(value.trim());
    if (isNaN(num) || num <= 0) {
      window.alert("Please enter a valid price amount.");
      return;
    }
    run(() => api.put(`/products/${item.product_id}`, { price: num }));
  };

  const remove = (item) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${item.product_name}" from CampusCart?`)) return;
    run(() => api.delete(`/products/${item.product_id}`));
  };

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = String(item.product_name || "").toLowerCase();
    const category = String(item.category || "").toLowerCase();
    const desc = String(item.description || "").toLowerCase();
    return name.includes(q) || category.includes(q) || desc.includes(q);
  });

  return (
    <div className="cc-my-ads-container">
      {/* ── Page Header with Professional Writing ── */}
      <div className="cc-ads-header-row">
        <div>
          <h1 className="cc-page-title">My Listed Products</h1>
          <p className="cc-page-subtitle">Track, update prices, and manage handovers for your active college listings.</p>
        </div>
        <Link to="/sell" className="cc-btn-post-new">
          <span>➕</span> Post a New Ad
        </Link>
      </div>

      {/* ── Warm Beige & Off-White Handover Banner (Zero Blue) ── */}
      <div className="cc-sales-handover-banner">
        <div className="cc-sales-banner-content">
          <div className="cc-sales-icon-box">🤝</div>
          <div>
            <strong className="cc-sales-title">Incoming Student Orders &amp; Handover Requests</strong>
            <p className="cc-sales-desc">
              When a student orders your product, you will receive a 6-digit Handover OTP. Verify it under My Sales to complete the safe transaction.
            </p>
          </div>
        </div>
        <Link to="/orders?tab=sales" className="cc-sales-cta-btn">
          Open My Sales &amp; Verify OTP ➔
        </Link>
      </div>

      {message.text && (
        <div className={`cc-alert-box ${message.type}`}>
          <span>{message.type === "success" ? "✓" : "⚠️"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* ── Listings Grid / Cards ── */}
      {loading ? (
        <div className="cc-loading-state">
          <div className="cc-spinner" />
          <p>Loading your campus listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="cc-empty-ads-card">
          <div className="cc-empty-icon">📦</div>
          <h3>No Active Listings Yet</h3>
          <p>You haven't posted any books, electronics, or college items for sale yet. Turn your unused semester items into cash!</p>
          <Link to="/sell" className="cc-btn-post-new" style={{ marginTop: "16px", display: "inline-flex" }}>
            <span>➕</span> Sell Your First Item
          </Link>
        </div>
      ) : (
        <div className="cc-ads-list-wrapper">
          {/* ── My Ads Search Bar ── */}
          <div className="cc-myads-search-row">
            <div className="cc-myads-search-box">
              <span className="cc-myads-search-icon">🔍</span>
              <input
                type="text"
                className="cc-myads-search-input"
                placeholder="Search your listings by product name, category, notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="cc-myads-search-clear"
                  onClick={() => setSearch("")}
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="cc-ads-count-bar">
            <strong>
              Active Inventory ({filteredItems.length} of {items.length} {items.length === 1 ? "Product" : "Products"})
            </strong>
            <span>Verified AKS Student Marketplace</span>
          </div>

          <div className="cc-modern-ads-grid">
            {filteredItems.length === 0 ? (
              <div className="cc-empty-ads-card" style={{ padding: "36px 20px" }}>
                <p style={{ margin: "0 0 10px", color: "#78350f", fontWeight: 700, fontSize: "1rem" }}>
                  No listings found matching "{search}".
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="cc-ad-btn edit"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const sold = String(item.status || "").toLowerCase() === "sold";
                return (
                  <article className={`cc-modern-ad-card ${sold ? "sold-state" : ""}`} key={item.product_id}>
                    <div className="cc-ad-visual">
                      <Link to={`/product/${item.product_id}`}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.product_name} />
                        ) : (
                          <div className="cc-ad-placeholder">
                            {(item.category || "CC").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </Link>
                      <span className={`cc-ad-status-pill ${sold ? "sold" : "active"}`}>
                        {sold ? "✓ Sold Out" : "● Live on Market"}
                      </span>
                    </div>

                    <div className="cc-ad-details">
                      <div className="cc-ad-main-info">
                        <Link to={`/product/${item.product_id}`} className="cc-ad-title-link">
                          <h3>{item.product_name}</h3>
                        </Link>
                        <div className="cc-ad-tags-row">
                          <span className="cc-ad-category-tag">{item.category || "General"}</span>
                          {item.condition && <span className="cc-ad-condition-tag">{item.condition}</span>}
                        </div>
                      </div>

                      <div className="cc-ad-price-display">
                        <span className="cc-ad-current-price">{rupees(item.price)}</span>
                        {Number(item.original_price || 0) > Number(item.price) && (
                          <span className="cc-ad-orig-price">{rupees(item.original_price)}</span>
                        )}
                      </div>

                      {/* Generously spaced action buttons */}
                      <div className="cc-ad-button-group">
                        <button
                          type="button"
                          className="cc-ad-btn edit"
                          onClick={() => editPrice(item)}
                          title="Update listing price"
                        >
                          <span>✏️</span> Edit Price
                        </button>

                        <button
                          type="button"
                          className={`cc-ad-btn ${sold ? "relist" : "mark-sold"}`}
                          onClick={() => changeStatus(item, sold ? "available" : "sold")}
                          title={sold ? "Relist this item on the marketplace" : "Mark as sold to a student"}
                        >
                          {sold ? "🔄 Relist Available" : "✅ Mark as Sold"}
                        </button>

                        <button
                          type="button"
                          className="cc-ad-btn delete"
                          onClick={() => remove(item)}
                          title="Permanently remove listing"
                        >
                          <span>🗑️</span> Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
