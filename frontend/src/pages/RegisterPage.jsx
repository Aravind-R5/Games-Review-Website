// -----------------------------------------------
// RegisterPage — New User Registration
// -----------------------------------------------
// Registration form with username, email, and password.
// Auto-logs in after successful registration.
// -----------------------------------------------

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Join GameVault</h2>
        <p className="auth-subtitle">Create your account and start reviewing</p>

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
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="register-username"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label-custom">Email</label>
            <input
              type="email"
              className="form-control form-control-dark"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="register-email"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label-custom">Password</label>
            <input
              type="password"
              className="form-control form-control-dark"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="register-password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label-custom">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-dark"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="register-confirm-password"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
