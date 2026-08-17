import React from 'react';

/**
 * Reusable pagination control component.
 *
 * @param {Object}   props
 * @param {number}   props.currentPage   - Zero-based current page index
 * @param {number}   props.totalPages    - Total number of pages
 * @param {Function} props.onPageChange  - Called with new zero-based page index
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  // Show at most 7 page buttons with ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    if (currentPage <= 3) return [...pages.slice(0, 5), '...', totalPages - 1];
    if (currentPage >= totalPages - 4) return [0, '...', ...pages.slice(totalPages - 5)];
    return [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
  };

  const visible = getVisiblePages();

  const btnBase = {
    minWidth: '2.25rem',
    height: '2.25rem',
    padding: '0 0.5rem',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const activeStyle = {
    ...btnBase,
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: '1px solid #3b82f6',
  };

  const inactiveStyle = {
    ...btnBase,
    backgroundColor: '#1e293b',
    color: '#94a3b8',
  };

  const navStyle = (disabled) => ({
    ...btnBase,
    backgroundColor: disabled ? '#0f172a' : '#1e293b',
    color: disabled ? '#334155' : '#94a3b8',
    cursor: disabled ? 'default' : 'pointer',
  });

  return (
    <div
      role="navigation"
      aria-label="Pagination"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
    >
      {/* Previous */}
      <button
        style={navStyle(currentPage === 0)}
        onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Page buttons */}
      {visible.map((p, idx) =>
        p === '...'
          ? <span key={`ellipsis-${idx}`} style={{ color: '#64748b', padding: '0 0.25rem', fontSize: '0.85rem' }}>…</span>
          : (
            <button
              key={p}
              style={p === currentPage ? activeStyle : inactiveStyle}
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              aria-label={`Page ${p + 1}`}
              onMouseEnter={(e) => { if (p !== currentPage) { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#f1f5f9'; } }}
              onMouseLeave={(e) => { if (p !== currentPage) { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              {p + 1}
            </button>
          )
      )}

      {/* Next */}
      <button
        style={navStyle(currentPage === totalPages - 1)}
        onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}
