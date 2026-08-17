import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const stats = [
  { icon: '🏢', label: 'Companies',       value: '34',  colorClass: 'stat-icon-primary' },
  { icon: '📋', label: 'Active Drives',   value: '12',  colorClass: 'stat-icon-success' },
  { icon: '🎓', label: 'Registered',      value: '180', colorClass: 'stat-icon-warning' },
  { icon: '🏆', label: 'Placed',          value: '89',  colorClass: 'stat-icon-info'    },
];

/**
 * Placement Officer dashboard — drive management and student tracking.
 */
export default function PlacementOfficerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PO';

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <div className="auth-logo-icon" style={{ width: 36, height: 36, fontSize: 16, borderRadius: 'var(--radius-sm)' }}>🎓</div>
          PlaceHub <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Placement Office</span>
        </div>
        <div className="dashboard-nav-actions">
          <span className="role-badge role-badge-placement-officer">Placement Officer</span>
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} title={user?.name}>{initials}</div>
          <button id="po-logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Placement Office 💼</h1>
          <p>Coordinate drives, manage company relations, and track student placements.</p>
        </div>

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

        <div style={{
          background: 'var(--gradient-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-5)' }}>Drive Management</h2>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {['Create Drive', 'Manage Companies', 'Student Applications', 'Schedule Interviews', 'Placement Report'].map((action) => (
              <button key={action} className="btn btn-ghost btn-sm" style={{ width: 'auto' }}>{action}</button>
            ))}
          </div>
          <div className="alert alert-info" style={{ marginTop: 'var(--space-6)', marginBottom: 0 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Full drive management features are implemented in feature/company-drive. Authentication and role access are live.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
