import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import AppShell from "./components/AppShell";
import Welcome from "./pages/Welcome";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Sell from "./pages/Sell";
import ProductDetail from "./pages/ProductDetail";
import SellerProfile from "./pages/SellerProfile";
import Chat from "./pages/Chat";
import MyAds from "./pages/MyAds";
import MyOrders from "./pages/MyOrders";
import WantedBoard from "./pages/WantedBoard";
import Admin from "./pages/Admin";
import AgentFlow from "./pages/AgentFlow";
import "./App.css";
import "./app-shell.css";

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/forgot-password" element={<AuthPage initialMode="forgot" />} />
          <Route element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route path="/home" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/wanted" element={<WantedBoard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/my-ads" element={<MyAds />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/agent-flow" element={<AgentFlow />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
