import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import { iconFor } from "../categoryIcons";
import ProductCard from "../components/ProductCard";
import "./home-modern.css";

export default function Home() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [fresh, setFresh] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const firstName = (user?.full_name || "Student").split(" ")[0];

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const categoryResponse = await api.get("/categories");
        const list = categoryResponse.data.categories || [];

        const [freshResponse, ...rowResponses] = await Promise.all([
          api.get("/market", { params: { limit: 16 } }),
          ...list.map((item) => api.get("/market", { params: { category: item.category_name, limit: 8 } })),
        ]);

        if (cancelled) return;
        setCategories(list);
        setFresh(freshResponse.data.items || []);
        setRows(
          list
            .map((item, index) => ({
              category: item,
              items: rowResponses[index].data.items || [],
              total: rowResponses[index].data.total || 0,
            }))
            .filter((row) => row.items.length > 0)
        );
        setError("");
      } catch {
        if (!cancelled) setError("Products could not be loaded. Please ensure the backend server is running.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter fresh items based on selected category tab
  const displayedItems = activeCategory === "all"
    ? fresh
    : fresh.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="viva-home-container">
      {/* ── 1. Top Hero Showcase: Exact VIVA / United Deals Yellow Aesthetic ── */}
      <section className="viva-hero-banner">
        <div className="viva-hero-content">
          <div className="viva-hero-tag">
            <span>✨</span> 100% VERIFIED STUDENT MARKETPLACE • AKS UNIVERSITY
          </div>
          <h1 className="viva-hero-title">
            Elevate Your <span className="viva-text-gold">Campus Life.</span>
          </h1>
          <p className="viva-hero-desc">
            Verified engineering laptops, calculators, lab coats &amp; semester textbooks directly from AKS students. Zero shipping fee, 100% verified Handover OTP.
          </p>
          <div className="viva-hero-actions">
            <Link to="/browse" className="viva-btn-primary">
              Shop Marketplace ➔
            </Link>
            <Link to="/sell" className="viva-btn-secondary">
              <span>➕</span> Sell Your Old Items
            </Link>
          </div>
        </div>

        <div className="viva-hero-decor">
          <div className="viva-hero-badge-card highlight">
            <span className="viva-hero-badge-icon">🎓</span>
            <div>
              <strong>Welcome, {firstName}!</strong>
              <p>AKS University, Satna</p>
            </div>
          </div>
          <div className="viva-hero-badge-card">
            <span className="viva-hero-badge-icon">🛡️</span>
            <div>
              <strong>6-Digit Handover OTP</strong>
              <p>Pay only after physical inspection</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Circular Category Pills Navigation (VIVA Style) ── */}
      <section className="viva-category-strip">
        <div className="viva-strip-scroll">
          <button
            type="button"
            className={`viva-cat-pill ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            <div className="viva-cat-icon-circle">🔥</div>
            <span className="viva-cat-name">All Items</span>
          </button>
          {categories.map((item) => (
            <button
              key={item.category_id}
              type="button"
              className={`viva-cat-pill ${activeCategory === item.category_name ? "active" : ""}`}
              onClick={() => setActiveCategory(item.category_name)}
            >
              <div className="viva-cat-icon-circle">{iconFor(item.category_name)}</div>
              <span className="viva-cat-name">{item.category_name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. Quick Feature Highlights (Amazon / Viva 3-Column Banner) ── */}
      <section className="viva-feature-grid">
        <div className="viva-feature-card">
          <div className="viva-feature-header">
            <h3>Laptops &amp; Tech</h3>
            <span className="viva-feature-badge gold">Ryzen &amp; Intel</span>
          </div>
          <p className="viva-feature-text">ASUS Vivobook (₹40k), TUF Ryzen 7 (₹45k), HP Pavilion, Dell &amp; MacBook Air tested for labs.</p>
          <Link to="/browse?category=Laptops%20%26%20Computers" className="viva-feature-link">
            Explore Laptops ➔
          </Link>
        </div>

        <div className="viva-feature-card warm">
          <div className="viva-feature-header">
            <h3>Calculators</h3>
            <span className="viva-feature-badge gold">₹120 – ₹240</span>
          </div>
          <p className="viva-feature-text">Exam approved Casio fx-991EX ClassWiz, fx-991ES Plus, and fx-82MS with natural display.</p>
          <Link to="/browse?category=Calculators" className="viva-feature-link">
            View Calculators ➔
          </Link>
        </div>

        <div className="viva-feature-card">
          <div className="viva-feature-header">
            <h3>Lab Coats &amp; Jackets</h3>
            <span className="viva-feature-badge gold">₹150 – ₹450</span>
          </div>
          <p className="viva-feature-text">White lab coats (₹150-200), winter jackets (₹450), drafter sets, hostel lamps &amp; essentials.</p>
          <Link to="/browse?category=College%20Essentials" className="viva-feature-link">
            Shop Essentials ➔
          </Link>
        </div>
      </section>

      {/* ── 4. Main Products Showcase ── */}
      {loading ? (
        <div className="viva-loading-state">
          <div className="viva-spinner" />
          <p>Loading verified campus products...</p>
        </div>
      ) : error ? (
        <div className="viva-error-state">
          <p>⚠️ {error}</p>
        </div>
      ) : (
        <>
          {/* Top Picks For You / Filtered Active Items */}
          <section className="viva-shelf-section">
            <div className="viva-shelf-header">
              <div>
                <span className="viva-shelf-pill gold">
                  {activeCategory === "all" ? "RECOMMENDED FOR YOU" : activeCategory.toUpperCase()}
                </span>
                <h2 className="viva-shelf-title">
                  {activeCategory === "all" ? "Top Picks For You" : `${activeCategory} Listings`}
                </h2>
              </div>
              <Link to="/browse" className="viva-shelf-more">
                See all in marketplace ➔
              </Link>
            </div>

            {displayedItems.length === 0 ? (
              <p className="viva-empty">No products found in this category. Browse all listings!</p>
            ) : (
              <div className="viva-product-grid">
                {displayedItems.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Categorized Shelves (When viewing All) */}
          {activeCategory === "all" &&
            rows.map((row) => (
              <section className="viva-shelf-section" key={row.category.category_id}>
                <div className="viva-shelf-header">
                  <div>
                    <span className="viva-shelf-pill gold">VERIFIED SHELF</span>
                    <h2 className="viva-shelf-title">
                      {iconFor(row.category.category_name)} {row.category.category_name}
                    </h2>
                  </div>
                  <Link
                    to={`/browse?category=${encodeURIComponent(row.category.category_name)}`}
                    className="viva-shelf-more"
                  >
                    View all ({row.total}) ➔
                  </Link>
                </div>

                <div className="viva-product-grid">
                  {row.items.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
              </section>
            ))}
        </>
      )}
    </div>
  );
}
