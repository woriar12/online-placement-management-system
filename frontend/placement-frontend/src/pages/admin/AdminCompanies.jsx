import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, [page, statusFilter]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCompanies({
        query: query.trim() || undefined,
        status: statusFilter || undefined,
        page,
        size: 8,
      });
      if (res.success && res.data) {
        setCompanies(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (companyId, newStatus) => {
    if (window.confirm(`Are you sure you want to change approval status for this company to ${newStatus}?`)) {
      try {
        const res = await adminService.updateCompanyApprovalStatus(companyId, { status: newStatus });
        if (res.success) {
          fetchCompanies();
          if (selectedCompany?.id === companyId) setSelectedCompany(res.data);
        }
      } catch (err) {
        alert('Failed to update company approval status.');
      }
    }
  };

  const handleAccountStatusChange = async (company) => {
    const newStatus = company.accountStatus === 'APPROVED' ? 'DEACTIVATED' : 'APPROVED';
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this company account?`)) {
      try {
        const res = await adminService.updateCompanyAccountStatus(company.id, { status: newStatus });
        if (res.success) {
          fetchCompanies();
          if (selectedCompany?.id === company.id) setSelectedCompany(res.data);
        }
      } catch (err) {
        alert('Failed to update company account status.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Company Directory</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Review, approve, and manage registered corporate recruiting partners.
          </p>
        </div>
        <div className="badge badge-info" style={{ fontSize: '0.85rem', padding: '0.5rem 0.875rem' }}>
          Total Companies: {totalElements}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); fetchCompanies(); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by company name, industry, or email..."
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
              <option value="">All Approval Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending Approval</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading companies...</div>
        ) : companies.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No company records found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Contact Email</th>
                <th>Location</th>
                <th>Approval</th>
                <th>Account</th>
                <th>Drives</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((comp) => (
                <tr key={comp.id}>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{comp.companyName}</td>
                  <td>{comp.industry || 'Tech'}</td>
                  <td>{comp.contactEmail}</td>
                  <td>{comp.location || 'N/A'}</td>
                  <td>
                    {comp.approvalStatus === 'APPROVED' ? (
                      <span className="badge badge-success">Approved</span>
                    ) : comp.approvalStatus === 'PENDING' ? (
                      <span className="badge badge-warning">Pending</span>
                    ) : (
                      <span className="badge badge-danger">Rejected</span>
                    )}
                  </td>
                  <td>
                    {comp.accountStatus === 'APPROVED' ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Deactivated</span>
                    )}
                  </td>
                  <td style={{ fontWeight: '700' }}>{comp.totalDrives || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedCompany(comp)} className="btn btn-outline btn-sm">Details</button>
                      {comp.approvalStatus === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprovalChange(comp.id, 'APPROVED')} className="btn btn-success btn-sm">Approve</button>
                          <button onClick={() => handleApprovalChange(comp.id, 'REJECTED')} className="btn btn-danger btn-sm">Reject</button>
                        </>
                      )}
                      <button
                        onClick={() => handleAccountStatusChange(comp)}
                        className={`btn btn-sm ${comp.accountStatus === 'APPROVED' ? 'btn-danger' : 'btn-success'}`}
                      >
                        {comp.accountStatus === 'APPROVED' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Company Information</h2>
              <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Company Name:</strong> {selectedCompany.companyName}</div>
              <div><strong>Industry:</strong> {selectedCompany.industry}</div>
              <div><strong>Website:</strong> <a href={selectedCompany.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedCompany.website}</a></div>
              <div><strong>Contact Email:</strong> {selectedCompany.contactEmail}</div>
              <div><strong>Phone Number:</strong> {selectedCompany.contactPhone || 'N/A'}</div>
              <div><strong>Location:</strong> {selectedCompany.location}</div>
              <div><strong>Approval Status:</strong> {selectedCompany.approvalStatus}</div>
              <div><strong>Account Status:</strong> {selectedCompany.accountStatus}</div>
              <div><strong>Total Placement Drives:</strong> {selectedCompany.totalDrives}</div>
              <div><strong>Successful Placements:</strong> {selectedCompany.totalPlacements}</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedCompany(null)} className="btn btn-outline btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
