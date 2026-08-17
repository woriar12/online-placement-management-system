import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentProfilePage from './pages/StudentProfilePage';

/**
 * Basic CSS styles for initial application scaffold setup.
 */
const appStyles = {
  container: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    margin: 0,
  },
  header: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  navLink: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.875rem',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  }
};

function HomePlaceholder() {
  return (
    <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Online Placement Management System</h2>
        <span style={appStyles.badge}>System Scaffold Ready</span>
      </div>
      <p style={{ color: '#475569', lineHeight: 1.6 }}>
        Base frontend application architecture established for team development.
        Feature branches will build specific dashboards and modules.
      </p>
      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.375rem', fontSize: '0.9rem' }}>
        <strong>Team Note:</strong> Clone repository, create branch matching <code>feature/*</code> pattern, and contribute to your assigned module.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div style={appStyles.container}>
        <header style={appStyles.header}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            Placement Management System
          </h1>
          <nav style={appStyles.nav}>
            <Link to="/" style={appStyles.navLink}>Home</Link>
            <Link to="/login" style={appStyles.navLink}>Login</Link>
            <Link to="/student/dashboard" style={appStyles.navLink}>Student Dashboard</Link>
            <Link to="/student/profile" style={appStyles.navLink}>My Profile</Link>
          </nav>
        </header>

        <main style={appStyles.main}>
          <Routes>
            <Route path="/" element={<HomePlaceholder />} />
            <Route path="/login" element={<LoginPage />} />
            {/* ── Student Module Routes ── */}
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer style={appStyles.footer}>
          &copy; {new Date().getFullYear()} Online Placement Management System Team. All rights reserved.
        </footer>
      </div>
    </AuthProvider>
  );
}
