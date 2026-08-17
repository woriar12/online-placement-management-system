import React from 'react';

const STATUS_CONFIG = {
  UPCOMING: { label: 'Upcoming', bg: '#1e40af', color: '#bfdbfe', dot: '#60a5fa' },
  ACTIVE:   { label: 'Active',   bg: '#14532d', color: '#bbf7d0', dot: '#4ade80' },
  CLOSED:   { label: 'Closed',   bg: '#374151', color: '#d1d5db', dot: '#9ca3af' },
};

/**
 * A colored pill badge indicating a placement drive's lifecycle status.
 *
 * @param {Object}  props
 * @param {string}  props.status  - One of "UPCOMING" | "ACTIVE" | "CLOSED"
 * @param {string}  [props.size]  - "sm" | "md" (default "md")
 */
export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.UPCOMING;
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
        padding,
        borderRadius: '9999px',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
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
