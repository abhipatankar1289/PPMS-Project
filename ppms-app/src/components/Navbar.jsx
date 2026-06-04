import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// Import icons
import { Home, Info, Mail, User, LogOut } from "lucide-react"; 
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { role, logout } = useContext(AuthContext);

  const homePath = role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <nav className="navbar">
      <div className="nav-logo">PPMS Dashboard</div>
      <ul className="nav-links">
        <li>
          <Link to={homePath}>
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
        <button
          className="logout-btn"
          onClick={() => {
            // clear auth via context so state updates across app
            logout();
            navigate("/login");
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}