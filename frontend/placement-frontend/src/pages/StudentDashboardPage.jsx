import React, { useEffect, useState } from 'react';
import DriveCard from '../components/student/DriveCard';
import ApplicationStatusBadge from '../components/student/ApplicationStatusBadge';
import { getEligibleDrives, getApplicationStatus } from '../services/studentApi';
import './StudentDashboardPage.css';

const DEMO_STUDENT_ID = 1;

const StatCard = ({ label, value, color }) => (
  <div className="stat-card" style={{ '--accent': color }}>
    <span className="stat-card__value">{value}</span>
    <span className="stat-card__label">{label}</span>
  </div>
);

const StudentDashboardPage = () => {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEligibleDrives(DEMO_STUDENT_ID),
      getApplicationStatus(DEMO_STUDENT_ID),
    ])
      .then(([d, a]) => {
        setDrives(d);
        setApplications(a);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const eligibleCount = drives.filter((d) => d.eligible).length;
  const pendingCount  = applications.filter((a) => a.status === 'PENDING').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;

  if (loading) {
    return (
      <div className="sdp-loading">
        <div className="sdp-spinner" />
        <p>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="sdp">
      {/* Welcome Banner */}
      <div className="sdp__banner">
        <div>
          <h1 className="sdp__banner-title">Welcome back, Student 👋</h1>
          <p className="sdp__banner-sub">
            Track your placement journey — drives, applications and beyond.
          </p>
        </div>
        <div className="sdp__banner-graphic">🎓</div>
      </div>

      {/* Stats */}
      <div className="sdp__stats">
        <StatCard label="Total Drives"      value={drives.length}    color="#6366f1" />
        <StatCard label="Eligible Drives"   value={eligibleCount}    color="#22c55e" />
        <StatCard label="Applications"      value={applications.length} color="#f59e0b" />
        <StatCard label="Shortlisted"       value={shortlistedCount} color="#8b5cf6" />
        <StatCard label="Selected"          value={selectedCount}    color="#10b981" />
        <StatCard label="Pending"           value={pendingCount}     color="#64748b" />
      </div>

      {/* Eligible Placement Drives */}
      <section className="sdp__section">
        <h2 className="sdp__section-title">
          🏢 Eligible Placement Drives
          <span className="sdp__badge">{eligibleCount} available</span>
        </h2>
        {drives.length === 0 ? (
          <p className="sdp__empty">No drives available right now.</p>
        ) : (
          <div className="sdp__drives-grid">
            {drives.map((drive) => (
              <DriveCard key={drive.id} drive={drive} />
            ))}
          </div>
        )}
      </section>

      {/* Application Status */}
      <section className="sdp__section">
        <h2 className="sdp__section-title">
          📋 Application Status
          <span className="sdp__badge">{applications.length} applied</span>
        </h2>
        {applications.length === 0 ? (
          <p className="sdp__empty">You haven't applied to any drives yet.</p>
        ) : (
          <div className="sdp__applications">
            {applications.map((app) => (
              <div key={app.id} className="application-row">
                <div className="application-row__info">
                  <p className="application-row__title">{app.driveTitle}</p>
                  <p className="application-row__company">{app.company}</p>
                </div>
                <div className="application-row__meta">
                  <span className="application-row__date">Applied: {app.appliedOn}</span>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboardPage;
