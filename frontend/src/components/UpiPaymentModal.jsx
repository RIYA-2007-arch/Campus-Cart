import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getQRCodePath } from "../utils/qrCode";

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function UpiPaymentModal({
  isOpen,
  onClose,
  product,
  orderId = null,
  existingOtp = null,
  onOrderSuccess,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderError, setOrderError] = useState("");
  const [upiNote, setUpiNote] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [demoPaid, setDemoPaid] = useState(false);

  // --- Derived values (safe with optional chaining before early return) ---
  const price = Number(product?.price || product?.agreed_price || 0);
  const title = product?.product_name || product?.title || "Campus Item";
  const sellerName = product?.seller_name || "Campus Seller";
  const sellerId = product?.seller_id || "aks";
  const productId = product?.product_id || null;

  const upiId = `aks.${String(sellerName).toLowerCase().replace(/[^a-z0-9]/g, "")}.${sellerId}@okhdfcbank`;
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(sellerName)}&am=${price}&cu=INR&tn=${encodeURIComponent(
    "CampusCart AKS - " + title.slice(0, 20)
  )}`;

  // QR code generation — MUST be before early return (Rules of Hooks)
  const qrData = useMemo(
    () => (isOpen && product ? getQRCodePath(upiUri) : null),
    [isOpen, product, upiUri]
  );

  // ✅ Early return AFTER all hooks
  if (!isOpen || !product) return null;

  // Active OTP: use existing order OTP if already placed, else newly placed order OTP
  const activeOtp = existingOtp || placedOrder?.otp || null;
  const activeOrderId = orderId || placedOrder?.order_id || null;
  // If order already exists (opened from My Orders), skip the "place order" step
  const orderAlreadyExists = !!(existingOtp || orderId);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyOtp = (otp) => {
    if (!otp) return;
    navigator.clipboard?.writeText(String(otp));
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2500);
  };

  const handleCreateUpiOrder = async () => {
    if (!productId) {
      setOrderError("Product ID missing. Please go back and try again from the product page.");
      return;
    }
    setPlacingOrder(true);
    setOrderError("");
    try {
      const res = await api.post("/orders/create", {
        product_id: productId,
        payment_method: "UPI QR Payment • Campus Meetup",
      });
      setPlacedOrder(res.data);
      if (onOrderSuccess) onOrderSuccess(res.data);
    } catch (err) {
      setOrderError(
        err.response?.data?.message || "Could not place order. Please check your login status."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleUpiAppClick = (appName) => {
    setSelectedApp(appName);
    // Copy UPI ID automatically to clipboard
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Seamless mobile deep link (does NOT open blank tab in browser)
      window.location.href = upiUri;
      setUpiNote(`📱 ${appName} app khol rahe hain... Agar na khule toh upar wala QR code scan karein.`);
    } else {
      // Desktop / PC mode: Do NOT open blank tab!
      setUpiNote(`📱 ${appName} select ho gaya! PC/Laptop par direct UPI app nahi hoti — seller ka UPI ID (${upiId}) copy ho gaya hai, ya apne phone ke ${appName} se upar wala QR scan karein.`);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(24, 24, 27, 0.78)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.35)",
          border: "1.5px solid #E4E4E7",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
            color: "#FFFFFF",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "3px solid #F59E0B",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>⚡</span>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#FFFFFF" }}>
                Campus UPI Payment
              </h3>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#F59E0B", fontWeight: "600" }}>
              Direct Peer-to-Peer • 0% Platform Charge
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "none",
              color: "#FFF",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "18px 20px", textAlign: "center" }}>

          {/* Price + Title */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "10px 14px",
              marginBottom: "14px",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.06em" }}>
              Amount Payable to Seller
            </div>
            <div style={{ fontSize: "26px", fontWeight: "900", color: "#18181B", margin: "2px 0" }}>
              {rupees(price)}
            </div>
            <div style={{ fontSize: "13px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
              Seller: <strong>{sellerName}</strong>
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              display: "inline-block",
              padding: "10px",
              background: "#FFFFFF",
              border: "2px solid #F59E0B",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(245,158,11,0.18)",
              marginBottom: "12px",
            }}
          >
            {qrData ? (
              <svg
                viewBox={`0 0 ${qrData.size} ${qrData.size}`}
                style={{ width: "190px", height: "190px", display: "block", margin: "0 auto" }}
              >
                <rect width={qrData.size} height={qrData.size} fill="#FFFFFF" rx="2" />
                <path d={qrData.path} fill="#0F172A" />
              </svg>
            ) : (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(upiUri)}`}
                alt="UPI QR"
                style={{ width: "190px", height: "190px", display: "block" }}
              />
            )}
            <div style={{ marginTop: "6px", fontSize: "11px", color: "#64748B" }}>
              Scan with GPay / PhonePe / Paytm / BHIM
            </div>
          </div>

          {/* Copy UPI ID */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#F4F4F5",
              borderRadius: "8px",
              padding: "8px 12px",
              marginBottom: "12px",
              textAlign: "left",
            }}
          >
            <span style={{ color: "#52525B", fontFamily: "monospace", fontSize: "11px", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
              {upiId}
            </span>
            <button
              type="button"
              onClick={handleCopyUpi}
              style={{
                background: copied ? "#16A34A" : "#18181B",
                color: "#FFF",
                border: "none",
                borderRadius: "6px",
                padding: "5px 10px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {copied ? "✓ Copied!" : "Copy UPI ID"}
            </button>
          </div>

          {/* Quick UPI App Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            {[
              { name: "Google Pay", emoji: "📱", color: "#1A73E8" },
              { name: "PhonePe", emoji: "💜", color: "#5F259F" },
              { name: "Paytm", emoji: "💙", color: "#00BAF2" },
            ].map(({ name, emoji, color }) => {
              const isSelected = selectedApp === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleUpiAppClick(name)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 4px",
                    borderRadius: "10px",
                    border: isSelected ? `2px solid ${color}` : `1.5px solid ${color}33`,
                    background: isSelected ? `${color}18` : `${color}08`,
                    color: color,
                    fontSize: "11px",
                    fontWeight: "800",
                    cursor: "pointer",
                    gap: "3px",
                    boxShadow: isSelected ? `0 0 0 2px ${color}33` : "none",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{emoji}</span>
                  <span>{name}</span>
                  {isSelected && <span style={{ fontSize: "9px", background: color, color: "#fff", padding: "1px 5px", borderRadius: "10px" }}>Active</span>}
                </button>
              );
            })}
          </div>

          {/* UPI note if any */}
          {upiNote && (
            <div style={{ background: "#FEF9C3", border: "1px solid #FDE047", borderRadius: "8px", padding: "9px 12px", fontSize: "11px", color: "#713F12", marginBottom: "12px", textAlign: "left", lineHeight: "1.4" }}>
              {upiNote}
            </div>
          )}

          {/* Demo Mode Simulation Button for Viva / Presentation */}
          {selectedApp && !demoPaid && (
            <div style={{ marginBottom: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  setDemoPaid(true);
                  if (!activeOtp && !orderAlreadyExists) {
                    handleCreateUpiOrder();
                  }
                }}
                style={{
                  background: "#ECFDF5",
                  border: "1.5px dashed #059669",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#065F46",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                ⚡ Click to Simulate {selectedApp} Payment Success (For College Demo)
              </button>
            </div>
          )}

          {/* ── OTP Section ── */}
          {activeOtp ? (
            /* Show existing / newly generated OTP */
            <div
              style={{
                background: "#F0FDF4",
                border: "2px solid #22C55E",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "12px",
                textAlign: "center",
                boxShadow: "0 4px 14px rgba(34,197,94,0.12)",
              }}
            >
              <div style={{ fontSize: "11px", color: "#15803D", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                🛡️ Your 6-Digit Handover OTP
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", margin: "6px 0 10px" }}>
                <span style={{ fontSize: "30px", fontWeight: "900", letterSpacing: "0.22em", color: "#166534", fontFamily: "monospace" }}>
                  {activeOtp}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyOtp(activeOtp)}
                  style={{
                    background: copiedOtp ? "#16A34A" : "#15803D",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {copiedOtp ? "✓ Copied" : "Copy OTP"}
                </button>
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px dashed #86EFAC",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  color: "#14532D",
                  lineHeight: "1.5",
                  textAlign: "left",
                }}
              >
                <strong>📌 OTP kahan dena hai?</strong>
                <p style={{ margin: "4px 0 0" }}>
                  Campus meetup par seller (<strong>{sellerName}</strong>) se product physically inspect karo, payment karo, aur tabhi yeh 6-digit OTP share karo. Seller apne <strong>"Orders → My Sales"</strong> mein yeh OTP enter karke handover confirm karega.
                </p>
              </div>
              {activeOrderId && (
                <button
                  type="button"
                  onClick={() => { onClose(); navigate("/orders?tab=purchases"); }}
                  style={{
                    marginTop: "10px",
                    background: "#18181B",
                    color: "#F59E0B",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    fontSize: "13px",
                    fontWeight: "800",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  📦 View in My Orders →
                </button>
              )}
            </div>
          ) : orderAlreadyExists ? null : (
            /* No order yet — show "Place Order & Get OTP" button */
            <div style={{ marginBottom: "12px" }}>
              {orderError && (
                <div style={{ background: "#FEE2E2", color: "#B91C1C", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", marginBottom: "8px", textAlign: "left" }}>
                  ⚠️ {orderError}
                </div>
              )}
              <button
                type="button"
                onClick={handleCreateUpiOrder}
                disabled={placingOrder}
                style={{
                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  color: "#18181B",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  fontSize: "14px",
                  fontWeight: "900",
                  cursor: placingOrder ? "not-allowed" : "pointer",
                  width: "100%",
                  boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                  opacity: placingOrder ? 0.7 : 1,
                }}
              >
                {placingOrder ? "⏳ Placing Order..." : "✅ Confirm UPI Order & Get Handover OTP"}
              </button>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "5px" }}>
                Order confirm hote hi 6-digit Handover OTP milega
              </div>
            </div>
          )}

          {/* Safety box */}
          <div
            style={{
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              borderRadius: "10px",
              padding: "10px 14px",
              textAlign: "left",
              fontSize: "11px",
              color: "#92400E",
              lineHeight: "1.45",
            }}
          >
            <strong>🛡️ Safety Rule:</strong> Sirf campus par physically product inspect karne ke baad payment karo. Advance payment kabhi mat karo bina product dekhe.
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: "12px 20px",
            background: "#F8FAFC",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "0 0 20px 20px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            {activeOrderId ? `Order #${activeOrderId}` : "AKS Spot Handover"}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#18181B",
              color: "#F59E0B",
              border: "none",
              borderRadius: "8px",
              padding: "7px 16px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
