import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import driveService from '../../services/driveService';
import DriveCard from '../../components/DriveCard';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUS_OPTIONS = ['', 'UPCOMING', 'ACTIVE', 'CLOSED'];
const STATUS_LABELS  = { '': 'All', UPCOMING: 'Upcoming', ACTIVE: 'Active', CLOSED: 'Closed' };

/**
 * Placement drive list page with status filter, pagination, and CRUD actions.
 */
export default function DriveListPage() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [driveAction, setDriveAction] = useState({ type: null, drive: null });
  const [actionLoading, setActionLoading] = useState(false);

  const loadDrives = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await driveService.getAll({
        status: statusFilter || undefined,
        page: currentPage,
        size: 10,
      });
      const { content, totalPages: tp, totalElements: te } = res.data.data;
      setDrives(content);
      setTotalPages(tp);
      setTotalElements(te);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drives.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => { loadDrives(); }, [loadDrives]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handleClose = async () => {
    if (!driveAction.drive) return;
    setActionLoading(true);
    try {
      await driveService.close(driveAction.drive.id);
      setDrives((prev) =>
        prev.map((d) => d.id === driveAction.drive.id ? { ...d, status: 'CLOSED' } : d)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close drive.');
    } finally {
      setDriveAction({ type: null, drive: null });
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!driveAction.drive) return;
    setActionLoading(true);
    try {
      await driveService.delete(driveAction.drive.id);
      loadDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete drive.');
    } finally {
      setDriveAction({ type: null, drive: null });
      setActionLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>📋 Placement Drives</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            {totalElements > 0 ? `${totalElements} drive${totalElements !== 1 ? 's' : ''} found` : 'Manage all placement drives'}
          </p>
        </div>
        <Link
          to="/drives/new"
          id="add-drive-btn"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: '#3b82f6', color: '#fff',
            padding: '0.65rem 1.25rem', borderRadius: '0.6rem',
            fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          + New Drive
        </Link>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s || 'all'}
            id={`filter-${s || 'all'}`}
            onClick={() => handleFilterChange(s)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: statusFilter === s ? '#38bdf8' : '#334155',
              backgroundColor: statusFilter === s ? '#0c2340' : '#1e293b',
              color: statusFilter === s ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#1f0a0a', border: '1px solid #dc2626', borderRadius: '0.5rem', padding: '0.875rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          Loading drives…
        </div>
      )}

      {/* Empty state */}
      {!loading && drives.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', border: '1px dashed #334155' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            {statusFilter ? `No ${STATUS_LABELS[statusFilter].toLowerCase()} drives found.` : 'No drives created yet.'}
          </p>
          {!statusFilter && (
            <Link to="/drives/new" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
              + Create the first drive
            </Link>
          )}
        </div>
      )}

      {/* Drive list */}
      {!loading && drives.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {drives.map((drive) => (
            <DriveCard
              key={drive.id}
              drive={drive}
              onEdit={(d) => navigate(`/drives/${d.id}/edit`)}
              onClose={(d) => setDriveAction({ type: 'close', drive: d })}
              onDelete={(d) => setDriveAction({ type: 'delete', drive: d })}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Confirm: Close */}
      <ConfirmDialog
        isOpen={driveAction.type === 'close'}
        title="Close Drive"
        message={`Close "${driveAction.drive?.title}"? Students will no longer be able to apply. The drive record will be retained.`}
        confirmLabel={actionLoading ? 'Closing…' : 'Close Drive'}
        variant="warning"
        onConfirm={handleClose}
        onCancel={() => setDriveAction({ type: null, drive: null })}
      />

      {/* Confirm: Delete */}
      <ConfirmDialog
        isOpen={driveAction.type === 'delete'}
        title="Delete Drive"
        message={`Permanently delete "${driveAction.drive?.title}"? This action cannot be undone.`}
        confirmLabel={actionLoading ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDriveAction({ type: null, drive: null })}
      />
    </div>
  );
}
