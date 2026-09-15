import React from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Bell,
  Sun,
  Image as ImageIcon,
} from "lucide-react";

import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nexus-navbar">
      <div className="navbar-container">

        {/* Brand */}
        <div className="navbar-brand">
          <ImageIcon className="brand-icon" size={25} strokeWidth={1.5} />
          <span>Nexus Technologies</span>
        </div>

        {/* Navigation */}
        <div className="navbar-menu">
          <a href="#" className="nav-link active">
            Home
          </a>

          <a href="#" className="nav-link">
            Products
          </a>

          <a href="#" className="nav-link">
            Categories
          </a>

          <a href="#" className="nav-link">
            About
          </a>

          <a href="#" className="nav-link">
            Support
          </a>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">

          {/* Search */}
          <button className="nav-icon-btn">
            <Search size={24} strokeWidth={1.8} />
          </button>

          {/* Wishlist */}
          <button className="nav-icon-btn notification-icon">
            <Heart size={24} strokeWidth={1.8} />
            <span className="badge-count">2</span>
          </button>

          {/* Cart */}
          <button className="nav-icon-btn notification-icon">
            <ShoppingBag size={23} strokeWidth={1.8} />
            <span className="badge-count">1</span>
          </button>

          {/* Notification */}
          <button className="nav-icon-btn">
            <Bell size={24} strokeWidth={1.8} />
          </button>

          {/* Theme */}
          <button className="theme-btn">
            <Sun size={21} strokeWidth={1.8} />
          </button>

          {/* View Products */}
          <button className="view-products-btn">
            View Products
          </button>

          {/* User */}
          <button className="user-btn">
            U
          </button>

        </div>
      </div>
    </nav>
  );
}