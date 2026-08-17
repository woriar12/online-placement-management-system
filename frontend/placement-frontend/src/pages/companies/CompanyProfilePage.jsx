import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import companyService from '../../services/companyService';
import driveService from '../../services/driveService';
import DriveCard from '../../components/DriveCard';
import ConfirmDialog from '../../components/ConfirmDialog';

/**
 * Company profile page — read-only company details plus embedded drive list.
 */
export default function CompanyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteCompanyConfirm, setDeleteCompanyConfirm] = useState(false);
  const [driveAction, setDriveAction] = useState({ type: null, drive: null });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      companyService.getById(id),
      driveService.getByCompany(id, { size: 50 }),
    ])
      .then(([compRes, driveRes]) => {
        setCompany(compRes.data.data);
        setDrives(driveRes.data.data.content || []);
      })
      .catch(() => setError('Failed to load company profile.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteCompany = async () => {
    try {
      await companyService.delete(id);
      navigate('/companies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company.');
      setDeleteCompanyConfirm(false);
    }
  };

  const handleDriveClose = async () => {
    if (!driveAction.drive) return;
    try {
      await driveService.close(driveAction.drive.id);
      setDrives((prev) => prev.map((d) => d.id === driveAction.drive.id ? { ...d, status: 'CLOSED' } : d));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close drive.');
    } finally {
      setDriveAction({ type: null, drive: null });
    }
  };

  const handleDriveDelete = async () => {
    if (!driveAction.drive) return;
    try {
      await driveService.delete(driveAction.drive.id);
      setDrives((prev) => prev.filter((d) => d.id !== driveAction.drive.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete drive.');
    } finally {
      setDriveAction({ type: null, drive: null });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading profile…</div>;
  if (error && !company) return <div style={{ textAlign: 'center', padding: '4rem', color: '#f87171' }}>⚠️ {error}</div>;
  if (!company) return null;

  const initials = company.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
        <Link to="/companies" style={{ color: '#38bdf8', textDecoration: 'none' }}>Companies</Link>
        {' / '}
        <span>{company.name}</span>
      </div>

      {error && (
        <div style={{ backgroundColor: '#1f0a0a', border: '1px solid #dc2626', borderRadius: '0.5rem', padding: '0.875rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Profile card */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.875rem', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Logo */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '0.75rem',
            backgroundColor: '#0f172a', border: '2px solid #334155',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden',
          }}>
            {company.logoUrl
              ? <img src={company.logoUrl} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.5rem' }}>{initials}</span>
            }
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9' }}>{company.name}</h1>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700,
                backgroundColor: company.active ? '#14532d' : '#374151',
                color: company.active ? '#bbf7d0' : '#d1d5db',
              }}>
                {company.active ? '● Active' : '● Inactive'}
              </span>
            </div>
            {company.industry && <div style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.9rem' }}>🏭 {company.industry}</div>}
            {(company.city || company.country) && (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                📍 {[company.address, company.city, company.state, company.country].filter(Boolean).join(', ')}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              to={`/companies/${id}/edit`}
              id="edit-company-btn"
              style={{ ...actionChip, color: '#a78bfa', border: '1px solid #2e1065' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1040'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ✏️ Edit
            </Link>
            <button
              id="delete-company-btn"
              onClick={() => setDeleteCompanyConfirm(true)}
              style={{ ...actionChip, color: '#f87171', border: '1px solid #450a0a' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f0a0a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* Contact & details */}
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {company.website && (
            <InfoRow icon="🌐" label="Website">
              <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>{company.website}</a>
            </InfoRow>
          )}
          {company.email && <InfoRow icon="📧" label="Email">{company.email}</InfoRow>}
          {company.phone && <InfoRow icon="📞" label="Phone">{company.phone}</InfoRow>}
        </div>

        {company.description && (
          <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', border: '1px solid #334155' }}>
            <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem' }}>{company.description}</p>
          </div>
        )}
      </div>

      {/* Drives section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>
          📋 Placement Drives <span style={{ color: '#64748b', fontWeight: 400, fontSize: '1rem' }}>({drives.length})</span>
        </h2>
        <Link
          to={`/drives/new?companyId=${id}`}
          id="add-drive-btn"
          style={{ ...actionChip, color: '#fff', backgroundColor: '#3b82f6', border: '1px solid #3b82f6', fontWeight: 700 }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          + Add Drive
        </Link>
      </div>

      {drives.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', border: '1px dashed #334155' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>No drives posted for this company yet.</p>
          <Link to={`/drives/new?companyId=${id}`} style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
            + Create first drive
          </Link>
        </div>
      ) : (
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

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={deleteCompanyConfirm}
        title="Delete Company"
        message={`Permanently delete "${company.name}" and all associated data?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteCompany}
        onCancel={() => setDeleteCompanyConfirm(false)}
      />
      <ConfirmDialog
        isOpen={driveAction.type === 'close'}
        title="Close Drive"
        message={`Close "${driveAction.drive?.title}"? Students will no longer be able to apply.`}
        confirmLabel="Close Drive"
        variant="warning"
        onConfirm={handleDriveClose}
        onCancel={() => setDriveAction({ type: null, drive: null })}
      />
      <ConfirmDialog
        isOpen={driveAction.type === 'delete'}
        title="Delete Drive"
        message={`Permanently delete "${driveAction.drive?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDriveDelete}
        onCancel={() => setDriveAction({ type: null, drive: null })}
      />
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div>
      <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{icon} {label}</div>
      <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{children}</div>
    </div>
  );
}

const actionChip = {
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.4rem 0.9rem', borderRadius: '9999px',
  backgroundColor: 'transparent', fontWeight: 600, fontSize: '0.82rem',
  cursor: 'pointer', textDecoration: 'none', transition: 'background-color 0.15s',
};
