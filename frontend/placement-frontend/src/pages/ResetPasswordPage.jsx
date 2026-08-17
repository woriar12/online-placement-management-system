import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';

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
 * Reset Password page — reads ?token= from URL, allows user to set a new password.
 */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
          <h1 className="auth-title" style={{ fontSize: 'var(--text-xl)' }}>Invalid link</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)' }}>
            This reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="btn btn-primary">Request a new link</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFieldErrors((p) => ({ ...p, [e.target.name]: '' }));
    if (error) setError('');
  };

  const validate = () => {
    const errors = {};
    if (form.newPassword.length < 8)
      errors.newPassword = 'Password must be at least 8 characters';
    if (form.newPassword !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, form.newPassword, form.confirmPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)',
            fontSize: '2rem',
          }}>✅</div>
          <h1 className="auth-title" style={{ fontSize: 'var(--text-xl)' }}>Password reset!</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
            Your password has been updated. Redirecting to login…
          </p>
          <Link to="/login" className="btn btn-primary">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <span className="auth-logo-text">PlaceHub</span>
        </div>

        <h1 className="auth-title">Set new password</h1>
        <p className="auth-subtitle">Choose a strong password for your account.</p>

        {error && (
          <div className="alert alert-error" role="alert">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="new-password">New password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="new-password"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                className={`form-input ${fieldErrors.newPassword ? 'error' : ''}`}
                placeholder="≥ 8 characters"
                value={form.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
              />
              <button type="button" className="input-toggle" onClick={() => setShowNew(v => !v)} aria-label="Toggle">
                <EyeIcon open={showNew} />
              </button>
            </div>
            {fieldErrors.newPassword && <p className="form-error">{fieldErrors.newPassword}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">Confirm password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
              />
              <button type="button" className="input-toggle" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {fieldErrors.confirmPassword && <p className="form-error">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            id="reset-submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <><div className="btn-spinner" />Updating…</> : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
