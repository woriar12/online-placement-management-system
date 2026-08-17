import React from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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

// Application & Interview pages
import DriveExplorerPage from './pages/DriveExplorerPage';
import StudentApplicationsPage from './pages/StudentApplicationsPage';
import ShortlistingManagementPage from './pages/ShortlistingManagementPage';
import InterviewManagementPage from './pages/InterviewManagementPage';

// Student pages
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import PlacementOfficerDashboard from './pages/dashboards/PlacementOfficerDashboard';

// Admin Module Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminDrives from './pages/admin/AdminDrives';
import AdminApplications from './pages/admin/AdminApplications';
import AdminReports from './pages/admin/AdminReports';

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
    padding: '0 1.5rem',
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
    flexWrap: 'wrap',
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
        fontSize: '0.85rem',
        padding: '0.4rem 0.65rem',
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
            <NavItem to="/"                  label="Home"              id="nav-home" />
            <NavItem to="/admin"             label="👑 Admin Portal"   id="nav-admin" />
            <NavItem to="/companies"         label="🏢 Companies"      id="nav-companies" />
            <NavItem to="/drives"            label="📋 Drives"         id="nav-drives" />
            <NavItem to="/drives-explorer"   label="🔍 Explore Drives" id="nav-explorer" />
            <NavItem to="/my-applications"   label="📝 Applications"   id="nav-my-apps" />
            <NavItem to="/shortlisting"      label="📊 Shortlisting"   id="nav-shortlisting" />
            <NavItem to="/interviews"        label="📅 Interviews"     id="nav-interviews" />
            <NavItem to="/student/dashboard" label="🎓 Student Portal" id="nav-student" />
            <NavItem to="/login"             label="Login"             id="nav-login" />
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

            {/* Admin Module Dedicated Console */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="drives" element={<AdminDrives />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>

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

            {/* Application & Interview Management */}
            <Route path="/drives-explorer" element={<DriveExplorerPage />} />
            <Route path="/my-applications" element={<StudentApplicationsPage />} />
            <Route path="/shortlisting"    element={<ShortlistingManagementPage />} />
            <Route path="/interviews"       element={<InterviewManagementPage />} />

            {/* Student Module Routes */}
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile"   element={<StudentProfilePage />} />

            {/* Protected Role Dashboards */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ROLE_STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/placement-officer"
              element={
                <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
                  <PlacementOfficerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Errors */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*"             element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          © {new Date().getFullYear()} Online Placement Management System · Synced All Modules
        </footer>
      </div>
    </AuthProvider>
  );
}

/** Landing page with quick navigation cards */
function HomePage() {
  const cards = [
    { to: '/admin',             emoji: '👑', title: 'Admin Console',     desc: 'Full administrative controls, analytics & reports.' },
    { to: '/companies',         emoji: '🏢', title: 'Companies',         desc: 'Add, edit, and manage recruiting company profiles.' },
    { to: '/drives',            emoji: '📋', title: 'Placement Drives',  desc: 'Create and manage campus placement drives.' },
    { to: '/drives-explorer',   emoji: '🔍', title: 'Explore Drives',    desc: 'Browse drives, view eligibility, and apply.' },
    { to: '/my-applications',   emoji: '📝', title: 'My Applications',   desc: 'Track your drive applications and status.' },
    { to: '/shortlisting',      emoji: '📊', title: 'Shortlisting',      desc: 'Review applications and update shortlisting status.' },
    { to: '/interviews',        emoji: '📅', title: 'Interviews',        desc: 'Schedule and manage interview rounds.' },
    { to: '/student/dashboard', emoji: '🎓', title: 'Student Portal',   desc: 'Access your student dashboard and profile.' },
    { to: '/login',             emoji: '🔑', title: 'Portal Login',      desc: 'Sign in to access your account.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2.5rem 0 3rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎓</div>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Online Placement Management System
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem', maxWidth: '540px', marginInline: 'auto', lineHeight: 1.6 }}>
          Complete campus recruitment solution — admin management, authentication, company profiles, placement drives, student profiles, applications & interview scheduling.
        </p>
      </div>

      {/* Quick-access cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '1000px', margin: '0 auto' }}>
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={{
              display: 'block',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.875rem',
              padding: '1.5rem',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.emoji}</div>
            <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>{card.title}</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
