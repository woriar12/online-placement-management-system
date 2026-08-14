import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const userName = user?.email ? user.email.split('@')[0] : 'Placement Officer';

  return (
    <header
      className="admin-navbar no-print"
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Toggle Navigation"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Management Console</span>
          <span className="badge badge-info">Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Quick Date/Time Indicator */}
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid #e2e8f0' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.9rem',
              border: '2px solid #38bdf8',
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', textTransform: 'capitalize' }}>
              {userName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
