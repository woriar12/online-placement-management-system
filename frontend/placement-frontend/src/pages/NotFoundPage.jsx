import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#ef4444' }}>404</h1>
      <h2 style={{ color: '#1e293b', marginTop: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b' }}>The requested resource or page does not exist.</p>
      <Link to="/" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '0.25rem' }}>
        Back to Home
      </Link>
    </div>
  );
}
