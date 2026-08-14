import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await adminService.getApplications({
        query: query.trim() || undefined,
        status: statusFilter || undefined,
        page,
        size: 8,
      });
      if (res.success && res.data) {
        setApplications(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="badge badge-success">Selected</span>;
      case 'SHORTLISTED':
      case 'INTERVIEWING':
        return <span className="badge badge-info">{status}</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-warning">Applied / Pending</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Application Monitor</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monitor student placement applications across all company drives.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); fetchApplications(); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search student name, roll number, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              style={{ width: '100%', padding: '0.5rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
            >
              <option value="">All Application Statuses</option>
              <option value="APPLIED">Applied (Pending)</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading applications...</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No application submissions found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Company & Role</th>
                <th>CTC</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.rollNumber}</div>
                  </td>
                  <td>{app.branch}</td>
                  <td style={{ fontWeight: '600' }}>{app.cgpa}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{app.companyName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.jobTitle}</div>
                  </td>
                  <td style={{ fontWeight: '700', color: '#059669' }}>₹{app.ctc} LPA</td>
                  <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <button onClick={() => setSelectedApp(app)} className="btn btn-outline btn-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Application Details</h2>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Applicant Name:</strong> {selectedApp.studentName}</div>
              <div><strong>Roll Number:</strong> {selectedApp.rollNumber}</div>
              <div><strong>Department:</strong> {selectedApp.branch}</div>
              <div><strong>CGPA:</strong> {selectedApp.cgpa}</div>
              <div><strong>Recruiting Company:</strong> {selectedApp.companyName}</div>
              <div><strong>Job Role:</strong> {selectedApp.jobTitle}</div>
              <div><strong>Compensation (CTC):</strong> ₹{selectedApp.ctc} LPA</div>
              <div><strong>Submission Status:</strong> {selectedApp.status}</div>
              <div><strong>Applied On:</strong> {selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleString() : 'N/A'}</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedApp(null)} className="btn btn-outline btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
