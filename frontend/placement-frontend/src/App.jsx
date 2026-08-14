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
