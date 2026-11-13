import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const INITIAL_REQUESTS = [
  {
    id: "w1",
    student_name: "Rahul Tiwari",
    branch: "CSE",
    semester: 5,
    title: "Urgent: Casio fx-991EX ClassWiz Calculator needed for Maths-III Exam",
    category: "Calculators",
    budget: 240,
    urgency: "urgent", // 'urgent', 'moderate', 'flexible'
    meetup_spot: "Central Library Lawn (AKS University)",
    description: "Need fx-991EX before Friday 9:30 AM practical exam. Can meet anywhere near library or canteen. Cash/UPI ready.",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: "active",
  },
  {
    id: "w2",
    student_name: "Pooja Verma",
    branch: "Civil",
    semester: 3,
    title: "Mini Drafter and Drawing Sheet Holder Tube in good condition",
    category: "Engineering Tools",
    budget: 120,
    urgency: "moderate",
    meetup_spot: "Engineering Block-B Main Gate",
    description: "Looking for an undamaged mini drafter for ED lab. Scale should be straight with intact clamp.",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: "active",
  },
  {
    id: "w3",
    student_name: "Aman Gupta",
    branch: "AI & ML",
    semester: 5,
    title: "Database System Concepts (Silberschatz/Korth) 6th/7th Edition",
    category: "Books",
    budget: 110,
    urgency: "moderate",
    meetup_spot: "Campus Central Canteen",
    description: "Need DBMS textbook for mid-term exams. Highlighted pages are fine as long as text is readable.",
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: "active",
  },
  {
    id: "w4",
    student_name: "Neha Singh",
    branch: "Agriculture",
    semester: 3,
    title: "White Lab Coat (Size M) and Dissection Box",
    category: "Lab & College Essentials",
    budget: 80,
    urgency: "urgent",
    meetup_spot: "Central Library Lawn (AKS University)",
    description: "Needed for genetics & plant pathology practicals starting Monday.",
    created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    status: "active",
  },
  {
    id: "w5",
    student_name: "Vikas Patel",
    branch: "Mechanical",
    semester: 7,
    title: "Hostel Room Electric Kettle (1.5L or 1.8L, Pigeon / Prestige)",
    category: "Hostel Essentials",
    budget: 180,
    urgency: "flexible",
    meetup_spot: "Hostel Block-1 Entrance Gate",
    description: "Working electric kettle required for hot water / maggi in hostel room.",
    created_at: new Date(Date.now() - 3600000 * 52).toISOString(),
    status: "active",
  },
];

const CATEGORIES = ["All", "Calculators", "Books", "Engineering Tools", "Lab & College Essentials", "Hostel Essentials", "Electronics"];

const MEETUP_SPOTS = [
  "Central Library Lawn (AKS University)",
  "Engineering Block-B Main Gate",
  "Campus Central Canteen",
  "Hostel Block-1 Entrance Gate",
  "Administrative Block Fountain",
  "Sports Ground Pavilion",
];

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function WantedBoard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("cc_wanted_requests");
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeUrgency, setActiveUrgency] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    category: "Calculators",
    budget: "",
    urgency: "urgent",
    meetup_spot: MEETUP_SPOTS[0],
    description: "",
  });
  const [postSuccess, setPostSuccess] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("cc_wanted_requests", JSON.stringify(requests));
    } catch {
      // ignore
    }
  }, [requests]);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.budget) return;

    const newReq = {
      id: "w_" + Date.now(),
      student_name: user?.full_name || "Campus Student",
      branch: user?.branch || "B.Tech",
      semester: user?.semester || 5,
      title: form.title.trim(),
      category: form.category,
      budget: Number(form.budget),
      urgency: form.urgency,
      meetup_spot: form.meetup_spot,
      description: form.description.trim(),
      created_at: new Date().toISOString(),
      status: "active",
    };

    setRequests([newReq, ...requests]);
    setPostSuccess("Your wanted request has been posted on the campus board!");
    setTimeout(() => {
      setPostSuccess("");
      setShowPostModal(false);
      setForm({
        title: "",
        category: "Calculators",
        budget: "",
        urgency: "urgent",
        meetup_spot: MEETUP_SPOTS[0],
        description: "",
      });
    }, 1200);
  };

  const filteredRequests = requests.filter((r) => {
    if (activeCategory !== "All" && r.category !== activeCategory) return false;
    if (activeUrgency !== "all" && r.urgency !== activeUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchStudent = r.student_name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchStudent) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "16px 20px 60px" }}>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
        borderRadius: "16px",
        padding: "32px 28px",
        color: "#FFFFFF",
        border: "1px solid #3F3F46",
        borderTop: "3px solid #F59E0B",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        marginBottom: "28px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}>
        <div style={{ maxWidth: "620px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            color: "#F59E0B",
            fontWeight: "700",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            <span>📢</span> AKS Campus Demand Board
          </div>
          <h1 style={{ fontFamily: "'Cinzel', 'Times New Roman', Georgia, serif", fontSize: "28px", fontWeight: "900", margin: "0 0 10px", letterSpacing: "0.02em", color: "#FFFFFF" }}>
            Student "Wanted" Board
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#D4D4D8", lineHeight: "1.6" }}>
            Looking for an urgent textbook, calculator, drafter, or lab kit before exams? Post what you need here so campus peers who already have it can reach out to you immediately!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPostModal(true)}
          style={{
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            color: "#18181B",
            border: "none",
            borderRadius: "12px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(245, 158, 11, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.15s ease",
          }}
        >
          <span style={{ fontSize: "18px" }}>➕</span> Post What You Need
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          {/* Search */}
          <input
            type="search"
            placeholder="Search wanted items, e.g. Casio, DBMS, Drafter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: "1 1 260px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              fontSize: "14px",
              outline: "none",
              color: "#18181B",
            }}
          />

          {/* Urgency Quick Toggle */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "all", label: "All Priorities" },
              { id: "urgent", label: "🔴 Urgent Only" },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setActiveUrgency(u.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: activeUrgency === u.id ? "1px solid #18181B" : "1px solid #E2E8F0",
                  background: activeUrgency === u.id ? "#18181B" : "#F8FAFC",
                  color: activeUrgency === u.id ? "#FFFFFF" : "#64748B",
                }}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: activeCategory === cat ? "700" : "500",
                cursor: "pointer",
                border: activeCategory === cat ? "1px solid #F59E0B" : "1px solid #E2E8F0",
                background: activeCategory === cat ? "#FEF3C7" : "#FFFFFF",
                color: activeCategory === cat ? "#B45309" : "#475569",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {filteredRequests.map((req) => {
          const isUrgent = req.urgency === "urgent";
          return (
            <div
              key={req.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                border: isUrgent ? "1.5px solid #FCD34D" : "1px solid #E2E8F0",
                boxShadow: isUrgent ? "0 4px 16px rgba(245, 158, 11, 0.12)" : "0 2px 6px rgba(0,0,0,0.03)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                {/* Header tags */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "12px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    background: isUrgent ? "#FEF2F2" : "#F1F5F9",
                    color: isUrgent ? "#DC2626" : "#475569",
                    border: isUrgent ? "1px solid #FCA5A5" : "1px solid #E2E8F0",
                  }}>
                    {isUrgent ? "⚡ Urgent Need" : "Standard Need"}
                  </span>

                  <span style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#0F766E",
                    background: "#F0FDFA",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    border: "1px solid #CCFBF1",
                  }}>
                    {req.category}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#18181B",
                  margin: "0 0 10px",
                  lineHeight: "1.4",
                }}>
                  {req.title}
                </h3>

                {/* Budget Pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}>
                  <span style={{ color: "#64748B", fontSize: "12px" }}>Target Budget:</span>
                  <strong style={{ color: "#18181B", fontSize: "15px" }}>Up to {rupees(req.budget)}</strong>
                </div>

                {/* Description */}
                <p style={{ fontSize: "13px", color: "#52525B", lineHeight: "1.5", margin: "0 0 14px" }}>
                  {req.description}
                </p>

                {/* Meetup Spot */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#475569",
                  background: "#F4F4F5",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                }}>
                  <span>📍</span>
                  <span style={{ fontWeight: "600" }}>Meetup:</span> {req.meetup_spot}
                </div>
              </div>

              {/* Footer: Requester & CTA */}
              <div style={{
                borderTop: "1px solid #F1F5F9",
                paddingTop: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#18181B",
                    color: "#F59E0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "12px",
                  }}>
                    {req.student_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#18181B" }}>
                      {req.student_name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#71717A" }}>
                      {req.branch} • Sem {req.semester}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/chat`)}
                  style={{
                    background: "#18181B",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <span>💬</span> I Have This!
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ fontSize: "18px", color: "#18181B", margin: "0 0 6px" }}>No wanted requests found</h3>
          <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px" }}>
            Try selecting a different category or search term, or be the first to post what you need!
          </p>
          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            style={{
              background: "#18181B",
              color: "#F59E0B",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ➕ Post a Request
          </button>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div
          onClick={() => setShowPostModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(24,24,27,0.65)",
            backdropFilter: "blur(4px)",
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
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
          >
            <div style={{
              background: "#18181B",
              color: "#FFFFFF",
              padding: "20px 24px",
              borderBottom: "2px solid #F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Post a Wanted Request</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#F59E0B" }}>
                  Notify campus peers about what you urgently need
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ padding: "24px" }}>
              {postSuccess && (
                <div style={{
                  background: "#DCFCE7",
                  border: "1px solid #86EFAC",
                  color: "#166534",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}>
                  {postSuccess}
                </div>
              )}

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                  Item Title &amp; Details *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio fx-991EX Calculator / Sem 5 DBMS Book"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      background: "#FFFFFF",
                      boxSizing: "border-box",
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                    Max Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="e.g. 150"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                    Urgency Level
                  </label>
                  <select
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      background: "#FFFFFF",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="urgent">🔴 Urgent (Within 24 Hours)</option>
                    <option value="moderate">🟠 Moderate (Before Next Week)</option>
                    <option value="flexible">🟢 Flexible</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                    Campus Meetup Spot
                  </label>
                  <select
                    value={form.meetup_spot}
                    onChange={(e) => setForm({ ...form, meetup_spot: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "13px",
                      background: "#FFFFFF",
                      boxSizing: "border-box",
                    }}
                  >
                    {MEETUP_SPOTS.map((spot) => (
                      <option key={spot} value={spot}>{spot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#18181B", marginBottom: "6px" }}>
                  Specific Note or Requirement
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Any author edition works, needed for lab on Wednesday afternoon..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
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
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#18181B",
                    color: "#F59E0B",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  Publish on Board 📢
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
