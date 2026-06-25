import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import PPMSDashboard from "./pages/PPMSDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/Profile.jsx";

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const effectiveToken = token || localStorage.getItem("token");
  if (!effectiveToken) return <Navigate to="/login" replace />;
  return children;
};

// ================= ADMIN ROUTE =================
const AdminRoute = ({ children }) => {
  const { token, role } = useContext(AuthContext);

  // ✅ Fallback to localStorage in case context hasn't updated yet
  const effectiveToken = token || localStorage.getItem("token");
  const effectiveRole  = role  || localStorage.getItem("role");

  if (!effectiveToken) return <Navigate to="/login" replace />;
  if (effectiveRole !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  const { token, role } = useContext(AuthContext);
  const location = useLocation();

  // ✅ Also fallback to localStorage for navbar visibility
  const effectiveToken = token || localStorage.getItem("token");
  const effectiveRole  = role  || localStorage.getItem("role");

  const hideNavbarOn = ["/login", "/register"];
  const showNavbar = effectiveToken && !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <div className="container">
        <Routes>

          {/* PUBLIC ROUTES — redirect to correct dashboard if already logged in */}
          <Route
            path="/login"
            element={
              effectiveToken
                ? <Navigate to={effectiveRole === "ADMIN" ? "/admin" : "/dashboard"} replace />
                : <Login />
            }
          />
          <Route
            path="/register"
            element={
              effectiveToken
                ? <Navigate to={effectiveRole === "ADMIN" ? "/admin" : "/dashboard"} replace />
                : <Register />
            }
          />

          {/* USER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PPMSDashboard isAdmin={false} />
              </ProtectedRoute>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ABOUT */}
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          {/* CONTACT */}
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </>
  );
}

export default App;