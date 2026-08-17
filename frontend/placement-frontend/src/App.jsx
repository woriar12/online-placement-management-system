import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Error pages
import NotFoundPage from './pages/NotFoundPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentProfilePage from './pages/StudentProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Protected dashboards
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import PlacementOfficerDashboard from './pages/dashboards/PlacementOfficerDashboard';

/**
 * Root application component.
 *
 * Route summary:
 *  /                            → redirect to /login
 *  /login                       → LoginPage (public)
 *  /register                    → RegisterPage (public)
 *  /forgot-password             → ForgotPasswordPage (public)
 *  /reset-password?token=...    → ResetPasswordPage (public)
 *  /dashboard/student           → StudentDashboard (STUDENT only)
 *  /dashboard/admin             → AdminDashboard (ADMIN only)
 *  /dashboard/placement-officer → PlacementOfficerDashboard (PLACEMENT_OFFICER only)
 *  /unauthorized                → UnauthorizedPage
 *  *                            → NotFoundPage
 */
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
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Public ─────────────────────────────────────────── */}
        <Route path="/login"            element={<LoginPage />} />
        <Route path="/register"         element={<RegisterPage />} />
        <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="/reset-password"   element={<ResetPasswordPage />} />

        {/* ── Protected — Student ────────────────────────────── */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Protected — Admin ─────────────────────────────── */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Protected — Placement Officer ──────────────────── */}
        <Route
          path="/dashboard/placement-officer"
          element={
            <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
              <PlacementOfficerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Error Pages ────────────────────────────────────── */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*"             element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
