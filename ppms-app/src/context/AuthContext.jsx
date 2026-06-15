import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole]   = useState(localStorage.getItem("role"));
  const [verified, setVerified] = useState(false); // ← NEW: don't render until checked

  // ✅ On every page load/refresh, verify token with backend
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setVerified(true); // no token, nothing to verify
      return;
    }

    axios
      .get(`${BACKEND_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        // Token is valid — trust the role from backend response
        setToken(storedToken);
        setRole(res.data.role);
        localStorage.setItem("role", res.data.role); // sync in case it changed
      })
      .catch(() => {
        // Token is invalid or expired — force logout
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      })
      .finally(() => {
        setVerified(true);
      });
  }, []);

  const login = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  // ⏳ Don't render children until token is verified
  // This prevents the admin page from flashing before redirect
  if (!verified) {
    return (
      <div style={{
        display: "flex", justifyContent: "center",
        alignItems: "center", height: "100vh", fontSize: "16px", color: "#555"
      }}>
        Verifying session...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};