import React from 'react';

const STATUS_CONFIG = {
  // Drive Lifecycle Statuses
  UPCOMING: { label: 'Upcoming', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)', dot: '#60a5fa' },
  ACTIVE:   { label: 'Active',   bg: 'rgba(34, 197, 94, 0.15)',  color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)',  dot: '#4ade80' },
  CLOSED:   { label: 'Closed',   bg: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af', border: 'rgba(156, 163, 175, 0.3)', dot: '#9ca3af' },

  // Application Statuses
  APPLIED:             { label: 'Applied',             bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)', dot: '#60a5fa' },
  UNDER_REVIEW:        { label: 'Under Review',        bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', dot: '#fbbf24' },
  SHORTLISTED:         { label: 'Shortlisted',         bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)', dot: '#a78bfa' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', bg: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: 'rgba(14, 165, 233, 0.3)', dot: '#38bdf8' },
  SELECTED:            { label: 'Selected / Offer',    bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', dot: '#34d399' },
  REJECTED:            { label: 'Rejected',            bg: 'rgba(239, 68, 68, 0.15)',  color: '#f87171', border: 'rgba(239, 68, 68, 0.3)',  dot: '#f87171' },
  WITHDRAWN:           { label: 'Withdrawn',           bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)', dot: '#94a3b8' },

  // Interview Statuses
  SCHEDULED: { label: 'Scheduled',    bg: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: 'rgba(14, 165, 233, 0.3)', dot: '#38bdf8' },
  PASSED:    { label: 'Passed Round', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', dot: '#34d399' },
  FAILED:    { label: 'Failed Round', bg: 'rgba(239, 68, 68, 0.15)',  color: '#f87171', border: 'rgba(239, 68, 68, 0.3)',  dot: '#f87171' },
  CANCELLED: { label: 'Cancelled',    bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)', dot: '#94a3b8' },
  ABSENT:    { label: 'Absent',       bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', dot: '#fbbf24' },
};

/**
 * Colored pill badge for drive, application, and interview statuses.
 */
export default function StatusBadge({ status, size = 'md', style = {} }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'rgba(100, 116, 139, 0.15)',
    color: '#94a3b8',
    border: 'rgba(100, 116, 139, 0.3)',
    dot: '#94a3b8',
  };

  const padding = size === 'sm' ? '0.2rem 0.55rem' : '0.3rem 0.75rem';
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        padding,
        borderRadius: '9999px',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.dot,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
