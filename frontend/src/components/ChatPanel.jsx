import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function ChatPanel({ productId, otherId, otherName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const response = await api.get("/chat/messages", {
        params: { product_id: productId, other_id: otherId },
      });
      setMessages(response.data.messages || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load messages.");
    }
  }, [productId, otherId]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;

    setSending(true);
    try {
      await api.post("/chat/messages", {
        product_id: productId,
        receiver_id: otherId,
        message,
      });
      setText("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="cc-chat">
      <div className="cc-chat-head">Chat with {otherName}</div>

      <div className="cc-chat-list" ref={listRef}>
        {messages.length === 0 && !error && (
          <p className="cc-chat-empty">No messages yet. Say hello and ask about the product.</p>
        )}
        {messages.map((item) => {
          const mine = Number(item.sender_id) === Number(user?.user_id);
          return (
            <div key={item.id} className={`cc-bubble ${mine ? "mine" : "theirs"}`}>
              {item.message}
            </div>
          );
        })}
      </div>

      {error && <p className="cc-alert error">{error}</p>}

      <form className="cc-chat-form" onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type your message..."
          maxLength={2000}
        />
        <button type="submit" disabled={sending}>{sending ? "..." : "Send"}</button>
      </form>
    </div>
  );
}