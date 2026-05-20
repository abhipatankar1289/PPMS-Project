import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Mail, Lock } from 'lucide-react';
import './Register.css'; 

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Ensure your backend is running on 8081 or update to 8080 if integrated
      const res = await axios.post('http://localhost:8080/auth/login', form);

      login(res.data.token, res.data.role);

      // ✅ Changed redirects to match App.jsx routes
      if (res.data.role === 'ADMIN') {
        navigate('/admin'); 
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Login</h2>
        <div className="register-underline"></div>
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

          <button type="submit" className="register-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account?
          <span onClick={() => navigate('/register')} style={{cursor: 'pointer', color: '#007bff'}}> Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;