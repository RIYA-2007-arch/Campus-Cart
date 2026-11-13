import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("cc_user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = useCallback(async () => {
    try {
      const response = await api.get("/wishlist");
      setWishlist(response.data.wishlist || []);
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    if (user) loadWishlist();
    else setWishlist([]);
  }, [user, loadWishlist]);

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener("cc-auth-expired", handleExpired);
    return () => window.removeEventListener("cc-auth-expired", handleExpired);
  }, []);

  const login = (firstArg, secondArg) => {
    // Robust: handles both login(user, token) and login(token, user)
    let token = "";
    let userData = null;

    if (typeof firstArg === "string") {
      token = firstArg;
      userData = secondArg;
    } else {
      userData = firstArg;
      token = secondArg;
    }

    if (token) localStorage.setItem("cc_token", token);
    if (userData) {
      localStorage.setItem("cc_user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    setUser(null);
  };

  const wishlistIds = new Set(wishlist.map((product) => Number(product.product_id)));

  const toggleWishlist = async (productId) => {
    const id = Number(productId);
    try {
      if (wishlistIds.has(id)) {
        await api.delete("/wishlist", { data: { product_id: id } });
      } else {
        await api.post("/wishlist", { product_id: id });
      }
      await loadWishlist();
    } catch {
      // silently ignore wishlist error
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, wishlist, wishlistIds, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}
