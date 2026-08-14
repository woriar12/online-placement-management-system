import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@placement.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      if (res.data && res.data.success && res.data.data) {
        const { user, token } = res.data.data;
        login(user, token);
        navigate('/admin');
      } else {
        setError(res.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Server authentication failed. Ensure backend server is running on port 8080.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '2.5rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem', margin: '0 auto 0.75rem' }}>
          P
        </div>
        <h2 style={{ margin: 0, color: '#0f172a', fontWeight: '800' }}>Admin Portal Login</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Sign in to access management console & reports</p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: '#334155' }}>Admin Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@placement.com"
            required
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: '#334155' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
        >
          {loading ? 'Authenticating...' : 'Sign In to Admin Console'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#475569', textAlign: 'center' }}>
        <strong>Demo Admin Credentials:</strong><br />
        Email: <code>admin@placement.com</code> | Password: <code>admin123</code>
      </div>
    </div>
  );
}
