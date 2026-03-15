// -----------------------------------------------
// Auth Context — Global Authentication State
// -----------------------------------------------
// Provides user authentication state to the entire app.
// Components can use useAuth() to access login/logout.
// -----------------------------------------------

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/api';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides auth state.
 * It stores the user and token in localStorage for persistence.
 */
export function AuthProvider({ children }) {
  // State: current user and token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // On mount, restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  /**
   * Login with username and password.
   * Stores token and user in localStorage.
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await loginUser({ username, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new account.
   * Automatically logs in after registration.
   */
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await registerUser({ username, email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const errors = error.response?.data;
      const errorMsg = errors
        ? Object.values(errors).flat().join(', ')
        : 'Registration failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user.
   * Clears token and user from localStorage.
   */
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Token might already be invalid, that's fine
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Value object passed to consumers
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context.
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
