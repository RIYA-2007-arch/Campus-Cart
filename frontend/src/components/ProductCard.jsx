import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { timeAgo } from "../timeAgo";

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ProductCard({ product }) {
  const { wishlistIds, toggleWishlist } = useAuth();

  const id = Number(product.product_id);
  const liked = wishlistIds.has(id);
  const price = Number(product.price || 0);
  const original = Number(product.original_price || 0);
  const target = `/product/${id}`;
  const posted = timeAgo(product.created_at);

  const meta = [
    product.branch,
    product.semester ? `Semester ${product.semester}` : null,
    product.category,
  ].filter(Boolean).join(" • ");

  const handleHeart = async () => {
    const problem = await toggleWishlist(id);
    if (problem) window.alert(problem);
  };

  return (
    <article className="cc-card">
      <div className="cc-card-image">
        <Link to={target} className="cc-card-link" aria-label={`View ${product.product_name}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const next = e.currentTarget.nextElementSibling;
                if (next) next.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            className="cc-card-placeholder"
            style={{ display: product.image_url ? 'none' : 'flex' }}
          >
            {(product.category || "CC").slice(0, 2).toUpperCase()}
          </span>
        </Link>
        {product.condition && <span className="cc-badge">{product.condition}</span>}
        <button
          type="button"
          className={`cc-heart ${liked ? "active" : ""}`}
          onClick={handleHeart}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          title={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>

      <Link to={target} className="cc-card-body">
        <h3>{product.product_name}</h3>
        <p className="cc-card-meta">{meta || "Student product"}</p>
        <div className="cc-price-row">
          <span className="cc-price">{rupees(price)}</span>
          {original > price && <span className="cc-original">{rupees(original)}</span>}
          {original > price && <span className="cc-save">Save {rupees(original - price)}</span>}
        </div>
        <p className="cc-card-campus">
          <span style={{ color: "#166534", fontWeight: "700", marginRight: "6px" }}>🎓 Verified</span>
          {[product.college || "AKS University", posted].filter(Boolean).join(" · ")}
        </p>
      </Link>

      <div style={{ padding: "0 14px 14px", marginTop: "-4px" }}>
        <Link to={target} className="cc-card-buy-btn">
          🛍️ Buy / Order Now
        </Link>
      </div>
    </article>
  );
}
