import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import driveService from '../../services/driveService';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

/**
 * Read-only placement drive detail page.
 */
export default function DriveDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null); // 'close' | 'delete'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    driveService.getById(id)
      .then((res) => setDrive(res.data.data))
      .catch(() => setError('Failed to load drive details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClose = async () => {
    setActionLoading(true);
    try {
      const res = await driveService.close(id);
      setDrive(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close drive.');
    } finally {
      setAction(null);
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await driveService.delete(id);
      navigate('/drives');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete drive.');
      setAction(null);
      setActionLoading(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading drive…</div>;
  if (error && !drive) return <div style={{ textAlign: 'center', padding: '4rem', color: '#f87171' }}>⚠️ {error}</div>;
  if (!drive) return null;

  const branches = drive.allowedBranches === '*'
    ? ['All Branches']
    : (drive.allowedBranches || '').split(',').map((b) => b.trim()).filter(Boolean);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
        <Link to="/drives" style={{ color: '#38bdf8', textDecoration: 'none' }}>Drives</Link>
        {' / '}
        <span style={{ color: '#94a3b8' }}>{drive.title}</span>
      </div>

      {error && (
        <div style={{ backgroundColor: '#1f0a0a', border: '1px solid #dc2626', borderRadius: '0.5rem', padding: '0.875rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Hero card */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.875rem', padding: '2rem', marginBottom: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>
              {drive.title}
            </h1>
            <Link
              to={`/companies/${drive.companyId}`}
              style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
            >
              🏢 {drive.companyName}
              {drive.companyIndustry && <span style={{ color: '#64748b', fontWeight: 400 }}> · {drive.companyIndustry}</span>}
            </Link>
          </div>
          <StatusBadge status={drive.status} />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#0f172a', borderRadius: '0.625rem', border: '1px solid #334155' }}>
          <StatBox icon="💰" label="Package" value={drive.packageLpa != null ? `₹${drive.packageLpa} LPA` : '—'} highlight />
          <StatBox icon="📍" label="Location" value={drive.jobLocation || '—'} />
          <StatBox icon="📅" label="Drive Date" value={formatDate(drive.driveDate)} />
          <StatBox icon="⏰" label="Deadline" value={formatDate(drive.applicationDeadline)} />
          {drive.minCgpa != null && <StatBox icon="🎓" label="Min CGPA" value={drive.minCgpa} />}
        </div>

        {/* Branches */}
        {branches.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={sectionLabel}>🔬 Eligible Branches</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              {branches.map((b) => (
                <span key={b} style={{ backgroundColor: '#1e3a5f', color: '#7dd3fc', padding: '0.25rem 0.7rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {drive.status !== 'CLOSED' && (
            <Link
              to={`/drives/${id}/edit`}
              id="edit-drive-btn"
              style={{ ...chip, color: '#a78bfa', border: '1px solid #2e1065' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1040'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ✏️ Edit
            </Link>
          )}
          {drive.status !== 'CLOSED' && (
            <button
              id="close-drive-btn"
              onClick={() => setAction('close')}
              style={{ ...chip, color: '#fbbf24', border: '1px solid #451a03' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1c0e00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🔒 Close Drive
            </button>
          )}
          <button
            id="delete-drive-btn"
            onClick={() => setAction('delete')}
            style={{ ...chip, color: '#f87171', border: '1px solid #450a0a' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f0a0a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Job Description */}
      {drive.jobDescription && (
        <DetailSection title="📄 Job Description">
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
            {drive.jobDescription}
          </p>
        </DetailSection>
      )}

      {/* Eligibility */}
      {drive.eligibilityCriteria && (
        <DetailSection title="✅ Eligibility Criteria">
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
            {drive.eligibilityCriteria}
          </p>
        </DetailSection>
      )}

      {/* Meta */}
      <div style={{ marginTop: '1.5rem', color: '#475569', fontSize: '0.8rem', textAlign: 'right' }}>
        Created: {formatDate(drive.createdAt)} · Updated: {formatDate(drive.updatedAt)}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={action === 'close'}
        title="Close Drive"
        message={`Close "${drive.title}"? Students will no longer be able to apply.`}
        confirmLabel={actionLoading ? 'Closing…' : 'Close Drive'}
        variant="warning"
        onConfirm={handleClose}
        onCancel={() => setAction(null)}
      />
      <ConfirmDialog
        isOpen={action === 'delete'}
        title="Delete Drive"
        message={`Permanently delete "${drive.title}"? This cannot be undone.`}
        confirmLabel={actionLoading ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}

function StatBox({ icon, label, value, highlight }) {
  return (
    <div>
      <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{icon} {label}</div>
      <div style={{ color: highlight ? '#38bdf8' : '#cbd5e1', fontSize: highlight ? '1.1rem' : '0.9rem', fontWeight: highlight ? 800 : 600 }}>{value}</div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
      {children}
    </div>
  );
}

const sectionLabel = { color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 };
const chip = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.4rem 0.9rem', borderRadius: '9999px',
  backgroundColor: 'transparent', fontWeight: 600, fontSize: '0.82rem',
  cursor: 'pointer', textDecoration: 'none', transition: 'background-color 0.15s',
};
