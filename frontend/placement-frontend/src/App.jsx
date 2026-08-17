import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Error pages
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Company pages
import CompanyListPage from './pages/companies/CompanyListPage';
import CompanyFormPage from './pages/companies/CompanyFormPage';
import CompanyProfilePage from './pages/companies/CompanyProfilePage';

// Drive pages
import DriveListPage from './pages/drives/DriveListPage';
import DriveFormPage from './pages/drives/DriveFormPage';
import DriveDetailPage from './pages/drives/DriveDetailPage';

/** Global app styles */
const styles = {
  app: {
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    margin: 0,
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    textDecoration: 'none',
    color: '#f1f5f9',
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '-0.01em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  main: {
    flex: 1,
    padding: '2.5rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  footer: {
    backgroundColor: '#1e293b',
    borderTop: '1px solid #334155',
    color: '#475569',
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.8rem',
  },
};

/** Active-aware nav link */
function NavItem({ to, label, id }) {
  return (
    <NavLink
      to={to}
      id={id}
      style={({ isActive }) => ({
        color: isActive ? '#38bdf8' : '#94a3b8',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.88rem',
        padding: '0.4rem 0.75rem',
        borderRadius: '0.5rem',
        backgroundColor: isActive ? 'rgba(56,189,248,0.08)' : 'transparent',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      })}
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div style={styles.app}>
        {/* Header */}
        <header style={styles.header}>
          <Link to="/" style={styles.logo}>
            <span style={{ fontSize: '1.4rem' }}>🎓</span>
            <span>PlaceOS</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              backgroundColor: '#3b82f6', color: '#fff',
              padding: '0.15rem 0.4rem', borderRadius: '0.25rem', textTransform: 'uppercase',
            }}>
              Portal
            </span>
          </Link>

          <nav style={styles.nav} aria-label="Main navigation">
            <NavItem to="/"          label="Home"         id="nav-home" />
            <NavItem to="/companies" label="🏢 Companies" id="nav-companies" />
            <NavItem to="/drives"    label="📋 Drives"    id="nav-drives" />
            <NavItem to="/login"     label="Login"        id="nav-login" />
            <NavItem to="/register"  label="Register"     id="nav-register" />
          </nav>
        </header>

        {/* Main Content */}
        <main style={styles.main}>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<HomePage />} />

            {/* Public Authentication */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />

            {/* Company Management */}
            <Route path="/companies"         element={<CompanyListPage />} />
            <Route path="/companies/new"      element={<CompanyFormPage />} />
            <Route path="/companies/:id"      element={<CompanyProfilePage />} />
            <Route path="/companies/:id/edit" element={<CompanyFormPage />} />

            {/* Placement Drive Management */}
            <Route path="/drives"            element={<DriveListPage />} />
            <Route path="/drives/new"         element={<DriveFormPage />} />
            <Route path="/drives/:id"         element={<DriveDetailPage />} />
            <Route path="/drives/:id/edit"    element={<DriveFormPage />} />

            {/* Errors */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*"             element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          © {new Date().getFullYear()} Online Placement Management System · Synced Auth + Company & Placement Drive Module
        </footer>
      </div>
    </AuthProvider>
  );
}

/** Landing page with quick navigation cards */
function HomePage() {
  const cards = [
    { to: '/companies', emoji: '🏢', title: 'Companies', desc: 'Add, edit, and manage recruiting company profiles.' },
    { to: '/drives',    emoji: '📋', title: 'Placement Drives', desc: 'Create and manage campus placement drives.' },
    { to: '/login',     emoji: '🔑', title: 'Portal Login', desc: 'Sign in to access your dashboard.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 0 3.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎓</div>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Online Placement Management System
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.6 }}>
          Streamline campus recruitment — manage authentication, recruiting companies, drives, and student applications.
        </p>
      </div>

      {/* Quick-access cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', maxWidth: '860px', margin: '0 auto' }}>
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={{
              display: 'block',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.875rem',
              padding: '1.75rem',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
            }}
          >
            <div style={{ fontSize: '2.25rem', marginBottom: '0.875rem' }}>{card.emoji}</div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>{card.title}</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
