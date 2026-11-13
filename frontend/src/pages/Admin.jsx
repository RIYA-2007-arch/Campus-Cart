import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [statsResponse, reportsResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/reports"),
      ]);
      setStats(statsResponse.data);
      setReports(reportsResponse.data.reports || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin data.");
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user, load]);

  const act = async (report, action) => {
    try {
      await api.post(`/admin/reports/${report.id}`, { action });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the report.");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="cc-empty-card">
        <p>Admin access only. Add your email to ADMIN_EMAILS in backend/.env, restart the backend and log in again.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="cc-page-title">Admin Panel</h1>
      <p className="cc-page-subtitle">Platform overview and reported listings.</p>

      {error && <p className="cc-alert error">{error}</p>}

      {stats && (
        <div className="cc-stats">
          <div><strong>{stats.users}</strong><span>Users</span></div>
          <div><strong>{stats.products}</strong><span>Products</span></div>
          <div><strong>{stats.pending_reports}</strong><span>Pending reports</span></div>
          <div><strong>{stats.completed_handovers}</strong><span>Handovers</span></div>
        </div>
      )}

      <h2 className="cc-section-title">Reports</h2>
      {reports.length === 0 ? (
        <p className="cc-empty">No reports yet.</p>
      ) : (
        <div className="cc-table-wrap">
          <table className="cc-table">
            <thead>
              <tr><th>Product</th><th>Reason</th><th>Reported by</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td><Link to={`/product/${report.product_id}`}>{report.product_name}</Link></td>
                  <td>{report.reason}{report.details ? ` — ${report.details}` : ""}</td>
                  <td>{report.reporter_name}</td>
                  <td>{report.status}</td>
                  <td>
                    {report.status === "pending" ? (
                      <>
                        <button type="button" className="cc-btn small" onClick={() => act(report, "remove")}>Remove listing</button>{" "}
                        <button type="button" className="cc-btn ghost small" onClick={() => act(report, "dismiss")}>Dismiss</button>
                      </>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}