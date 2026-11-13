import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useAuth();

  return (
    <div>
      <h1 className="cc-page-title">My Wishlist</h1>
      <p className="cc-page-subtitle">Products you saved for later.</p>

      {wishlist.length === 0 ? (
        <div className="cc-empty-card">
          <p>Your wishlist is empty. Tap the heart on any product to save it here.</p>
          <Link to="/home" className="cc-primary-link">Browse products</Link>
        </div>
      ) : (
        <div className="cc-grid">
          {wishlist.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}