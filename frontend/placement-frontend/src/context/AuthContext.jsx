import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Provides global authentication state and actions throughout the app.
 *
 * Persists session in localStorage; restores on page reload.
 * Exposes role-check helpers (isAdmin, isStudent, isPlacementOfficer).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Session Restore ────────────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user session', e);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      const { accessToken, refreshToken, user: userData } = response.data.data;

      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // ── Register ───────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password, role) => {
    setError(null);
    try {
      const response = await authService.register(name, email, password, role);
      const { accessToken, refreshToken, user: userData } = response.data.data;

      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_) {
      // Best-effort — always clear local state
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }, []);

  // ── Role Helpers ───────────────────────────────────────────────────
  const isAdmin             = user?.role === 'ADMIN';
  const isStudent           = user?.role === 'STUDENT';
  const isPlacementOfficer  = user?.role === 'PLACEMENT_OFFICER';
  const isAuthenticated     = !!token;

  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isStudent,
    isPlacementOfficer,
    hasRole,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
