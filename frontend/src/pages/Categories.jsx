import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { iconFor } from "../categoryIcons";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories")
      .then((response) => setCategories(response.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="cc-page-title">Categories</h1>
      <p className="cc-page-subtitle">Browse products made for student life.</p>

      {loading ? (
        <p className="cc-empty">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="cc-empty">No categories found.</p>
      ) : (
        <div className="cc-cat-grid">
          {categories.map((item) => (
            <Link
              key={item.category_id}
              to={`/browse?category=${encodeURIComponent(item.category_name)}`}
              className="cc-cat-card"
            >
              <span className="cc-cat-icon">{iconFor(item.category_name)}</span>
              <span>{item.category_name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}