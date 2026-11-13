import React, { useState } from "react";

const NODE_DATA = {
  agent: {
    icon: "🤖",
    title: "CartMate AI Agent (Tools Agent)",
    desc: "Central orchestrator routing student queries to Gemini 1.5 Flash, short-term memory buffers, and campus micro-tools.",
    status: "STATUS: ACTIVE • READY",
  },
  model: {
    icon: "🧠",
    title: "Gemini 1.5 Flash Model",
    desc: "Multilingual LLM communicating in English, Hindi (Devanagari), and Hinglish with safety guardrails.",
    status: "STATUS: CONNECTED • 150MS",
  },
  memory: {
    icon: "💾",
    title: "Session Context Buffer",
    desc: "Maintains the last 6 conversational turns for seamless follow-up questions.",
    status: "STATUS: BUFFERED (6 TURNS)",
  },
  tools: {
    icon: "⚙️",
    title: "Automated Tool Dispatcher",
    desc: "Dispatches student requests to price estimators, OTP validators, and catalog filters.",
    status: "STATUS: 3 TOOLS MOUNTED",
  },
  price: {
    icon: "🏷️",
    title: "Fair-Price Algorithmic Tool",
    desc: "Calculates fair student-to-student resale pricing (40%–70% of retail MRP based on wear).",
    status: "STATUS: ALGORITHM ONLINE",
  },
  otp: {
    icon: "🔒",
    title: "Handover OTP Engine",
    desc: "Generates and validates the cryptographically secure 6-digit in-person exchange code.",
    status: "STATUS: ZERO-FRAUD VERIFIED",
  },
};

export default function AgentFlow() {
  const [activeNode, setActiveNode] = useState("agent");
  const [pulsing, setPulsing] = useState(false);

  const current = NODE_DATA[activeNode] || NODE_DATA.agent;

  const handleSimulate = () => {
    setPulsing(true);
    setActiveNode("agent");
    setTimeout(() => {
      setActiveNode("price");
      setTimeout(() => setPulsing(false), 2000);
    }, 900);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header Bar */}
      <div style={{
        background: "#ffffff",
        border: "1.5px solid #e2eaf0",
        borderRadius: 20,
        padding: "20px 24px",
        marginBottom: 24,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", background: "rgba(16,185,129,0.12)", color: "#047857", padding: "3px 10px", borderRadius: 9999, border: "1px solid rgba(16,185,129,0.25)" }}>
              Interactive AI Flow
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706" }}>
              Light Theme Architecture Canvas
            </span>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#12304a", margin: 0 }}>
            CartMate AI • Agent Workflow &amp; Tools Architecture
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#5d7080", margin: "4px 0 0" }}>
            Visual interactive representation of how CartMate coordinates LLM models, conversation memory, and campus tools.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            background: pulsing ? "#059669" : "#10b981",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.85rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s"
          }}
        >
          <span>⚡</span>
          <span>{pulsing ? "Transmitting Query..." : "Simulate Agent Query"}</span>
        </button>
      </div>

      {/* Main Dot Grid Canvas */}
      <div style={{
        background: "#f8fafc radial-gradient(#cbd5e1 1.25px, transparent 1.25px)",
        backgroundSize: "24px 24px",
        border: "2px solid #e2eaf0",
        borderRadius: 24,
        padding: "36px 20px",
        minHeight: 520,
        position: "relative",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.02)",
        overflow: "hidden"
      }}>
        {/* SVG Bezier Curves */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
          <path d="M 440,240 C 350,240 320,130 220,130" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={pulsing ? "6 6" : "none"} strokeLinecap="round" />
          <path d="M 480,290 C 460,370 380,400 300,400" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 560,240 C 650,240 680,140 760,140" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={pulsing ? "6 6" : "none"} strokeLinecap="round" />
          <path d="M 850,140 C 900,140 910,210 930,230" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M 850,140 C 900,140 910,320 930,340" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Nodes Grid Layout */}
        <div style={{ position: "relative", width: "100%", height: 460 }}>
          {/* CENTER NODE: CartMate Tools Agent */}
          <div
            onClick={() => setActiveNode("agent")}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 250,
              background: "#ffffff",
              border: `2.5px solid ${activeNode === "agent" ? "#10b981" : "#e2eaf0"}`,
              borderRadius: 20,
              padding: 16,
              boxShadow: activeNode === "agent" ? "0 12px 28px rgba(16,185,129,0.2)" : "0 8px 20px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              zIndex: 10
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#ecfdf5", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                🤖
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#0f172a" }}>CartMate AI</h4>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#059669" }}>Tools Agent</span>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
              <span style={{ color: "#10b981" }}>● Active Orchestrator</span>
              <span>Gemini 1.5</span>
            </div>
          </div>

          {/* LEFT NODE: Chat Model */}
          <div
            onClick={() => setActiveNode("model")}
            style={{
              position: "absolute",
              left: 40,
              top: 80,
              width: 190,
              background: "#ffffff",
              border: `2px solid ${activeNode === "model" ? "#10b981" : "#e2eaf0"}`,
              borderRadius: 16,
              padding: 14,
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#059669" }}>LLM Model</span>
            <h5 style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Chat Model</h5>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>Gemini 1.5 Flash</p>
          </div>

          {/* BOTTOM LEFT: Memory */}
          <div
            onClick={() => setActiveNode("memory")}
            style={{
              position: "absolute",
              left: 140,
              bottom: 30,
              width: 190,
              background: "#ffffff",
              border: `2px solid ${activeNode === "memory" ? "#64748b" : "#e2eaf0"}`,
              borderRadius: 16,
              padding: 14,
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#64748b" }}>Conversation</span>
            <h5 style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Short-Term Memory</h5>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>Last 6 Dialog Turns</p>
          </div>

          {/* RIGHT TOP: Tool Dispatcher */}
          <div
            onClick={() => setActiveNode("tools")}
            style={{
              position: "absolute",
              right: 180,
              top: 90,
              width: 200,
              background: "#ffffff",
              border: `2px solid ${activeNode === "tools" ? "#f59e0b" : "#e2eaf0"}`,
              borderRadius: 16,
              padding: 14,
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#d97706" }}>Campus Micro-Tools</span>
            <h5 style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Tool Dispatcher</h5>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>Automated Execution</p>
          </div>

          {/* RIGHT SUB-TOOL: Price Estimator */}
          <div
            onClick={() => setActiveNode("price")}
            style={{
              position: "absolute",
              right: 10,
              top: 180,
              width: 175,
              background: "#ffffff",
              border: `2px solid ${activeNode === "price" ? "#f59e0b" : "#e2eaf0"}`,
              borderRadius: 14,
              padding: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 800, color: "#d97706", textTransform: "uppercase" }}>Tool #1</span>
            <h6 style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 800, color: "#0f172a" }}>Fair-Price Suggester</h6>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b" }}>40%–70% retail formula</p>
          </div>

          {/* RIGHT SUB-TOOL: OTP Validator */}
          <div
            onClick={() => setActiveNode("otp")}
            style={{
              position: "absolute",
              right: 10,
              bottom: 60,
              width: 175,
              background: "#ffffff",
              border: `2px solid ${activeNode === "otp" ? "#10b981" : "#e2eaf0"}`,
              borderRadius: 14,
              padding: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>Tool #2</span>
            <h6 style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 800, color: "#0f172a" }}>Handover OTP Engine</h6>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: "#64748b" }}>6-digit secure trade</p>
          </div>
        </div>
      </div>

      {/* Detail Inspector Bar at Bottom */}
      <div style={{
        marginTop: 20,
        background: "#ffffff",
        border: "1.5px solid #e2eaf0",
        borderRadius: 18,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>{current.icon}</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#0f172a" }}>{current.title}</h4>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{current.desc}</p>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, background: "#f1f5f9", color: "#334155", padding: "4px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}>
          {current.status}
        </span>
      </div>
    </div>
  );
}
