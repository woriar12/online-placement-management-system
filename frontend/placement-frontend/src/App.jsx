import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import DriveExplorerPage from './pages/DriveExplorerPage';
import StudentApplicationsPage from './pages/StudentApplicationsPage';
import ShortlistingManagementPage from './pages/ShortlistingManagementPage';
import InterviewManagementPage from './pages/InterviewManagementPage';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <AuthProvider>
      <div className="app-container">
        {/* Navigation Bar */}
        <header className="navbar">
          <div className="nav-brand">
            <div className="brand-logo">P</div>
            <h1 className="brand-title">OPMS Placement Portal</h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links-desktop">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Placement Drives
            </NavLink>
            <NavLink to="/my-applications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              My Applications
            </NavLink>
            <div className="nav-divider" />
            <NavLink to="/admin/shortlisting" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Shortlisting Portal
            </NavLink>
            <NavLink to="/admin/interviews" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Interview Evaluator
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Login
            </NavLink>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu-drawer">
              <NavLink to="/" onClick={closeMenu} className="mobile-nav-item">
                🚀 Placement Drives
              </NavLink>
              <NavLink to="/my-applications" onClick={closeMenu} className="mobile-nav-item">
                📋 My Applications
              </NavLink>
              <NavLink to="/admin/shortlisting" onClick={closeMenu} className="mobile-nav-item">
                ⭐ Shortlisting Portal
              </NavLink>
              <NavLink to="/admin/interviews" onClick={closeMenu} className="mobile-nav-item">
                🎯 Interview Evaluator
              </NavLink>
              <NavLink to="/login" onClick={closeMenu} className="mobile-nav-item">
                🔑 Login
              </NavLink>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DriveExplorerPage />} />
            <Route path="/drives" element={<DriveExplorerPage />} />
            <Route path="/my-applications" element={<StudentApplicationsPage />} />
            <Route path="/admin/shortlisting" element={<ShortlistingManagementPage />} />
            <Route path="/admin/interviews" element={<InterviewManagementPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Responsive Footer */}
        <footer className="footer">
          &copy; {new Date().getFullYear()} Online Placement Management System (OPMS) — Application & Interview Management.
        </footer>
      </div>
    </AuthProvider>
  );
}
