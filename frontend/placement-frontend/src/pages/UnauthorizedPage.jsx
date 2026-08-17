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
        <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-4)' }}>🔒</div>
        <h1 className="auth-title" style={{ fontSize: 'var(--text-2xl)' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-8)' }}>
          You don&apos;t have permission to access this page.
          {user && (
            <> Your current role is <strong style={{ color: 'var(--color-text-primary)' }}>{user.role}</strong>.</>
          )}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ width: 'auto' }}>Go home</Link>
          <button className="btn btn-ghost" onClick={logout} style={{ width: 'auto' }}>Log out</button>
        </div>
      </div>
    </div>
  );
}
