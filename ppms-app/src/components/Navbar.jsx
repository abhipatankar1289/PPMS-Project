import React from "react";
import { Link } from "react-router-dom";
// Import icons
import { Home, Info, Mail, User, LogOut } from "lucide-react"; 
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">PPMS Dashboard</div>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard">
            <Home size={18} /> Home
          </Link>
        </li>
        <li>
          <Link to="/about">
            <Info size={18} /> About
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <Mail size={18} /> Contact
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <User size={18} /> Profile
          </Link>
        </li>
      </ul>
      <div className="nav-auth">
        <button className="logout-btn" onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}