import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import companyService from '../../services/companyService';
import CompanyCard from '../../components/CompanyCard';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';

/**
 * Company list page with search, pagination, and CRUD actions.
 */
export default function CompanyListPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await companyService.getAll({ search: debouncedSearch || undefined, page: currentPage, size: 10 });
      const { content, totalPages: tp, totalElements: te } = res.data.data;
      setCompanies(content);
      setTotalPages(tp);
      setTotalElements(te);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load companies.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => { loadCompanies(); }, [loadCompanies]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await companyService.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company.');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>🏢 Companies</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            {totalElements > 0 ? `${totalElements} company${totalElements !== 1 ? 'ies' : 'y'} found` : 'Manage recruiting companies'}
          </p>
        </div>
        <Link
          to="/companies/new"
          id="add-company-btn"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: '#3b82f6', color: '#fff',
            padding: '0.65rem 1.25rem', borderRadius: '0.6rem',
            fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          + Add Company
        </Link>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '1rem' }}>🔍</span>
        <input
          id="company-search"
          type="text"
          placeholder="Search companies by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            backgroundColor: '#1e293b', border: '1px solid #334155',
            borderRadius: '0.6rem', color: '#f1f5f9', fontSize: '0.95rem',
            outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
          onBlur={(e) => e.target.style.borderColor = '#334155'}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#1f0a0a', border: '1px solid #dc2626', borderRadius: '0.5rem', padding: '0.875rem 1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>⏳</div>
          Loading companies…
        </div>
      )}

      {/* Empty state */}
      {!loading && companies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#1e293b', borderRadius: '0.75rem', border: '1px dashed #334155' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            {debouncedSearch ? `No companies match "${debouncedSearch}"` : 'No companies added yet.'}
          </p>
          {!debouncedSearch && (
            <Link to="/companies/new" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
              + Add the first company
            </Link>
          )}
        </div>
      )}

      {/* Company list */}
      {!loading && companies.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={(c) => navigate(`/companies/${c.id}/edit`)}
              onDelete={(c) => setDeleteTarget(c)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Company"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={deleteLoading ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
