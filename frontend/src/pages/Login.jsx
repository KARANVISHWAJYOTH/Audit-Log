import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, LogIn, UserPlus } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (authError) {
      console.error('Login error:', authError);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-card">
        <div className="login-header text-center">
          <ShieldAlert size={48} className="login-icon mx-auto" />
          <h2>{isSignUp ? 'Create Account' : 'Admin Access'}</h2>
          <p>{isSignUp ? 'Create your admin account to access the AuditLog Platform.' : 'Please log in to access the AuditLog Platform.'}</p>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
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

          <button type="submit" className="btn btn-primary btn-block mt-6" disabled={loading}>
            {loading ? (
              'Processing...'
            ) : (
              <>
                {isSignUp ? <UserPlus size={18} style={{marginRight: '8px'}} /> : <LogIn size={18} style={{marginRight: '8px'}} />}
                {isSignUp ? 'Create Account' : 'Secure Login'}
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
