import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';
import './Login.css';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded mock credentials for demo purposes
    if (email === 'admin@auditlog.com' && password === 'admin123') {
      setAuth(true);
      navigate('/');
    } else {
      setError('Invalid admin credentials. (Hint: admin@auditlog.com / admin123)');
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-card">
        <div className="login-header text-center">
          <ShieldAlert size={48} className="login-icon mx-auto" />
          <h2>Admin Access</h2>
          <p>Please log in to access the AuditLog Platform.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required
              placeholder="admin@auditlog.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-6">
            <LogIn size={18} style={{marginRight: '8px'}} /> Secure Login
          </button>
        </form>

        <div className="login-footer text-center">
          <p>Demo Credentials: <code>admin@auditlog.com</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
