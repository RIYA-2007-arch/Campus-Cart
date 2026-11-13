import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./orders.css";
import UpiPaymentModal from "../components/UpiPaymentModal";
import { useAuth } from "../AuthContext";

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function MyOrders() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get("tab") === "sales" ? "sales" : "purchases";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'completed'
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState({ type: "", text: "" });

  // Verification Modal State (Seller)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [confirmHandover, setConfirmHandover] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState("");

  // Action Loading states
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [selectedUpiProduct, setSelectedUpiProduct] = useState(null);
  const [quickOtpInput, setQuickOtpInput] = useState("");
  const [quickVerifyLoading, setQuickVerifyLoading] = useState(false);
  const [quickVerifyMsg, setQuickVerifyMsg] = useState({ type: "", text: "" });

  const handleQuickVerifyOtp = async (e) => {
    e?.preventDefault();
    const cleanOtp = quickOtpInput.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setQuickVerifyMsg({ type: "error", text: "Please enter a valid 6-digit Handover OTP." });
      return;
    }
    setQuickVerifyLoading(true);
    setQuickVerifyMsg({ type: "", text: "" });
    try {
      const res = await api.post("/orders/verify-otp", { otp: cleanOtp });
      setQuickVerifyMsg({
        type: "success",
        text: res.data?.message || "🎉 Handover Verified Successfully! Transaction complete and item marked SOLD.",
      });
      setQuickOtpInput("");
      await fetchOrders();
    } catch (err) {
      setQuickVerifyMsg({
        type: "error",
        text: err.response?.data?.message || "Could not verify Handover OTP. Please check the code.",
      });
    } finally {
      setQuickVerifyLoading(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [purchasesRes, salesRes] = await Promise.all([
        api.get("/orders/my-purchases").catch(() => ({ data: { orders: [] } })),
        api.get("/orders/my-sales").catch(() => ({ data: { sales: [] } })),
      ]);
      setPurchases(purchasesRes.data?.orders || []);
      setSales(salesRes.data?.sales || []);
    } catch {
      setGlobalMessage({ type: "error", text: "Unable to load orders at this time." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === "sales" ? { tab: "sales" } : {});
  };

  const handleCopyOtp = (orderId, otp) => {
    if (!otp) return;
    navigator.clipboard.writeText(otp);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setActionLoadingId(orderId);
    try {
      const res = await api.post("/orders/cancel", { order_id: orderId });
      setGlobalMessage({ type: "success", text: res.data?.message || "Order cancelled." });
      await fetchOrders();
    } catch (err) {
      setGlobalMessage({
        type: "error",
        text: err.response?.data?.message || "Could not cancel order.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRegenerateOtp = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      const res = await api.post("/orders/regenerate-otp", { order_id: orderId });
      setGlobalMessage({
        type: "success",
        text: res.data?.message || "New 6-digit Handover OTP generated.",
      });
      await fetchOrders();
    } catch (err) {
      setGlobalMessage({
        type: "error",
        text: err.response?.data?.message || "Could not regenerate OTP.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Seller Modal Handlers
  const openVerifyModal = (order) => {
    setSelectedOrder(order);
    setOtpInput("");
    setConfirmHandover(false);
    setConfirmPayment(false);
    setVerifyError("");
    setVerifySuccess("");
    setVerifyModalOpen(true);
  };

  const closeVerifyModal = () => {
    setVerifyModalOpen(false);
    setSelectedOrder(null);
    setOtpInput("");
  };

  const submitOtpVerification = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      setVerifyError("Please enter the full 6-digit OTP.");
      return;
    }
    if (!confirmHandover || !confirmPayment) {
      setVerifyError("Please confirm both handover checklist items before verifying.");
      return;
    }

    setVerifyLoading(true);
    setVerifyError("");
    setVerifySuccess("");

    try {
      const res = await api.post("/orders/verify-otp", {
        order_id: selectedOrder.order_id,
        otp: otpInput.trim(),
      });
      setVerifySuccess(res.data?.message || "Handover verified successfully! Product marked as Sold.");
      await fetchOrders();
      setTimeout(() => {
        closeVerifyModal();
      }, 1800);
    } catch (err) {
      setVerifyError(err.response?.data?.message || "Verification failed. Please check the OTP.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Filter current list
  const currentList = activeTab === "purchases" ? purchases : sales;
  const filteredOrders = currentList.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return String(item.status).toLowerCase() === "pending";
    if (filter === "completed") return ["completed", "sold"].includes(String(item.status).toLowerCase());
    return true;
  });

  return (
    <div className="cc-orders-container">
      <div className="cc-orders-header">
        <h1 className="cc-page-title">Orders &amp; Handover</h1>
        <p className="cc-page-subtitle">
          Manage your campus purchases, sales, and secure 6-digit Handover OTP verifications.
        </p>
      </div>

      {globalMessage.text && (
        <div className={`cc-alert ${globalMessage.type}`} style={{ marginBottom: "1.25rem" }}>
          {globalMessage.text}
        </div>
      )}

      {/* Tabs: My Purchases vs My Sales */}
      <div className="cc-orders-tabs">
        <button
          type="button"
          className={`cc-orders-tab-btn ${activeTab === "purchases" ? "active" : ""}`}
          onClick={() => switchTab("purchases")}
        >
          🛒 My Purchases
          <span className="cc-tab-pill">{purchases.length}</span>
        </button>
        <button
          type="button"
          className={`cc-orders-tab-btn ${activeTab === "sales" ? "active" : ""}`}
          onClick={() => switchTab("sales")}
        >
          📦 My Sales
          <span className="cc-tab-pill">{sales.length}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="cc-orders-filter-row">
        <div className="cc-order-filters">
          <button
            type="button"
            className={`cc-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({currentList.length})
          </button>
          <button
            type="button"
            className={`cc-filter-pill ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending Handover ({currentList.filter((i) => String(i.status).toLowerCase() === "pending").length})
          </button>
          <button
            type="button"
            className={`cc-filter-pill ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed ({currentList.filter((i) => ["completed", "sold"].includes(String(i.status).toLowerCase())).length})
          </button>
        </div>

        {activeTab === "sales" && (
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            💡 Sellers verify the 6-digit OTP shown by the buyer.
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <p className="cc-empty">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="cc-empty-card">
          <p>
            {activeTab === "purchases"
              ? "You have not placed any orders yet."
              : "No sales orders have been placed for your listings yet."}
          </p>
          <Link
            to={activeTab === "purchases" ? "/browse" : "/sell"}
            className="cc-primary-link"
          >
            {activeTab === "purchases" ? "Browse campus listings" : "List an item for sale"}
          </Link>
        </div>
      ) : (
        <div className="cc-orders-list">
          {filteredOrders.map((order) => {
            const isPending = String(order.status).toLowerCase() === "pending";
            const isCompleted = ["completed", "sold"].includes(String(order.status).toLowerCase());
            const isCancelled = String(order.status).toLowerCase() === "cancelled";

            return (
              <div className="cc-order-card" key={order.order_id || order.id}>
                <div className="cc-order-card-header">
                  <div className="cc-order-id-group">
                    <span>Order:</span>
                    <span className="cc-order-id-tag">#{order.order_id}</span>
                    <span>·</span>
                    <span>{order.created_at || "Recent"}</span>
                  </div>

                  <div>
                    {isPending && <span className="cc-status-badge pending">⏳ Pending Handover</span>}
                    {isCompleted && <span className="cc-status-badge completed">✅ Completed &amp; Sold</span>}
                    {isCancelled && <span className="cc-status-badge cancelled">❌ Cancelled</span>}
                  </div>
                </div>

                <div className="cc-order-card-body">
                  <div className="cc-order-thumb">
                    {order.image_url ? (
                      <img src={order.image_url} alt={order.product_name} />
                    ) : (
                      <span>{(order.category || "CC").slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="cc-order-info">
                    <Link to={`/product/${order.product_id}`} className="cc-order-title">
                      {order.product_name}
                    </Link>

                    <div className="cc-order-price-row">
                      <span className="cc-order-price">{rupees(order.amount)}</span>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        Payment: <strong>{order.payment_method || "In-Person (Cash / UPI)"}</strong>
                      </span>
                    </div>

                    <div className="cc-order-meta-info">
                      {activeTab === "purchases" ? (
                        <>
                          <span className="cc-order-user-tag">
                            👤 Seller: <strong>{order.seller_name}</strong>
                          </span>
                          {order.seller_branch && (
                            <span className="cc-order-user-tag">
                              🎓 {order.seller_branch}
                              {order.seller_semester ? ` (Sem ${order.seller_semester})` : ""}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="cc-order-user-tag">
                            👤 Buyer: <strong>{order.buyer_name}</strong>
                          </span>
                          {order.buyer_branch && (
                            <span className="cc-order-user-tag">
                              🎓 {order.buyer_branch}
                              {order.buyer_semester ? ` (Sem ${order.buyer_semester})` : ""}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* BUYER VIEW: Handover OTP Box */}
                    {activeTab === "purchases" && isPending && (
                      <div className="cc-buyer-otp-card">
                        <div className="cc-buyer-otp-header">
                          <strong>🛡️ Your 6-Digit Handover OTP</strong>
                          {order.is_expired ? (
                            <span style={{ color: "#dc2626", fontWeight: "700", fontSize: "0.8rem" }}>
                              ⚠️ OTP Expired
                            </span>
                          ) : (
                            <span style={{ color: "#166534", fontSize: "0.8rem" }}>
                              Valid for Campus Meetup
                            </span>
                          )}
                        </div>

                        <div className="cc-buyer-otp-box">
                          <span className="cc-buyer-otp-number">
                            {order.otp || "------"}
                          </span>
                          <button
                            type="button"
                            className="cc-btn secondary small"
                            onClick={() => handleCopyOtp(order.order_id, order.otp)}
                          >
                            {copiedId === order.order_id ? "✓ Copied!" : "📋 Copy Code"}
                          </button>
                          <button
                            type="button"
                            className="cc-btn small"
                            style={{ background: "#F59E0B", color: "#18181B", fontWeight: "700", border: "none", marginLeft: "6px" }}
                            onClick={() => {
                              setSelectedUpiProduct({
                                product_name: order.product_name,
                                price: order.amount,
                                seller_name: order.seller_name,
                                seller_id: order.seller_id,
                                product_id: order.product_id,
                                order_id: order.order_id,
                                existing_otp: order.otp,
                              });
                              setUpiModalOpen(true);
                            }}
                          >
                            📱 Pay via UPI QR
                          </button>
                        </div>

                        <p className="cc-buyer-otp-instruction">
                          👉 <strong>Seller OTP kahan dalega?</strong> Campus meetup par payment inspect hone ke baad buyer yeh OTP seller ko dega. Seller apne account ke <strong>"Orders" &gt; "My Sales"</strong> tab mein (ya neeche diye gaye button se) is product ka OTP verify karega.
                        </p>

                        {/* SELLER VERIFICATION OPTION DIRECTLY ON THIS PRODUCT CARD */}
                        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                          <span style={{ fontSize: "12px", color: "#065F46", fontWeight: "700" }}>
                            Seller Action: Is product ka OTP enter karke ise SOLD mark karein:
                          </span>
                          <button
                            type="button"
                            className="cc-btn small"
                            style={{ background: "#059669", color: "#FFFFFF", fontWeight: "800", border: "none", padding: "7px 16px" }}
                            onClick={() => openVerifyModal(order)}
                          >
                            🤝 Verify OTP for this Product
                          </button>
                        </div>

                        <p className="cc-buyer-payment-note">
                          Note: CampusCart uses direct peer-to-peer payments. Pay the seller via Cash or direct UPI (GooglePay / PhonePe / Paytm) only when physically inspecting the item at AKS University campus.
                        </p>
                      </div>
                    )}

                    {/* SELLER VIEW: Verify Handover Action */}
                    {activeTab === "sales" && isPending && (
                      <div className="cc-seller-action-box">
                        <div className="cc-seller-action-text">
                          <strong>Action Required: Handover Verification</strong>
                          <span>
                            Meet the buyer in person, inspect product together, collect payment (Cash/UPI), then enter the buyer's 6-digit OTP.
                          </span>
                        </div>
                        <button
                          type="button"
                          className="cc-btn primary"
                          style={{ minWidth: "180px", fontWeight: "700" }}
                          onClick={() => openVerifyModal(order)}
                        >
                          🤝 Verify Handover OTP
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="cc-order-card-footer">
                  <Link to={`/product/${order.product_id}`} className="cc-btn secondary small">
                    View Product
                  </Link>

                  {/* Chat shortcut */}
                  <button
                    type="button"
                    className="cc-btn ghost small"
                    onClick={() => navigate("/chat")}
                  >
                    💬 Message {activeTab === "purchases" ? "Seller" : "Buyer"}
                  </button>

                  {/* Buyer action buttons */}
                  {activeTab === "purchases" && isPending && (
                    <>
                      {order.is_expired && (
                        <button
                          type="button"
                          className="cc-btn secondary small"
                          disabled={actionLoadingId === order.order_id}
                          onClick={() => handleRegenerateOtp(order.order_id)}
                        >
                          {actionLoadingId === order.order_id ? "Refreshing..." : "🔄 Refresh OTP"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="cc-btn ghost small"
                        style={{ color: "#dc2626" }}
                        disabled={actionLoadingId === order.order_id}
                        onClick={() => handleCancelOrder(order.order_id)}
                      >
                        {actionLoadingId === order.order_id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELLER VERIFY HANDOVER OTP MODAL */}
      {verifyModalOpen && selectedOrder && (
        <div className="cc-modal-backdrop" onClick={closeVerifyModal}>
          <div className="cc-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <h3>🤝 Verify Handover OTP</h3>
              <button
                type="button"
                className="cc-modal-close-btn"
                onClick={closeVerifyModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitOtpVerification}>
              <div className="cc-modal-body">
                <div className="cc-modal-summary-box">
                  <div className="cc-modal-summary-item">
                    <span style={{ color: "#64748b" }}>Product:</span>
                    <strong>{selectedOrder.product_name}</strong>
                  </div>
                  <div className="cc-modal-summary-item">
                    <span style={{ color: "#64748b" }}>Amount to Collect:</span>
                    <strong style={{ color: "#059669" }}>{rupees(selectedOrder.amount)}</strong>
                  </div>
                  <div className="cc-modal-summary-item">
                    <span style={{ color: "#64748b" }}>Buyer:</span>
                    <strong>{selectedOrder.buyer_name}</strong>
                  </div>
                </div>

                <div className="cc-checklist-container">
                  <div className="cc-checklist-title">Handover &amp; Payment Confirmation</div>
                  <label className="cc-checkbox-label">
                    <input
                      type="checkbox"
                      checked={confirmHandover}
                      onChange={(e) => setConfirmHandover(e.target.checked)}
                    />
                    <span>
                      <strong>Step 1:</strong> I have physically handed over the item to the buyer, and they have inspected it.
                    </span>
                  </label>

                  <label className="cc-checkbox-label">
                    <input
                      type="checkbox"
                      checked={confirmPayment}
                      onChange={(e) => setConfirmPayment(e.target.checked)}
                    />
                    <span>
                      <strong>Step 2:</strong> I have received direct payment (Cash in hand or direct UPI received notification on my phone).
                    </span>
                  </label>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "4px 0 0 28px" }}>
                    *Note: CampusCart peer-to-peer marketplace does not process online bank transactions automatically. Payment is received directly by you.
                  </p>
                </div>

                <div className="cc-otp-input-section">
                  <label htmlFor="otp-input-code" className="cc-otp-input-label">
                    Enter the 6-Digit Handover OTP shown by Buyer:
                  </label>
                  <input
                    id="otp-input-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    autoFocus
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="cc-otp-large-input"
                  />
                </div>

                {verifyError && (
                  <div className="cc-modal-alert error">
                    ⚠️ {verifyError}
                  </div>
                )}

                {verifySuccess && (
                  <div className="cc-modal-alert success">
                    🎉 {verifySuccess}
                  </div>
                )}
              </div>

              <div className="cc-modal-footer">
                <button
                  type="button"
                  className="cc-btn secondary"
                  onClick={closeVerifyModal}
                  disabled={verifyLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn primary"
                  disabled={
                    verifyLoading ||
                    otpInput.length !== 6 ||
                    !confirmHandover ||
                    !confirmPayment
                  }
                  style={{ minWidth: "160px" }}
                >
                  {verifyLoading ? "Verifying..." : "Verify & Mark Sold"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPI PAYMENT QR MODAL — Pay via UPI QR button se open hoga */}
      <UpiPaymentModal
        isOpen={upiModalOpen}
        onClose={() => {
          setUpiModalOpen(false);
          setSelectedUpiProduct(null);
        }}
        product={selectedUpiProduct}
        orderId={selectedUpiProduct?.order_id || null}
        existingOtp={selectedUpiProduct?.existing_otp || null}
        onOrderSuccess={() => {
          fetchOrders();
        }}
      />
    </div>
  );
}
