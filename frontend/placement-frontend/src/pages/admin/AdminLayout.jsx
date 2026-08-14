import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f1f5f9' }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="admin-main-content"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '260px' : '0',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main style={{ flex: 1, padding: '1.75rem 2rem' }}>
          <Outlet />
        </main>

        <footer
          className="no-print"
          style={{
            padding: '1rem 2rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#64748b',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          Online Placement Management System &copy; {new Date().getFullYear()} — Placement Office Admin Console
        </footer>
      </div>
    </div>
  );
}
