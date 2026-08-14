import React from 'react';

export default function RecentApplications({ applications = [] }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="badge badge-success">Selected</span>;
      case 'SHORTLISTED':
      case 'INTERVIEWING':
        return <span className="badge badge-info">Shortlisted</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Recent Applications</h3>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Latest activity</span>
      </div>

      {applications.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          No application records found.
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Branch</th>
                <th>Company & Role</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.rollNumber}</div>
                  </td>
                  <td>{app.branch}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{app.companyName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.jobTitle} ({app.ctc} LPA)</div>
                  </td>
                  <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{getStatusBadge(app.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
