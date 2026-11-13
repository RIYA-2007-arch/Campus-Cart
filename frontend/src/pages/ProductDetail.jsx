import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import { timeAgo } from "../timeAgo";
import ChatPanel from "../components/ChatPanel";
import ProductCard from "../components/ProductCard";
import UpiPaymentModal from "../components/UpiPaymentModal";
import OrderModal from "../components/OrderModal";

const REPORT_REASONS = ["fraud", "fake product", "wrong information", "inappropriate", "already sold", "other"];
const QUICK_MESSAGES = ["Is this still available?", "What is your last price?", "Can we meet on campus?"];

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ProductDetail() {
  const { id } = useParams();
  const { user, wishlistIds, toggleWishlist } = useAuth();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatNotice, setChatNotice] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("fraud");
  const [reportDetails, setReportDetails] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportError, setReportError] = useState("");
  const [shared, setShared] = useState(false);
  const [handoverOtp, setHandoverOtp] = useState("");
  const [handoverLoading, setHandoverLoading] = useState(false);
  const [handoverNotice, setHandoverNotice] = useState("");
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    setLoading(true);
    setShowChat(false);
    setChatNotice("");
    window.scrollTo(0, 0);

    api.get(`/products/${id}/detail`)
      .then((response) => {
        setProduct(response.data.product);
        setError("");
      })
      .catch((err) => setError(err.response?.data?.message || "Product could not be loaded."))
      .finally(() => setLoading(false));

    api.get(`/products/${id}/similar`)
      .then((response) => setSimilar(response.data.items || []))
      .catch(() => setSimilar([]));

    if (user) {
      api.get("/orders/my-purchases")
        .then((res) => {
          const list = res.data?.orders || [];
          const current = list.find(
            (o) => Number(o.product_id) === Number(id) && String(o.status).toLowerCase() === "pending"
          );
          if (current) {
            setActiveOrder(current);
            if (current.otp) setHandoverOtp(current.otp);
          }
        })
        .catch(() => {});
    }
  }, [id, user]);

  if (loading) return <p className="cc-empty">Loading product...</p>;

  if (error || !product) {
    return (
      <div className="cc-empty-card">
        <p>{error || "Product not found."}</p>
        <Link to="/home" className="cc-primary-link">Back to products</Link>
      </div>
    );
  }

  const productId = Number(product.product_id);
  const price = Number(product.price || 0);
  const original = Number(product.original_price || 0);
  const liked = wishlistIds.has(productId);
  const sold = String(product.status || "").toLowerCase() === "sold";
  const isOwner = Number(user?.user_id) === Number(product.seller_id);
  const meetupMatch = product.description?.match(/📍 Preferred Campus Meetup:?\s*([^\n\r]+)/);
  const campusMeetup = meetupMatch ? meetupMatch[1].trim() : "Central Library Lawn (AKS University)";
  const cleanDescription = product.description ? product.description.replace(/📍 Preferred Campus Meetup:?[^\n\r]+/g, "").trim() : "";

  const details = [
    ["Category", product.category],
    ["Branch", product.branch],
    ["Semester", product.semester ? `Semester ${product.semester}` : ""],
    ["Subject", product.subject],
    ["Author", product.author],
    ["Edition", product.edition],
    ["Campus", product.college],
    ["Posted", timeAgo(product.created_at)],
    ["Ad ID", `#${productId}`],
  ].filter(([, value]) => value);

  const handleHeart = async () => {
    const problem = await toggleWishlist(productId);
    if (problem) window.alert(problem);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      window.prompt("Copy this link", window.location.href);
    }
  };

  const sendQuick = async (message) => {
    try {
      await api.post("/chat/messages", {
        product_id: productId,
        receiver_id: Number(product.seller_id),
        message,
      });
      setChatNotice("Message sent. Replies also appear in the Chat tab.");
    } catch (err) {
      setChatNotice(err.response?.data?.message || "Could not send the message.");
    }
  };

  const handleRequestHandoverOtp = async () => {
    setHandoverLoading(true);
    setHandoverNotice("");
    try {
      const res = await api.post("/orders/create", { product_id: productId });
      setHandoverOtp(res.data.otp || "");
      setHandoverNotice(res.data.message || "Handover OTP generated! Share this code with the seller only after receiving the product and confirming payment.");
    } catch (err) {
      setHandoverNotice(err.response?.data?.message || "Could not generate handover OTP.");
    } finally {
      setHandoverLoading(false);
    }
  };

  const handleReport = async (event) => {
    event.preventDefault();
    setReportMessage("");
    setReportError("");
    try {
      const response = await api.post("/reports", {
        product_id: productId,
        reason: reportReason,
        details: reportDetails,
      });
      setReportMessage(response.data.message || "Report submitted.");
      setReportDetails("");
    } catch (err) {
      setReportError(err.response?.data?.message || "Could not submit the report.");
    }
  };

  return (
    <div>
      <p className="cc-crumbs">
        <Link to="/home">Home</Link> › <Link to={`/browse?category=${encodeURIComponent(product.category || "")}`}>{product.category}</Link> › {product.product_name}
      </p>

      <div className="cc-detail">
        <div className="cc-detail-image">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const next = e.currentTarget.nextElementSibling;
                if (next) next.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            className="cc-card-placeholder"
            style={{ display: product.image_url ? 'none' : 'flex' }}
          >
            {(product.category || "CC").slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="cc-detail-info">
          <div className="cc-detail-tags">
            {product.condition && <span className="cc-badge static">{product.condition}</span>}
            {sold && <span className="cc-badge static sold">Sold</span>}
          </div>

          <h1 className="cc-page-title">{product.product_name}</h1>

          <div className="cc-price-row">
            <span className="cc-price big">{rupees(price)}</span>
            {original > price && <span className="cc-original">{rupees(original)}</span>}
            {original > price && <span className="cc-save">Save {rupees(original - price)}</span>}
          </div>

          <dl className="cc-profile-list">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {cleanDescription && <p className="cc-description">{cleanDescription}</p>}

          <Link to={`/seller/${product.seller_id}`} className="cc-seller-box cc-seller-link">
            <span className="cc-avatar small">{(product.seller_name || "S").slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{product.seller_name}</strong>
              <p>{[product.seller_branch, product.seller_semester ? `Semester ${product.seller_semester}` : ""].filter(Boolean).join(" • ") || "Campus seller"} · View all ads</p>
            </div>
          </Link>

          {/* DEDICATED CAMPUS ORDERING & BUY PANEL */}
          <div className="cc-order-purchase-card">
            <div className="cc-order-card-top">
              <div className="cc-order-price-badge">
                <span className="cc-price-large">{rupees(price)}</span>
                {original > price && (
                  <span className="cc-original-price">
                    MRP {rupees(original)} <span className="cc-save-pill">Save {rupees(original - price)}</span>
                  </span>
                )}
              </div>
              <div className="cc-handover-assurance-tag">
                <span style={{ fontSize: "16px" }}>🛡️</span>
                <span>AKS University Safe Handover</span>
              </div>
            </div>

            <div className="cc-order-meetup-note">
              📍 <strong>Campus Pickup:</strong> {campusMeetup}
            </div>

            {/* ORDER CTA BUTTON */}
            {isOwner ? (
              <div className="cc-owner-badge">
                <span>🏷️ You listed this item for sale</span>
                <Link to="/my-ads" className="cc-btn secondary small">Manage in My Ads</Link>
              </div>
            ) : sold ? (
              <div className="cc-sold-badge-box">
                <span style={{ fontSize: "24px" }}>❌</span>
                <div>
                  <strong>Item Already Sold</strong>
                  <p>This item has already been purchased by another student and marked as sold.</p>
                </div>
              </div>
            ) : activeOrder ? (
              <div className="cc-active-order-highlight">
                <div className="cc-active-order-header">
                  <div>
                    <span className="cc-status-pill">Active Order #{activeOrder.order_id}</span>
                    <h4>Your 6-Digit Handover OTP is Ready</h4>
                  </div>
                  <button
                    type="button"
                    className="cc-btn primary small"
                    onClick={() => setShowOrderModal(true)}
                  >
                    View Receipt / Slip 🧾
                  </button>
                </div>

                <div className="cc-otp-highlight-box">
                  <span className="cc-otp-digits">{activeOrder.otp || activeOrder.otp_plain || handoverOtp || "------"}</span>
                  <button
                    type="button"
                    className="cc-copy-otp-btn"
                    onClick={() => {
                      const code = activeOrder.otp || activeOrder.otp_plain || handoverOtp;
                      if (code) {
                        navigator.clipboard.writeText(code);
                        setChatNotice("OTP copied to clipboard!");
                        setTimeout(() => setChatNotice(""), 2000);
                      }
                    }}
                  >
                    📋 Copy OTP
                  </button>
                </div>

                <p className="cc-otp-safety-rule">
                  👉 <strong>Safe Handover Rule:</strong> Share this OTP with <strong>{product.seller_name}</strong> ONLY after meeting on campus, inspecting the item physically, and paying via Cash or direct UPI.
                </p>

                <div className="cc-active-order-actions">
                  <Link to="/orders" className="cc-btn secondary small" style={{ textDecoration: "none" }}>
                    📑 Track in My Orders
                  </Link>
                  <button
                    type="button"
                    className="cc-btn ghost small"
                    onClick={() => setShowChat(true)}
                  >
                    💬 Message Seller to Meet
                  </button>
                </div>
              </div>
            ) : (
              <div className="cc-order-actions-container">
                <button
                  type="button"
                  className="cc-order-primary-btn"
                  onClick={() => {
                    if (!user) {
                      setShowLoginPrompt(true);
                    } else {
                      setShowOrderModal(true);
                    }
                  }}
                >
                  <span className="cc-btn-main-label">🛍️ Buy Item / Order Now</span>
                  <span className="cc-btn-sub-label">Choose Campus Meetup Spot • Direct Cash/UPI • Get Handover OTP</span>
                </button>

                <div className="cc-secondary-action-row">
                  <button
                    type="button"
                    className="cc-btn secondary"
                    onClick={() => setShowChat((open) => !open)}
                  >
                    {showChat ? "Close Chat" : "💬 Chat with Seller"}
                  </button>
                  <button
                    type="button"
                    className="cc-btn secondary"
                    onClick={() => setShowUpiModal(true)}
                  >
                    📱 Pay via UPI QR
                  </button>
                  <button type="button" className="cc-btn ghost" onClick={handleHeart}>
                    {liked ? "♥ Saved" : "♡ Save"}
                  </button>
                  <button type="button" className="cc-btn ghost" onClick={handleShare}>
                    {shared ? "✓ Copied" : "🔗 Share"}
                  </button>
                  <button type="button" className="cc-btn ghost" onClick={() => setShowReport((open) => !open)}>
                    Report
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="cc-buy-guide-box">
            <h4>🎓 How to Buy this Item on Campus</h4>
            <div className="cc-buy-steps-list">
              <div className="cc-buy-step-item">
                <span className="cc-step-badge">1</span>
                <div>
                  <strong>Chat with Seller</strong>
                  <p>Confirm availability and agree on a safe campus meetup spot (Library, Canteen, or Gate).</p>
                </div>
              </div>
              <div className="cc-buy-step-item">
                <span className="cc-step-badge">2</span>
                <div>
                  <strong>Meet &amp; Inspect Physically</strong>
                  <p>Meet in person on campus to check book pages, turn on electronics, or test calculators.</p>
                </div>
              </div>
              <div className="cc-buy-step-item">
                <span className="cc-step-badge">3</span>
                <div>
                  <strong>Direct In-Person Payment</strong>
                  <p>Pay seller directly via UPI (GooglePay / PhonePe / Paytm) or Cash with 0% platform deductions.</p>
                </div>
              </div>
              <div className="cc-buy-step-item">
                <span className="cc-step-badge">4</span>
                <div>
                  <strong>Handover OTP Confirmation</strong>
                  <p>Give your 6-digit Handover OTP to the seller to officially complete the purchase and mark it as Sold.</p>
                </div>
              </div>
            </div>
          </div>

          {showChat && !isOwner && (
            <>
              <div className="cc-quick">
                {QUICK_MESSAGES.map((message) => (
                  <button type="button" key={message} onClick={() => sendQuick(message)}>{message}</button>
                ))}
              </div>
              {chatNotice && <p className="cc-alert success">{chatNotice}</p>}
              <ChatPanel productId={productId} otherId={Number(product.seller_id)} otherName={product.seller_name} />
            </>
          )}

          {showReport && !isOwner && (
            <form className="cc-report" onSubmit={handleReport}>
              <label htmlFor="report-reason">Why are you reporting this listing?</label>
              <select id="report-reason" value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
                {REPORT_REASONS.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="Add details (optional)"
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
              />
              {reportError && <p className="cc-alert error">{reportError}</p>}
              {reportMessage && <p className="cc-alert success">{reportMessage}</p>}
              <button type="submit" className="cc-btn">Submit report</button>
            </form>
          )}

          <p className="cc-safety">Safety tip: meet on campus in a public place, check the item before paying and never share your OTP.</p>

          <UpiPaymentModal
            isOpen={showUpiModal}
            onClose={() => setShowUpiModal(false)}
            product={product}
          />

          <OrderModal
            isOpen={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            product={product}
            initialOrder={activeOrder}
            onOrderSuccess={(info) => {
              setActiveOrder(info);
              setHandoverOtp(info.otp);
            }}
          />

          {showLoginPrompt && (
            <div className="cc-modal-backdrop" onClick={() => setShowLoginPrompt(false)}>
              <div className="cc-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", textAlign: "center", padding: "28px" }}>
                <div style={{ fontSize: "44px", marginBottom: "12px" }}>🔒</div>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: "800", color: "#0F172A" }}>
                  Login Required to Place Order
                </h3>
                <p style={{ margin: "0 0 20px", fontSize: "0.9rem", color: "#64748B", lineHeight: "1.5" }}>
                  Please login with your student account to place orders, choose your campus meetup point, and receive your 6-digit Handover OTP.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="cc-btn secondary"
                    onClick={() => setShowLoginPrompt(false)}
                  >
                    Cancel
                  </button>
                  <Link
                    to={`/login?redirect=/product/${productId}`}
                    className="cc-btn primary"
                    style={{ textDecoration: "none", fontWeight: "700" }}
                  >
                    Login to Continue →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <section className="cc-section">
          <div className="cc-section-head">
            <h2>Similar ads</h2>
          </div>
          <div className="cc-row">
            {similar.map((item) => (
              <div className="cc-row-item" key={item.product_id}>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}