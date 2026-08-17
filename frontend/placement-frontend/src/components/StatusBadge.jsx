import React from 'react';

const statusStyles = {
  // Application Statuses
  APPLIED: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Applied' },
  UNDER_REVIEW: { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: 'Under Review' },
  SHORTLISTED: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: 'Shortlisted' },
  INTERVIEW_SCHEDULED: { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd', label: 'Interview Scheduled' },
  SELECTED: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', label: 'Selected / Offer' },
  REJECTED: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Rejected' },
  WITHDRAWN: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', label: 'Withdrawn' },

  // Interview Statuses
  SCHEDULED: { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd', label: 'Scheduled' },
  PASSED: { bg: '#dcfce7', color: '#16a34a', border: '#86efac', label: 'Passed Round' },
  FAILED: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5', label: 'Failed Round' },
  CANCELLED: { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db', label: 'Cancelled' },
  ABSENT: { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5', label: 'Absent' }
};

export default function StatusBadge({ status, style = {} }) {
  const config = statusStyles[status] || { bg: '#f3f4f6', color: '#374151', border: '#d1d5db', label: status || 'Unknown' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.025em',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        ...style
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color
        }}
      />
      {config.label}
    </span>
  );
}
