import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/sellers/${id}`)
      .then((response) => {
        setSeller(response.data.seller);
        setItems(response.data.items || []);
        setError("");
      })
      .catch((err) => setError(err.response?.data?.message || "Seller could not be loaded."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="cc-empty">Loading seller...</p>;

  if (error || !seller) {
    return (
      <div className="cc-empty-card">
        <p>{error || "Seller not found."}</p>
        <Link to="/home" className="cc-primary-link">Back to home</Link>
      </div>
    );
  }

  const since = seller.member_since
    ? new Date(seller.member_since).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "";

  return (
    <div>
      <div className="cc-seller-head">
        <div className="cc-avatar">{(seller.full_name || "S").slice(0, 1).toUpperCase()}</div>
        <div>
          <h1 className="cc-page-title">{seller.full_name}</h1>
          <p className="cc-page-subtitle">
            {[seller.college, seller.branch, seller.semester ? `Semester ${seller.semester}` : ""].filter(Boolean).join(" • ")}
            {since ? ` • Member since ${since}` : ""}
          </p>
          <p className="cc-page-subtitle">{items.length} active ad{items.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="cc-empty">No active ads from this seller.</p>
      ) : (
        <div className="cc-grid">
          {items.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}