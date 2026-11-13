import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const SUGGESTIONS = [
  "💻 Laptops under 35k",
  "🧮 Casio fx-991EX scientific calculator",
  "🤝 How does the Handover OTP work?",
  "📚 DBMS and Python practical lab files",
  "🛡️ Campus handover and payment safety rules",
];

const WELCOME = {
  from: "bot",
  text: "Hello! I am CartMate, your AKS University AI campus shopping assistant. 🎓\n\nYou can ask me about semester textbooks, engineering laptops, calculators, lab coats, or Handover OTP safety rules. I will help you find the best verified student listings!",
  time: "Just now",
  products: [],
  action: null,
};

function formatCurrentTime() {
  const d = new Date();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, sending]);

  const send = async (value) => {
    const message = (value ?? text).trim();
    if (!message || sending) return;

    const timeStr = formatCurrentTime();
    const history = messages.slice(-6).map((item) => ({ from: item.from, text: item.text }));

    setMessages((previous) => [...previous, { from: "user", text: message, time: timeStr }]);
    setText("");
    setSending(true);

    try {
      const response = await api.post("/cartmate", { message, history });
      setMode(response.data.mode || "");
      setMessages((previous) => [
        ...previous,
        {
          from: "bot",
          text: response.data.reply,
          time: formatCurrentTime(),
          products: response.data.products || [],
          action: response.data.action || null,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          from: "bot",
          text: "Could not connect to the CampusCart server. Please ensure the backend is running and try again.",
          time: formatCurrentTime(),
          products: [],
          action: null,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    send();
  };

  return (
    <>
      {/* ── Floating Launcher Button (Warm Dark Amber & Black) ── */}
      <button
        type="button"
        className="cc-widget-fab"
        onClick={() => setOpen(true)}
        aria-label="Open CartMate AI Assistant"
      >
        <span className="cc-fab-bot-icon">🤖</span>
        <span>CartMate AI</span>
        <span className="cc-fab-pulse-dot" />
      </button>

      {/* ── WhatsApp Dark Theme Big Screen Modal / Window ── */}
      {open && (
        <div className="cc-chat-modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="cc-chat-large-window"
            role="dialog"
            aria-label="CartMate AI Large Screen"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top WhatsApp Style Header with Back Option */}
            <div className="cc-wm-header">
              <div className="cc-wm-header-left">
                <button
                  type="button"
                  className="cc-wm-back-btn"
                  onClick={() => setOpen(false)}
                  title="Back to CampusCart"
                >
                  <span className="cc-wm-back-arrow">←</span>
                  <span className="cc-wm-back-label">Back</span>
                </button>

                <div className="cc-wm-avatar-box">
                  <span className="cc-wm-avatar-emoji">🤖</span>
                  <span className="cc-wm-online-badge" />
                </div>

                <div className="cc-wm-title-block">
                  <div className="cc-wm-name-row">
                    <strong>CartMate AI</strong>
                    <span className="cc-wm-verified-tag">✓ Verified Brain</span>
                  </div>
                  <span className="cc-wm-status-text">
                    {sending ? "CartMate is typing..." : "Online · English, Hindi & Hinglish"}
                  </span>
                </div>
              </div>

              <div className="cc-wm-header-right">
                <button
                  type="button"
                  className="cc-wm-close-icon-btn"
                  onClick={() => setOpen(false)}
                  title="Close AI Assistant"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Clean Header Border Indicator */}
            <div className="cc-wm-header-divider" />

            {/* Chat Body (WhatsApp Dark Doodled Canvas) */}
            <div className="cc-wm-messages-scroll" ref={listRef}>
              <div className="cc-wm-date-stamp">
                <span>TODAY · 100% SECURE AKS ASSISTANT</span>
              </div>

              {messages.map((item, index) => {
                const isUser = item.from === "user";
                return (
                  <div key={index} className={`cc-wm-row ${isUser ? "user" : "bot"}`}>
                    <div className={`cc-wm-bubble ${isUser ? "user" : "bot"}`}>
                      {!isUser && (
                        <div className="cc-wm-bubble-author">
                          <span>🤖 CartMate</span>
                          <span className="cc-wm-ai-pill">AI</span>
                        </div>
                      )}

                      <p className="cc-wm-bubble-text">{item.text}</p>

                      {/* Attached Product Recommendations */}
                      {item.products?.length > 0 && (
                        <div className="cc-wm-products-carousel">
                          {item.products.map((product) => (
                            <div
                              key={product.product_id}
                              className="cc-wm-product-card"
                              onClick={() => {
                                setOpen(false);
                                navigate(`/product/${product.product_id}`);
                              }}
                            >
                              <div className="cc-wm-product-thumb">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.product_name} />
                                ) : (
                                  <span>📦</span>
                                )}
                              </div>
                              <div className="cc-wm-product-info">
                                <h4>{product.product_name}</h4>
                                <div className="cc-wm-product-meta-row">
                                  <span className="cc-wm-price-tag">
                                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                                  </span>
                                  {product.condition && (
                                    <span className="cc-wm-cond-tag">{product.condition}</span>
                                  )}
                                </div>
                                <span className="cc-wm-view-link">View Product ➔</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons if any */}
                      {item.action && (
                        <button
                          type="button"
                          className="cc-wm-action-btn"
                          onClick={() => {
                            setOpen(false);
                            navigate(item.action.path);
                          }}
                        >
                          {item.action.label} ➔
                        </button>
                      )}

                      {/* Bubble footer with time & WhatsApp checkmarks */}
                      <div className="cc-wm-bubble-footer">
                        <span className="cc-wm-time">{item.time || formatCurrentTime()}</span>
                        {isUser && <span className="cc-wm-ticks">✓✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing / Sending Animated Dashed Box */}
              {sending && (
                <div className="cc-wm-row bot">
                  <div className="cc-wm-bubble bot cc-wm-thinking-bubble">
                    <div className="cc-wm-thinking-stream">
                      <span className="cc-thinking-dot dot-1" />
                      <span className="cc-thinking-dot dot-2" />
                      <span className="cc-thinking-dot dot-3" />
                      <span className="cc-thinking-label">Finding student listings...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips (WhatsApp Pill Carousel) */}
            <div className="cc-wm-chips-bar">
              <span className="cc-wm-chips-hint">⚡ Suggestions:</span>
              <div className="cc-wm-chips-scroll">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    className="cc-wm-chip-btn"
                    onClick={() => send(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom WhatsApp Message Input Box */}
            <form className="cc-wm-input-bar" onSubmit={handleSubmit}>
              <div className="cc-wm-input-wrapper">
                <input
                  type="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Message CartMate (e.g. laptop under 30000, casio calculator)..."
                  maxLength={400}
                />
              </div>

              <button
                type="submit"
                className="cc-wm-send-btn"
                disabled={sending || !text.trim()}
                title="Send Message"
              >
                <span>➤</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
