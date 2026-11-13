import { getQRCodePath } from "../utils/qrCode";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const MEETUP_SPOTS = [
  "Central Library Lawn (AKS University)",
  "Engineering Block-B Main Gate",
  "Campus Central Canteen / Cafeteria",
  "Hostel Block-1 Entrance Gate",
  "Administrative Block Fountain",
  "Sports Ground Pavilion",
];

const TIME_SLOTS = [
  "Today during Lunch Break (1:15 PM - 2:00 PM)",
  "Today after Classes (4:30 PM - 5:30 PM)",
  "Tomorrow Morning (9:00 AM - 10:00 AM)",
  "Mutual agreement via CampusCart Chat",
];

export default function OrderModal({ isOpen, onClose, product, initialOrder = null, onOrderSuccess }) {
  const navigate = useNavigate();

  // Mode: 'checkout' (form) or 'confirmed' (success slip)
  const [mode, setMode] = useState(initialOrder ? "confirmed" : "checkout");
  const [meetupSpot, setMeetupSpot] = useState(MEETUP_SPOTS[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Handover");
  const [buyerNote, setBuyerNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(initialOrder);
  const [copied, setCopied] = useState(false);
  const [copiedUpiId, setCopiedUpiId] = useState(false);

  if (!isOpen || !product) return null;

  const productId = Number(product.product_id);
  const price = Number(product.price || 0);
  const title = product.product_name || product.title || "Campus Item";
  const sellerName = product.seller_name || "Campus Seller";

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fullPaymentString = `${paymentMethod} • ${meetupSpot.split("(")[0].trim()}`;
      const res = await api.post("/orders/create", {
        product_id: productId,
        payment_method: fullPaymentString,
      });

      const data = res.data;
      const orderInfo = {
        order_id: data.order_id,
        otp: data.otp,
        amount: data.amount || price,
        product_name: title,
        seller_name: sellerName,
        meetup_spot: meetupSpot,
        time_slot: timeSlot,
        payment_method: paymentMethod,
        created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setOrderDetails(orderInfo);
      setMode("confirmed");
      if (onOrderSuccess) onOrderSuccess(orderInfo);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOtp = () => {
    if (!orderDetails?.otp) return;
    navigator.clipboard?.writeText(orderDetails.otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="cc-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(24, 24, 27, 0.7)",
        backdropFilter: "blur(5px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="cc-order-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid #E4E4E7",
          animation: "ccFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
            color: "#FFFFFF",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "3px solid #F59E0B",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>{mode === "confirmed" ? "🎉" : "🛍️"}</span>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                {mode === "confirmed" ? "Order Confirmed & Active!" : "Place Campus Order"}
              </h3>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#F59E0B", fontWeight: "600" }}>
              AKS University • Direct Peer Handover System
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "none",
              color: "#FFFFFF",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px" }}>
          {mode === "checkout" ? (
            /* ================= PHASE 1: CHECKOUT / REVIEW & CONFIRM ================= */
            <form onSubmit={handlePlaceOrder}>
              {/* Product Summary Box */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "14px",
                  padding: "14px",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "10px",
                    background: "#E2E8F0",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#64748B" }}>
                      {(product.category || "CC").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px" }}>
                      {product.condition || "Good"}
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748B" }}>{product.category}</span>
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#18181B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {title}
                  </h4>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#18181B" }}>{rupees(price)}</span>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>• Seller: <strong>{sellerName}</strong></span>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    color: "#991B1B",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Step 1: Campus Meetup Spot */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                  📍 Step 1: Select Campus Handover Spot *
                </label>
                <select
                  value={meetupSpot}
                  onChange={(e) => setMeetupSpot(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: "500",
                    background: "#FFFFFF",
                    color: "#18181B",
                    outline: "none",
                  }}
                >
                  {MEETUP_SPOTS.map((spot) => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </select>
                <small style={{ display: "block", color: "#64748B", fontSize: "11px", marginTop: "4px" }}>
                  Designated AKS campus zones with CCTV and faculty/student presence.
                </small>
              </div>

              {/* Step 2: Preferred Time */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                  ⏰ Step 2: Preferred Meetup Time *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "13px",
                    fontWeight: "500",
                    background: "#FFFFFF",
                    color: "#18181B",
                    outline: "none",
                  }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Step 3: Payment Choice */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#18181B", marginBottom: "8px" }}>
                  💳 Step 3: How will you pay the seller at handover? *
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <label
                    style={{
                      border: paymentMethod === "Cash on Handover" ? "2px solid #18181B" : "1.5px solid #E2E8F0",
                      background: paymentMethod === "Cash on Handover" ? "#FEF8EE" : "#FFFFFF",
                      padding: "12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#18181B",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "Cash on Handover"}
                      onChange={() => setPaymentMethod("Cash on Handover")}
                    />
                    <span>💵 Cash on Handover</span>
                  </label>

                  <label
                    style={{
                      border: paymentMethod === "Direct UPI QR Scan" ? "2px solid #F59E0B" : "1.5px solid #E2E8F0",
                      background: paymentMethod === "Direct UPI QR Scan" ? "#FEF8EE" : "#FFFFFF",
                      padding: "12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#18181B",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "Direct UPI QR Scan"}
                      onChange={() => setPaymentMethod("Direct UPI QR Scan")}
                    />
                    <span>⚡ Direct UPI QR Scan</span>
                  </label>
                </div>

                {/* LIVE DYNAMIC UPI QR SCANNER (When UPI is selected) */}
                {paymentMethod === "Direct UPI QR Scan" && (() => {
                  const sellerVpa = `aks.${String(sellerName).toLowerCase().replace(/[^a-z0-9]/g, "")}.${product.seller_id || "aks"}@okhdfcbank`;
                  const upiPayload = `upi://pay?pa=${sellerVpa}&pn=${encodeURIComponent(sellerName)}&am=${price}&cu=INR&tn=${encodeURIComponent("CampusCart AKS - " + title.slice(0, 20))}`;
                  const qr = getQRCodePath(upiPayload);

                  return (
                    <div
                      style={{
                        background: "#FFFDF9",
                        border: "2px solid #F59E0B",
                        borderRadius: "16px",
                        padding: "16px",
                        textAlign: "center",
                        boxShadow: "0 6px 20px rgba(245, 158, 11, 0.15)",
                        animation: "fadeIn 0.2s ease",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#B45309", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        ⚡ Scan with GPay, PhonePe, Paytm or BHIM
                      </div>

                      <div style={{ display: "inline-block", padding: "10px", background: "#FFFFFF", borderRadius: "14px", border: "1.5px solid #FDE68A", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
                        {qr ? (
                          <svg viewBox={`0 0 ${qr.size} ${qr.size}`} style={{ width: "175px", height: "175px", display: "block" }}>
                            <rect width={qr.size} height={qr.size} fill="#FFFFFF" rx="2" />
                            <path d={qr.path} fill="#0F172A" />
                          </svg>
                        ) : (
                          <div style={{ width: "175px", height: "175px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            QR Code Ready
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: "10px", fontSize: "13px", fontWeight: "700", color: "#18181B" }}>
                        Pay <span style={{ color: "#D97706" }}>{rupees(price)}</span> to <strong>{sellerName}</strong>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#F4F4F5",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          fontSize: "11px",
                          marginTop: "10px",
                        }}
                      >
                        <span style={{ color: "#52525B", fontFamily: "monospace" }}>{sellerVpa}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(sellerVpa);
                            setCopiedUpiId(true);
                            setTimeout(() => setCopiedUpiId(false), 2000);
                          }}
                          style={{
                            background: copiedUpiId ? "#16A34A" : "#18181B",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          {copiedUpiId ? "✓ Copied" : "Copy UPI"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Note (Optional) */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748B", marginBottom: "4px" }}>
                  Note to Seller (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. I will be wearing a blue jacket near the canteen..."
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Price & Zero Fee Breakdown */}
              <div
                style={{
                  background: "#F4F4F5",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  fontSize: "13px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#52525B" }}>
                  <span>Product Price:</span>
                  <span style={{ fontWeight: "600", color: "#18181B" }}>{rupees(price)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#52525B" }}>
                  <span>Campus Handover Fee:</span>
                  <span style={{ fontWeight: "700", color: "#16A34A" }}>₹0 (FREE)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E4E4E7", paddingTop: "8px", marginTop: "4px" }}>
                  <strong style={{ fontSize: "14px", color: "#18181B" }}>Total Payable to Seller:</strong>
                  <strong style={{ fontSize: "16px", color: "#18181B" }}>{rupees(price)}</strong>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    background: "#F8FAFC",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
                    color: "#F59E0B",
                    fontSize: "14px",
                    fontWeight: "800",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? "Confirming Order..." : "🚀 Confirm & Place Order →"}
                </button>
              </div>
            </form>
          ) : (
            /* ================= PHASE 2: CONFIRMED SUCCESS RECEIPT ================= */
            <div>
              {/* Order Confirmed Banner */}
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1.5px solid #A7F3D0",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "6px" }}>🎉</div>
                <h4 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800", color: "#065F46" }}>
                  Order Confirmed Successfully!
                </h4>
                <div style={{ fontSize: "13px", color: "#047857", fontWeight: "600" }}>
                  Order ID: <span style={{ fontFamily: "monospace", fontWeight: "800" }}>{orderDetails?.order_id || "#CC-ORD-PENDING"}</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#065F46" }}>
                  The seller has been notified. Meet on campus to inspect and collect your product.
                </p>
              </div>

              {/* 🛡️ 6-Digit Handover OTP Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
                  borderRadius: "16px",
                  padding: "20px",
                  color: "#FFFFFF",
                  textAlign: "center",
                  border: "2px solid #F59E0B",
                  boxShadow: "0 10px 25px rgba(245, 158, 11, 0.2)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#F59E0B", fontWeight: "700", marginBottom: "6px" }}>
                  🛡️ Your 6-Digit Handover Verification OTP
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: "900",
                    letterSpacing: "8px",
                    color: "#FFFFFF",
                    fontFamily: "monospace",
                    margin: "10px 0",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {orderDetails?.otp || "------"}
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    style={{
                      background: copied ? "#16A34A" : "rgba(245, 158, 11, 0.2)",
                      border: "1px solid #F59E0B",
                      color: "#FFFFFF",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>📋</span> {copied ? "✓ Copied to Clipboard!" : "Copy OTP Code"}
                  </button>
                </div>

                <p style={{ margin: "14px 0 0", fontSize: "11px", color: "#E4E4E7", lineHeight: "1.5", textAlign: "left", background: "rgba(255,255,255,0.06)", padding: "10px 12px", borderRadius: "8px" }}>
                  ⚠️ <strong>Campus Handover Rule:</strong> Share this OTP with the seller <strong>ONLY AFTER</strong> you physically meet on campus, check the product condition, and pay the agreed amount.
                </p>

                {/* Seller Where to Enter OTP */}
                <div
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid #F59E0B",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    marginTop: "12px",
                    fontSize: "11.5px",
                    color: "#ffffff",
                    lineHeight: "1.6",
                  }}
                >
                  <strong style={{ fontSize: "12px", color: "#F59E0B" }}>📍 Where does the Seller enter this OTP?</strong>
                  <br />
                  Seller → <strong>Orders</strong> → <strong>My Sales</strong> tab → Enter code in <em>"Verify Handover OTP"</em> box → Click <strong>Verify OTP</strong> to complete the sale ✅
                </div>
              </div>

              {/* 4-Step Handover Visual Progress Tracker */}
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "12px" }}>
                  🎓 How to Complete Your Handover &amp; Get the Item:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ background: "#DCFCE7", color: "#166534", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0 }}>✓</span>
                    <div style={{ fontSize: "12px", color: "#334155" }}>
                      <strong>Step 1: Order Placed</strong> — Order recorded in AKS CampusCart system.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ background: "#FEF3C7", color: "#92400E", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", flexShrink: 0 }}>2</span>
                    <div style={{ fontSize: "12px", color: "#334155" }}>
                      <strong>Step 2: Meet on Campus</strong> — Meet seller at <u>{orderDetails?.meetup_spot || meetupSpot}</u>.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ background: "#FEF3C7", color: "#92400E", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", flexShrink: 0 }}>3</span>
                    <div style={{ fontSize: "12px", color: "#334155" }}>
                      <strong>Step 3: Inspect Physically</strong> — Verify pages, battery, or condition.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ background: "#FEF3C7", color: "#92400E", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", flexShrink: 0 }}>4</span>
                    <div style={{ fontSize: "12px", color: "#334155" }}>
                      <strong>Step 4: Pay &amp; Share OTP</strong> — Pay {rupees(price)} (Cash/UPI) and give OTP. Seller verifies it on their phone to complete transaction!
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details Receipt Box */}
              <div
                style={{
                  border: "1px dashed #CBD5E1",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  fontSize: "12px",
                  color: "#475569",
                  marginBottom: "20px",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Product:</span>
                  <strong style={{ color: "#18181B" }}>{title}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Payable Amount:</span>
                  <strong style={{ color: "#18181B" }}>{rupees(price)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Seller:</span>
                  <span style={{ color: "#18181B", fontWeight: "600" }}>{sellerName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Meetup Spot:</span>
                  <span style={{ color: "#18181B", fontWeight: "600" }}>{orderDetails?.meetup_spot || meetupSpot}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Payment Mode:</span>
                  <span style={{ color: "#18181B", fontWeight: "600" }}>{orderDetails?.payment_method || paymentMethod}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/orders?tab=purchases");
                  }}
                  style={{
                    background: "#18181B",
                    color: "#F59E0B",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>📑</span> View in My Orders
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/chat");
                  }}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #CBD5E1",
                    color: "#18181B",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>💬</span> Chat with Seller
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748B",
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  🖨️ Print / Save Order Slip
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#18181B",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
