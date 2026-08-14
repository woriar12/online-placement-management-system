import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route Guard enforcing authenticated session and ADMIN role access.
 */
export default function ProtectedRoute({ allowedRoles = ['ADMIN'] }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#64748b', fontWeight: '500' }}>Verifying Admin Credentials...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If unauthenticated or user doesn't have ADMIN role, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toUpperCase() : '';
  const hasAccess = allowedRoles.some((r) => r.toUpperCase() === userRole || `ROLE_${r.toUpperCase()}` === userRole);

  if (!hasAccess && userRole !== 'ADMIN' && userRole !== 'ROLE_ADMIN') {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#e11d48', marginBottom: '0.5rem' }}>403 - Access Denied</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You do not have administrative privileges to access this area.</p>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return <Outlet />;
}
