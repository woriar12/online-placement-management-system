import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

/**
 * Card showing a placement drive summary.
 *
 * @param {Object}   props
 * @param {Object}   props.drive     - PlacementDriveResponse object
 * @param {Function} [props.onEdit]  - Called when Edit is clicked
 * @param {Function} [props.onClose] - Called when Close is clicked
 * @param {Function} [props.onDelete] - Called when Delete is clicked
 */
export default function DriveCard({ drive, onEdit, onClose, onDelete }) {
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const formatPkg = (lpa) => lpa != null ? `₹${lpa} LPA` : '—';

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = '#38bdf8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#334155';
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            to={`/drives/${drive.id}`}
            style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.target.style.color = '#f1f5f9'}
          >
            {drive.title}
          </Link>
          <Link
            to={`/companies/${drive.companyId}`}
            style={{ color: '#64748b', fontSize: '0.82rem', textDecoration: 'none' }}
            onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            {drive.companyName}
            {drive.companyIndustry && ` · ${drive.companyIndustry}`}
          </Link>
        </div>
        <StatusBadge status={drive.status} size="sm" />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
        <Stat icon="💰" label="Package" value={formatPkg(drive.packageLpa)} />
        <Stat icon="📍" label="Location" value={drive.jobLocation || '—'} />
        <Stat icon="📅" label="Drive Date" value={formatDate(drive.driveDate)} />
        <Stat icon="⏰" label="Deadline" value={formatDate(drive.applicationDeadline)} />
        {drive.minCgpa != null && (
          <Stat icon="🎓" label="Min CGPA" value={drive.minCgpa} />
        )}
        {drive.allowedBranches && (
          <Stat icon="🔬" label="Branches" value={drive.allowedBranches === '*' ? 'All' : drive.allowedBranches} />
        )}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Link
          to={`/drives/${drive.id}`}
          style={{ ...chipBtn, color: '#38bdf8', border: '1px solid #1e3a5f' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0c2340'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          View
        </Link>
        {onEdit && drive.status !== 'CLOSED' && (
          <button
            onClick={() => onEdit(drive)}
            style={{ ...chipBtn, color: '#a78bfa', border: '1px solid #2e1065' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1040'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Edit
          </button>
        )}
        {onClose && drive.status !== 'CLOSED' && (
          <button
            onClick={() => onClose(drive)}
            style={{ ...chipBtn, color: '#fbbf24', border: '1px solid #451a03' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1c0e00'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Close
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(drive)}
            style={{ ...chipBtn, color: '#f87171', border: '1px solid #450a0a' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f0a0a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div>
      <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
        {icon} {label}
      </div>
      <div style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  );
}

const chipBtn = {
  padding: '0.35rem 0.85rem',
  borderRadius: '9999px',
  backgroundColor: 'transparent',
  fontWeight: 600,
  fontSize: '0.78rem',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
};
