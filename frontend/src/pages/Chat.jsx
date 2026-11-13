import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ChatPanel from "../components/ChatPanel";

const keyOf = (item) => `${item.product_id}-${item.other_id}`;

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });

  const load = useCallback(async () => {
    try {
      const response = await api.get("/chat/conversations");
      setConversations(response.data.conversations || []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 8000);
    return () => window.clearInterval(timer);
  }, [load]);

  const current = conversations.find((item) => keyOf(item) === selectedKey);

  const select = (item) => {
    setSelectedKey(keyOf(item));
    setOtp("");
    setNotice({ type: "", text: "" });
  };

  const requestOtp = async () => {
    try {
      const response = await api.post("/handover/request", { product_id: current.product_id });
      setNotice({ type: "success", text: response.data.message });
    } catch (err) {
      setNotice({ type: "error", text: err.response?.data?.message || "Could not send the OTP." });
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/handover/verify", {
        product_id: current.product_id,
        buyer_id: current.other_id,
        otp,
      });
      setNotice({ type: "success", text: response.data.message });
      setOtp("");
    } catch (err) {
      setNotice({ type: "error", text: err.response?.data?.message || "Could not verify the OTP." });
    }
  };

  return (
    <div>
      <h1 className="cc-page-title">Chat</h1>
      <p className="cc-page-subtitle">Your conversations with buyers and sellers.</p>

      {loading ? (
        <p className="cc-empty">Loading chats...</p>
      ) : conversations.length === 0 ? (
        <div className="cc-empty-card">
          <p>No chats yet. Open a product and tap Message Seller to start one.</p>
        </div>
      ) : (
        <div className="cc-inbox">
          <ul className="cc-inbox-list">
            {conversations.map((item) => (
              <li key={keyOf(item)}>
                <button
                  type="button"
                  className={`cc-inbox-item ${keyOf(item) === selectedKey ? "active" : ""}`}
                  onClick={() => select(item)}
                >
                  <strong>{item.other_name}</strong>
                  <span className="cc-inbox-product">{item.product_name}</span>
                  <span className="cc-inbox-last">{item.last_message}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="cc-inbox-view">
            {!current ? (
              <p className="cc-empty">Select a conversation.</p>
            ) : (
              <>
                <div className="cc-inbox-head">
                  <div>
                    <strong>{current.product_name}</strong>
                    <p>₹{Number(current.price).toLocaleString("en-IN")} · {current.i_am_seller ? "You are the seller" : "You are the buyer"}</p>
                  </div>
                  <Link to={`/product/${current.product_id}`}>View product</Link>
                </div>

                <ChatPanel
                  key={keyOf(current)}
                  productId={current.product_id}
                  otherId={current.other_id}
                  otherName={current.other_name}
                />

                <div className="cc-handover">
                  {current.i_am_seller ? (
                    <form onSubmit={verifyOtp}>
                      <label htmlFor="handover-otp">Meeting the buyer? Enter the 6-digit OTP they show you.</label>
                      <div className="cc-handover-row">
                        <input
                          id="handover-otp"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otp}
                          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                          placeholder="6-digit OTP"
                        />
                        <button type="submit" className="cc-btn">Confirm handover</button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p>Meeting the seller? Get a handover OTP by email. Show it only when you receive the item.</p>
                      <button type="button" className="cc-btn secondary" onClick={requestOtp}>Get handover OTP</button>
                    </div>
                  )}
                  {notice.text && <p className={`cc-alert ${notice.type}`}>{notice.text}</p>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}