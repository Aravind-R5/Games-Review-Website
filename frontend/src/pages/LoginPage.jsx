// -----------------------------------------------
// LoginPage — User Authentication
// -----------------------------------------------
// Login form with username and password.
// Redirects to homepage on successful login.
// -----------------------------------------------

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your GameVault account</p>

        {/* Error Message */}
        {error && (
          <div className="alert alert-custom alert-error py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label-custom">Username</label>
            <input
              type="text"
              className="form-control form-control-dark"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="login-username"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label-custom">Password</label>
            <input
              type="password"
              className="form-control form-control-dark"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="login-password"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Clickable Demo Accounts */}
        <div className="demo-accounts-grid" style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
          
          {/* Admin Demo Card */}
          <div 
            onClick={() => { setUsername('admin'); setPassword('admin123'); }}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="demo-card"
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Admin Account (Click to fill):</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              User: <strong style={{ color: '#f5c518' }}>admin</strong> | Pass: <strong style={{ color: '#f5c518' }}>admin123</strong>
            </p>
          </div>

          {/* User Demo Card */}
          <div 
            onClick={() => { setUsername('gamer_pro'); setPassword('password123'); }}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="demo-card"
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Demo User (Click to fill):</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              User: <strong style={{ color: '#f5c518' }}>gamer_pro</strong> | Pass: <strong style={{ color: '#f5c518' }}>password123</strong>
            </p>
          </div>

        </div>

        {/* Register Link */}
        <p className="auth-link">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
