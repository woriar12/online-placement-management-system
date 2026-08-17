import React, { useEffect, useRef } from 'react';

/**
 * Accessible confirmation modal for destructive actions (delete, close).
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen      - Whether the dialog is visible
 * @param {string}   props.title       - Dialog heading
 * @param {string}   props.message     - Descriptive text shown to the user
 * @param {string}   [props.confirmLabel] - Label for the confirm button (default "Confirm")
 * @param {string}   [props.variant]   - "danger" | "warning" (default "danger")
 * @param {Function} props.onConfirm   - Called when the user confirms
 * @param {Function} props.onCancel    - Called when the user cancels or closes
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  // Focus the confirm button when dialog opens
  useEffect(() => {
    if (isOpen && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmBg = variant === 'warning' ? '#d97706' : '#dc2626';
  const confirmHover = variant === 'warning' ? '#b45309' : '#b91c1c';
  const iconColor = variant === 'warning' ? '#fbbf24' : '#f87171';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '0.75rem',
          padding: '2rem',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: iconColor }}>⚠️</div>

        {/* Title */}
        <h2
          id="confirm-dialog-title"
          style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}
        >
          {title}
        </h2>

        {/* Message */}
        <p style={{ margin: '0 0 1.75rem 0', color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #475569',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#334155'; e.target.style.color = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#94a3b8'; }}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: confirmBg,
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = confirmHover; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = confirmBg; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
