import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_DASHBOARDS = {
  STUDENT: '/dashboard/student',
  PLACEMENT_OFFICER: '/dashboard/placement-officer',
};

const ROLES = [
  { value: 'STUDENT', label: 'Student', emoji: '🎓', desc: 'Looking for placement opportunities' },
  { value: 'PLACEMENT_OFFICER', label: 'Placement Officer', emoji: '💼', desc: 'Managing campus placements' },
];

const UserIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

/**
 * Registration page — Students and Placement Officers only.
 * Admins are seeded via DataInitializer.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    if (error) setError('');
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim())            errors.name = 'Full name is required';
    if (!form.email.trim())           errors.email = 'Email is required';
    if (!form.role)                   errors.role = 'Please select a role';
    if (form.password.length < 8)     errors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword)
                                      errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password, form.role);
    setLoading(false);

    if (result.success) {
      navigate(ROLE_DASHBOARDS[result.user.role] || '/', { replace: true });
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <span className="auth-logo-text">PlaceHub</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the placement management portal</p>

        {error && (
          <div className="alert alert-error" role="alert">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Role Selector Cards */}
        <div className="form-group">
          <label className="form-label">I am a…</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                id={`role-btn-${r.value.toLowerCase()}`}
                onClick={() => { setForm((p) => ({ ...p, role: r.value })); setFieldErrors((p) => ({ ...p, role: '' })); }}
                style={{
                  background: form.role === r.value
                    ? 'rgba(99,102,241,0.15)'
                    : 'rgba(255,255,255,0.03)',
                  border: form.role === r.value
                    ? '1px solid rgba(99,102,241,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  color: 'var(--color-text-primary)',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{r.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>{r.desc}</div>
              </button>
            ))}
          </div>
          {fieldErrors.role && <p className="form-error">{fieldErrors.role}</p>}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full name</label>
            <div className="input-wrapper">
              <span className="input-icon"><UserIcon /></span>
              <input
                id="reg-name"
                name="name"
                type="text"
                className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {fieldErrors.name && <p className="form-error">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <div className="input-wrapper">
              <span className="input-icon"><MailIcon /></span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                placeholder="jane@college.edu"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && <p className="form-error">{fieldErrors.email}</p>}
          </div>

          {/* Passwords */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  placeholder="≥ 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {fieldErrors.password && <p className="form-error">{fieldErrors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                />
                <button type="button" className="input-toggle" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="form-error">{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? <><div className="btn-spinner" /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <p className="auth-link-footer">
          Already have an account?{' '}
          <Link to="/login" className="btn-link" style={{ fontSize: 'inherit' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
