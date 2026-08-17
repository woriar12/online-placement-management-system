import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Compact company card for use in lists and search results.
 *
 * @param {Object}   props
 * @param {Object}   props.company   - Company data object
 * @param {Function} [props.onEdit]  - Called when Edit is clicked
 * @param {Function} [props.onDelete] - Called when Delete is clicked
 */
export default function CompanyCard({ company, onEdit, onDelete }) {
  const initials = company.name
    ? company.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
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
      {/* Logo or initials */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '0.5rem',
          backgroundColor: company.logoUrl ? 'transparent' : '#0f172a',
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #334155',
        }}
      >
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1rem' }}>{initials}</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={`/companies/${company.id}`}
          style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
          onMouseLeave={(e) => e.target.style.color = '#f1f5f9'}
        >
          {company.name}
        </Link>
        {company.industry && (
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{company.industry}</span>
        )}
        {company.city && (
          <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: company.industry ? ' · ' : '' }}>
            {company.city}{company.country ? `, ${company.country}` : ''}
          </span>
        )}
      </div>

      {/* Status dot */}
      <div
        title={company.active ? 'Active' : 'Inactive'}
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: company.active ? '#4ade80' : '#ef4444',
          flexShrink: 0,
        }}
      />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <Link
          to={`/companies/${company.id}`}
          title="View Profile"
          style={{ ...actionBtn, color: '#38bdf8' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0c2340'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          👁
        </Link>
        {onEdit && (
          <button
            onClick={() => onEdit(company)}
            title="Edit"
            style={{ ...actionBtn, color: '#a78bfa' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1040'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(company)}
            title="Delete"
            style={{ ...actionBtn, color: '#f87171' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f0a0a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

const actionBtn = {
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '0.375rem',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'background-color 0.15s',
  textDecoration: 'none',
};
