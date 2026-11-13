import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const rows = [
    ["Name", user?.full_name],
    ["Email", user?.email],
    ["Campus", user?.college || user?.university],
    ["Branch", user?.branch],
    ["Semester", user?.semester],
  ];

  return (
    <div>
      <h1 className="cc-page-title">My Profile</h1>
      <p className="cc-page-subtitle">Your CampusCart student account.</p>

      <div className="cc-profile-card">
        <div className="cc-avatar">{(user?.full_name || "S").slice(0, 1).toUpperCase()}</div>
        <dl className="cc-profile-list">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "-"}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className="cc-logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}