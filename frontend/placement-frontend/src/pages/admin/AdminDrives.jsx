import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, [page, statusFilter]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDrives({
        query: query.trim() || undefined,
        status: statusFilter || undefined,
        page,
        size: 8,
      });
      if (res.success && res.data) {
        setDrives(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Placement Drive Monitor</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Track active recruitment drives, application volumes, and selection metrics.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); fetchDrives(); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by job title or company name..."
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
              <option value="">All Drive Statuses</option>
              <option value="ACTIVE">Active Drives</option>
              <option value="UPCOMING">Upcoming Drives</option>
              <option value="COMPLETED">Completed Drives</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading placement drives...</div>
        ) : drives.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No placement drive records found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job Title & Company</th>
                <th>Package (CTC)</th>
                <th>Min CGPA</th>
                <th>Drive Date</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Selected</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{drive.jobTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{drive.companyName}</div>
                  </td>
                  <td style={{ fontWeight: '700', color: '#059669' }}>₹{drive.ctc} LPA</td>
                  <td>{drive.eligibilityCgpa}</td>
                  <td>{drive.driveDate || 'TBD'}</td>
                  <td>{getStatusBadge(drive.status)}</td>
                  <td style={{ fontWeight: '600' }}>{drive.totalApplications}</td>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>{drive.selectedCount}</td>
                  <td>
                    <button onClick={() => setSelectedDrive(drive)} className="btn btn-outline btn-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selectedDrive && (
        <div className="modal-overlay" onClick={() => setSelectedDrive(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Placement Drive Details</h2>
              <button onClick={() => setSelectedDrive(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Job Title:</strong> {selectedDrive.jobTitle}</div>
              <div><strong>Company:</strong> {selectedDrive.companyName}</div>
              <div><strong>Package (CTC):</strong> ₹{selectedDrive.ctc} LPA</div>
              <div><strong>Eligibility CGPA:</strong> {selectedDrive.eligibilityCgpa}</div>
              <div><strong>Job Location:</strong> {selectedDrive.location}</div>
              <div><strong>Drive Status:</strong> {selectedDrive.status}</div>
              <div><strong>Total Applications:</strong> {selectedDrive.totalApplications}</div>
              <div><strong>Students Selected:</strong> {selectedDrive.selectedCount}</div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Role Description:</strong>
                <p style={{ marginTop: '0.375rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.85rem' }}>
                  {selectedDrive.description || 'No detailed description specified.'}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedDrive(null)} className="btn btn-outline btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
