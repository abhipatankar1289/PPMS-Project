import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const navigate = useNavigate();

  useEffect(() => {
    setForm({ name: '', email: '', password: '', role: 'USER' });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/register', form);
      alert('✅ Registration Successful!');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Register Account</h2>
        <div className="register-underline"></div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
              <User size={18} className="input-icon" />
            </div>
          </div>

          <div className="input-group">
            <label>Your Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                autoComplete="new-email" 
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
                value={form.password}
                onChange={handleChange}
                placeholder="Your Password"
                autoComplete="new-password"
                required
              />
              <Lock size={18} className="input-icon" />
            </div>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>

          <p className="auth-footer">
            Already have an account?
            <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: '#007bff'}}> Sign In</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;