import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import RecentApplications from '../../components/admin/RecentApplications';
import RecentDrives from '../../components/admin/RecentDrives';
import PlacementChart from '../../components/admin/PlacementChart';
import adminService from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to fetch dashboard data.');
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      setError('Unable to load dashboard metrics. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
        <p style={{ fontWeight: '500' }}>Loading Admin Dashboard Metrics...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.75rem', color: '#9f1239' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Dashboard Load Error</h3>
        <p style={{ margin: '0 0 1rem 0' }}>{error}</p>
        <button onClick={fetchDashboardStats} className="btn btn-danger btn-sm">
          Retry Connection
        </button>
      </div>
    );
  }

  // Sample data for charts if backend counts exist
  const statusDistData = [
    { label: 'Selected', value: stats?.totalSelectedStudents || 0 },
    { label: 'Shortlisted', value: Math.max(0, (stats?.totalApplications || 0) - (stats?.totalSelectedStudents || 0) - (stats?.totalRejectedStudents || 0) - (stats?.totalPendingApplications || 0)) },
    { label: 'Pending', value: stats?.totalPendingApplications || 0 },
    { label: 'Rejected', value: stats?.totalRejectedStudents || 0 },
  ];

  const trendData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 19 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 32 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: stats?.totalSelectedStudents || 52 },
  ];

  const departmentData = [
    { department: 'Computer Science', selectedStudents: Math.round((stats?.totalSelectedStudents || 10) * 0.45), placementPercentage: 88.5 },
    { department: 'Information Technology', selectedStudents: Math.round((stats?.totalSelectedStudents || 10) * 0.30), placementPercentage: 82.0 },
    { department: 'Electronics', selectedStudents: Math.round((stats?.totalSelectedStudents || 10) * 0.15), placementPercentage: 74.5 },
    { department: 'Mechanical', selectedStudents: Math.round((stats?.totalSelectedStudents || 10) * 0.10), placementPercentage: 65.0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Placement Management Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Real-time analytics, student placement metrics, and drive performance.
          </p>
        </div>
        <button onClick={fetchDashboardStats} className="btn btn-outline btn-sm">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* 8 Primary Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtitle="Registered accounts"
          color="#3b82f6"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
        />
        <StatCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          subtitle="Recruiting partners"
          color="#06b6d4"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
          }
        />
        <StatCard
          title="Placement Drives"
          value={stats?.totalPlacementDrives || 0}
          subtitle="Active & completed"
          color="#8b5cf6"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          subtitle="Student submissions"
          color="#f59e0b"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Selected Students"
          value={stats?.totalSelectedStudents || 0}
          subtitle="Job offers confirmed"
          change="+14%"
          color="#10b981"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Rejected Students"
          value={stats?.totalRejectedStudents || 0}
          subtitle="Not selected"
          color="#f43f5e"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Pending Applications"
          value={stats?.totalPendingApplications || 0}
          subtitle="Awaiting evaluation"
          color="#64748b"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Placement Rate"
          value={`${stats?.placementPercentage || 0}%`}
          subtitle="Eligible students placed"
          change="+8.2%"
          color="#2563eb"
          icon={
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Visual Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <PlacementChart type="department" title="Department-wise Placements" data={departmentData} />
        <PlacementChart type="status-distribution" title="Application Status Breakdown" data={statusDistData} />
        <PlacementChart type="trend" title="Placement Selections Trend" data={trendData} />
      </div>

      {/* Activity Lists Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        <RecentApplications applications={stats?.recentApplications || []} />
        <RecentDrives drives={stats?.recentDrives || []} />
      </div>
    </div>
  );
}
