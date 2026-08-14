import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [page, branchFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudents({
        query: query.trim() || undefined,
        branch: branchFilter || undefined,
        page,
        size: 8,
      });
      if (res.success && res.data) {
        setStudents(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchStudents();
  };

  const handleToggleStatus = async (student) => {
    const currentStatus = student.accountStatus;
    const newStatus = currentStatus === 'APPROVED' ? 'DEACTIVATED' : 'APPROVED';
    const confirmText = `Are you sure you want to change account status for ${student.name} to ${newStatus}?`;

    if (window.confirm(confirmText)) {
      try {
        const res = await adminService.updateStudentStatus(student.id, { status: newStatus });
        if (res.success) {
          fetchStudents();
          if (selectedStudent?.id === student.id) {
            setSelectedStudent(res.data);
          }
        }
      } catch (err) {
        alert('Failed to update student status.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Student Directory</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monitor student profiles, academic records, and account statuses.
          </p>
        </div>
        <div className="badge badge-info" style={{ fontSize: '0.85rem', padding: '0.5rem 0.875rem' }}>
          Total Students: {totalElements}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by student name, roll number, or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <select
              value={branchFilter}
              onChange={(e) => { setBranchFilter(e.target.value); setPage(0); }}
              style={{ width: '100%', padding: '0.5rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading students...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No student records found matching filter criteria.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name & Email</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Year</th>
                <th>Status</th>
                <th>Account</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>{student.rollNumber}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.email}</div>
                  </td>
                  <td>{student.branch}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: student.cgpa >= 8.0 ? '#059669' : '#d97706' }}>
                      {student.cgpa}
                    </span>
                  </td>
                  <td>{student.graduationYear || 'N/A'}</td>
                  <td>
                    {student.placementStatus === 'PLACED' ? (
                      <span className="badge badge-success">Placed</span>
                    ) : student.placementStatus === 'APPLIED' ? (
                      <span className="badge badge-info">Applied</span>
                    ) : (
                      <span className="badge badge-neutral">Unplaced</span>
                    )}
                  </td>
                  <td>
                    {student.accountStatus === 'APPROVED' ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Deactivated</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setSelectedStudent(student)} className="btn btn-outline btn-sm">View</button>
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className={`btn btn-sm ${student.accountStatus === 'APPROVED' ? 'btn-danger' : 'btn-success'}`}
                      >
                        {student.accountStatus === 'APPROVED' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn btn-outline btn-sm">Previous</button>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="btn btn-outline btn-sm">Next</button>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Student Profile Details</h2>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Full Name:</strong> {selectedStudent.name}</div>
              <div><strong>Roll Number:</strong> {selectedStudent.rollNumber}</div>
              <div><strong>Email Address:</strong> {selectedStudent.email}</div>
              <div><strong>Branch / Dept:</strong> {selectedStudent.branch}</div>
              <div><strong>CGPA Score:</strong> {selectedStudent.cgpa}</div>
              <div><strong>Graduation Year:</strong> {selectedStudent.graduationYear}</div>
              <div><strong>Phone Number:</strong> {selectedStudent.phoneNumber || 'N/A'}</div>
              <div><strong>Account Status:</strong> {selectedStudent.accountStatus}</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-outline btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
