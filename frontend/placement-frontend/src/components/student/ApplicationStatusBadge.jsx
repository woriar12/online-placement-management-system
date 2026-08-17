import React from 'react';
import './ApplicationStatusBadge.css';

const STATUS_MAP = {
  PENDING:     { label: 'Pending',     color: '#f59e0b' },
  SHORTLISTED: { label: 'Shortlisted', color: '#6366f1' },
  SELECTED:    { label: 'Selected',    color: '#22c55e' },
  REJECTED:    { label: 'Rejected',    color: '#ef4444' },
};

const ApplicationStatusBadge = ({ status }) => {
  const cfg = STATUS_MAP[status] || { label: status, color: '#94a3b8' };
  return (
    <span className="status-badge" style={{ background: cfg.color }}>
      {cfg.label}
    </span>
  );
};

export default ApplicationStatusBadge;
