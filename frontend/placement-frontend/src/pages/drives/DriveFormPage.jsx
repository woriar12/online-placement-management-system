import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import driveService from '../../services/driveService';
import companyService from '../../services/companyService';

const INITIAL_FORM = {
  companyId: '',
  title: '',
  jobDescription: '',
  eligibilityCriteria: '',
  minCgpa: '',
  allowedBranches: '',
  packageLpa: '',
  jobLocation: '',
  driveDate: '',
  applicationDeadline: '',
  status: 'UPCOMING',
};

const STATUS_OPTIONS = ['UPCOMING', 'ACTIVE', 'CLOSED'];
const BRANCH_OPTIONS = ['CSE', 'ECE', 'EEE', 'IT', 'MECH', 'CIVIL', 'CHEM', 'MBA', 'MCA'];

/**
 * Add/Edit placement drive form page.
 * Detects edit mode via `:id` param. Accepts optional `?companyId=` query param to pre-select company.
 */
export default function DriveFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ ...INITIAL_FORM, companyId: searchParams.get('companyId') || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [apiError, setApiError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [allBranches, setAllBranches] = useState(false);

  // Load companies for dropdown
  useEffect(() => {
    companyService.getAll({ size: 200, sort: 'name,asc' })
      .then((res) => setCompanies(res.data.data.content || []))
      .catch(() => {});
  }, []);

  // Load drive in edit mode
  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    driveService.getById(id)
      .then((res) => {
        const d = res.data.data;
        const branches = d.allowedBranches === '*' ? [] : (d.allowedBranches || '').split(',').map((b) => b.trim()).filter(Boolean);
        setAllBranches(d.allowedBranches === '*');
        setSelectedBranches(branches);
        setForm({
          companyId: String(d.companyId),
          title: d.title || '',
          jobDescription: d.jobDescription || '',
          eligibilityCriteria: d.eligibilityCriteria || '',
          minCgpa: d.minCgpa != null ? String(d.minCgpa) : '',
          allowedBranches: d.allowedBranches || '',
          packageLpa: d.packageLpa != null ? String(d.packageLpa) : '',
          jobLocation: d.jobLocation || '',
          driveDate: d.driveDate || '',
          applicationDeadline: d.applicationDeadline || '',
          status: d.status || 'UPCOMING',
        });
      })
      .catch(() => setApiError('Failed to load drive data.'))
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.companyId) errs.companyId = 'Please select a company.';
    if (!form.title.trim()) errs.title = 'Drive title is required.';
    if (form.minCgpa && (isNaN(form.minCgpa) || form.minCgpa < 0 || form.minCgpa > 10)) errs.minCgpa = 'CGPA must be between 0 and 10.';
    if (form.packageLpa && (isNaN(form.packageLpa) || form.packageLpa < 0)) errs.packageLpa = 'Package must be a positive number.';
    if (form.driveDate && form.applicationDeadline && form.applicationDeadline > form.driveDate)
      errs.applicationDeadline = 'Deadline should be before or on the drive date.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleBranch = (branch) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError(null);

    // Build allowedBranches string
    const branchValue = allBranches ? '*' : selectedBranches.join(',');

    const payload = {
      companyId: Number(form.companyId),
      title: form.title,
      jobDescription: form.jobDescription || null,
      eligibilityCriteria: form.eligibilityCriteria || null,
      minCgpa: form.minCgpa ? Number(form.minCgpa) : null,
      allowedBranches: branchValue || null,
      packageLpa: form.packageLpa ? Number(form.packageLpa) : null,
      jobLocation: form.jobLocation || null,
      driveDate: form.driveDate || null,
      applicationDeadline: form.applicationDeadline || null,
      status: form.status,
    };

    try {
      if (isEdit) {
        await driveService.update(id, payload);
      } else {
        await driveService.create(payload);
      }
      navigate('/drives');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading drive data…</div>;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
        <Link to="/drives" style={{ color: '#38bdf8', textDecoration: 'none' }}>Drives</Link>
        {' / '}
        <span>{isEdit ? 'Edit Drive' : 'New Drive'}</span>
      </div>

      <h1 style={{ margin: '0 0 2rem', fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>
        {isEdit ? '✏️ Edit Placement Drive' : '📋 Create Placement Drive'}
      </h1>

      {apiError && (
        <div style={{ backgroundColor: '#1f0a0a', border: '1px solid #dc2626', borderRadius: '0.5rem', padding: '0.875rem 1rem', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Basic Info */}
          <Section title="Drive Information">
            <Field label="Company *" error={errors.companyId}>
              <select id="drive-company" name="companyId" value={form.companyId} onChange={handleChange} style={inputStyle(errors.companyId)}>
                <option value="">— Select company —</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Drive Title *" error={errors.title}>
              <input id="drive-title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Engineer - Campus Recruitment 2025" style={inputStyle(errors.title)} />
            </Field>
            <Field label="Status">
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid',
                      borderColor: form.status === s ? '#38bdf8' : '#334155',
                      backgroundColor: form.status === s ? '#0c2340' : '#0f172a',
                      color: form.status === s ? '#38bdf8' : '#64748b',
                      fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          {/* Job Details */}
          <Section title="Job Details">
            <Field label="Job Description">
              <textarea id="drive-jd" name="jobDescription" value={form.jobDescription} onChange={handleChange}
                placeholder="Describe the role, responsibilities, and tech stack…" rows={5}
                style={{ ...inputStyle(), resize: 'vertical' }} />
            </Field>
            <Field label="Eligibility Criteria">
              <textarea id="drive-eligibility" name="eligibilityCriteria" value={form.eligibilityCriteria} onChange={handleChange}
                placeholder="e.g. B.E/B.Tech, 60% or above throughout, No active backlogs…" rows={3}
                style={{ ...inputStyle(), resize: 'vertical' }} />
            </Field>
          </Section>

          {/* Package & Location */}
          <Section title="Package & Location">
            <FormRow>
              <Field label="Package (LPA)" error={errors.packageLpa}>
                <input id="drive-package" name="packageLpa" type="number" step="0.01" min="0" value={form.packageLpa} onChange={handleChange} placeholder="e.g. 12.5" style={inputStyle(errors.packageLpa)} />
              </Field>
              <Field label="Job Location">
                <input id="drive-location" name="jobLocation" value={form.jobLocation} onChange={handleChange} placeholder="e.g. Bangalore, Remote" style={inputStyle()} />
              </Field>
            </FormRow>
          </Section>

          {/* Eligibility Numbers */}
          <Section title="Eligibility Requirements">
            <FormRow>
              <Field label="Minimum CGPA" error={errors.minCgpa}>
                <input id="drive-cgpa" name="minCgpa" type="number" step="0.01" min="0" max="10" value={form.minCgpa} onChange={handleChange} placeholder="e.g. 7.0" style={inputStyle(errors.minCgpa)} />
              </Field>
            </FormRow>

            {/* Branch selector */}
            <div>
              <label style={labelStyle}>Allowed Branches</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="all-branches"
                  checked={allBranches}
                  onChange={(e) => { setAllBranches(e.target.checked); if (e.target.checked) setSelectedBranches([]); }}
                  style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }}
                />
                <label htmlFor="all-branches" style={{ color: '#cbd5e1', fontSize: '0.88rem', cursor: 'pointer' }}>All branches eligible</label>
              </div>
              {!allBranches && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {BRANCH_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBranch(b)}
                      style={{
                        padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid',
                        borderColor: selectedBranches.includes(b) ? '#38bdf8' : '#334155',
                        backgroundColor: selectedBranches.includes(b) ? '#0c2340' : '#0f172a',
                        color: selectedBranches.includes(b) ? '#38bdf8' : '#64748b',
                        fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Schedule */}
          <Section title="Schedule">
            <FormRow>
              <Field label="Drive Date">
                <input id="drive-date" name="driveDate" type="date" value={form.driveDate} onChange={handleChange} style={inputStyle()} />
              </Field>
              <Field label="Application Deadline" error={errors.applicationDeadline}>
                <input id="drive-deadline" name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={handleChange} style={inputStyle(errors.applicationDeadline)} />
              </Field>
            </FormRow>
          </Section>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/drives')}
              style={cancelBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              Cancel
            </button>
            <button
              id="submit-drive-btn"
              type="submit"
              disabled={loading}
              style={{ ...submitBtn, opacity: loading ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; }}
            >
              {loading ? '⏳ Saving…' : isEdit ? '💾 Update Drive' : '✅ Create Drive'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h3>
      {children}
    </div>
  );
}
function FormRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>{children}</div>;
}
function Field({ label, children, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <span style={{ color: '#f87171', fontSize: '0.78rem' }}>{error}</span>}
    </div>
  );
}

const labelStyle = { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = (error) => ({
  backgroundColor: '#0f172a', border: `1px solid ${error ? '#dc2626' : '#334155'}`,
  borderRadius: '0.5rem', color: '#f1f5f9', padding: '0.6rem 0.875rem',
  fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s',
});
const cancelBtn = {
  padding: '0.65rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #475569',
  backgroundColor: 'transparent', color: '#94a3b8', fontWeight: 600, cursor: 'pointer',
  fontSize: '0.9rem', transition: 'all 0.15s',
};
const submitBtn = {
  padding: '0.65rem 1.5rem', borderRadius: '0.5rem', border: 'none',
  backgroundColor: '#3b82f6', color: '#fff', fontWeight: 700, cursor: 'pointer',
  fontSize: '0.9rem', transition: 'background-color 0.15s',
};
