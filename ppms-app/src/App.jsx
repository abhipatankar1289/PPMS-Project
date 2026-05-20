import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "./context/AuthContext.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";

import PPMSDashboard from "./pages/PPMSDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";


// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ================= ADMIN ROUTE =================
const AdminRoute = ({ children }) => {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


function App() {

  const { token } = useContext(AuthContext);

  return (
    <>
      {token && <Navbar />}

      <div className="container">

        <Routes>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* USER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PPMSDashboard />
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

          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>

      </div>
    </>
  );
}

export default App;