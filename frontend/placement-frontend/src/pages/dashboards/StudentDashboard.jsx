import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const stats = [
  { icon: '📋', label: 'Active Drives',  value: '12', colorClass: 'stat-icon-primary' },
  { icon: '✅', label: 'Applied',         value: '5',  colorClass: 'stat-icon-success' },
  { icon: '📅', label: 'Interviews',      value: '2',  colorClass: 'stat-icon-warning' },
  { icon: '🏆', label: 'Offers Received', value: '1',  colorClass: 'stat-icon-info'    },
];

/**
 * Student dashboard — entry point after student login.
 */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="dashboard-page">
      {/* Nav */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <div className="auth-logo-icon" style={{ width: 36, height: 36, fontSize: 16, borderRadius: 'var(--radius-sm)' }}>🎓</div>
          PlaceHub
        </div>
        <div className="dashboard-nav-actions">
          <span className="role-badge role-badge-student">Student</span>
          <div className="avatar" title={user?.name}>{initials}</div>
          <button
            id="student-logout-btn"
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Track your placement journey and discover new opportunities.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.colorClass}`}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'var(--gradient-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-5)', color: 'var(--color-text-primary)' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {['Browse Drives', 'My Applications', 'Profile & Resume', 'Notifications'].map((action) => (
              <button key={action} className="btn btn-ghost btn-sm" style={{ width: 'auto' }}>
                {action}
              </button>
            ))}
          </div>
          <div className="alert alert-info" style={{ marginTop: 'var(--space-6)', marginBottom: 0 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Full features coming in upcoming feature branches. This dashboard is your authenticated landing zone.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
