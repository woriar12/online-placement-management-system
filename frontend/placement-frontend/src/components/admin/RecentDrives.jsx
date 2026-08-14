import React from 'react';

export default function RecentDrives({ drives = [] }) {
  const getDriveBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge badge-success">Active</span>;
      case 'UPCOMING':
        return <span className="badge badge-info">Upcoming</span>;
      case 'COMPLETED':
        return <span className="badge badge-neutral">Completed</span>;
      default:
        return <span className="badge badge-warning">{status}</span>;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Recent Placement Drives</h3>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Active & Posted</span>
      </div>

      {drives.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          No drive listings available.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {drives.map((drive) => (
            <div
              key={drive.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{drive.jobTitle}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.125rem' }}>
                  {drive.companyName} • <span style={{ color: '#059669', fontWeight: '600' }}>₹{drive.ctc} LPA</span> • Min CGPA: {drive.eligibilityCgpa}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {getDriveBadge(drive.status)}
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {drive.totalApplications || 0} Applications
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
