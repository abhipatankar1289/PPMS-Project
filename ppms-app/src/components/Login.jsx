import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Mail, Lock } from 'lucide-react';
import './Register.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const authBaseUrl = import.meta.env.VITE_AUTH_BASE_URL || `${backendUrl}/auth`;

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${authBaseUrl}/login`, form);

      // Normalize role — handles "ADMIN", "admin", "ROLE_ADMIN"
      const rawRole = res.data.role || "";
      const role = String(rawRole).toUpperCase().replace("ROLE_", "").trim();

      // ✅ Save to localStorage FIRST — synchronous so AdminRoute reads it instantly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      // ✅ Then update context
      login(res.data.token, role);

      // ✅ Small delay so context state settles before route guard checks it
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 100);

    } catch (err) {
      setError(err.response?.data || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Login</h2>
        <div className="register-underline"></div>

        {error && (
          <div style={{
            background: "#fdecea",
            color: "#c0392b",
            border: "1px solid #e74c3c",
            borderRadius: "6px",
            padding: "10px 14px",
            marginBottom: "14px",
            fontSize: "13px",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Mail size={18} className="input-icon" />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Lock size={18} className="input-icon" />
            </div>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?
          <span
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer', color: '#007bff' }}
          > Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;