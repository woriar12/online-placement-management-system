import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Unauthorized page — shown when a user tries to access a resource
 * their role does not permit.
 */
export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
        <h1 className="auth-title" style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>Access Denied</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          You don&apos;t have permission to access this page.
          {user && (
            <> Your current role is <strong style={{ color: 'var(--color-text-primary)' }}>{user.role}</strong>.</>
          )}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ width: 'auto' }}>Go home</Link>
          <button className="btn btn-ghost" onClick={logout} style={{ width: 'auto' }}>Log out</button>
        </div>
      </div>
    </div>
  );
}
