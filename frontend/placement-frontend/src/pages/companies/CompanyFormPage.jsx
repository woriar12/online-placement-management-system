import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import companyService from '../../services/companyService';

const INITIAL_FORM = {
  name: '', industry: '', website: '', email: '', phone: '',
  logoUrl: '', address: '', city: '', state: '', country: '',
  description: '', active: true,
};

const INDUSTRY_OPTIONS = [
  'Technology', 'Finance', 'Banking', 'Healthcare', 'Manufacturing',
  'Consulting', 'E-Commerce', 'Telecom', 'Automotive', 'Energy',
  'Education', 'Media', 'Retail', 'Real Estate', 'Other',
];

/**
 * Add/Edit company form page.
 * Detects edit mode via presence of `:id` route param.
 */
export default function CompanyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [apiError, setApiError] = useState(null);

  // Load existing company data in edit mode
  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    companyService.getById(id)
      .then((res) => {
        const d = res.data.data;
        setForm({
          name: d.name || '',
          industry: d.industry || '',
          website: d.website || '',
          email: d.email || '',
          phone: d.phone || '',
          logoUrl: d.logoUrl || '',
          address: d.address || '',
          city: d.city || '',
          state: d.state || '',
          country: d.country || '',
          description: d.description || '',
          active: d.active,
        });
      })
      .catch(() => setApiError('Failed to load company data.'))
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Company name is required.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address.';
    if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'Website must start with http:// or https://';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError(null);
    try {
      const payload = { ...form, active: form.active };
      if (isEdit) {
        await companyService.update(id, payload);
      } else {
        await companyService.create(payload);
      }
      navigate('/companies');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        Loading company data…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
        <Link to="/companies" style={{ color: '#38bdf8', textDecoration: 'none' }}>Companies</Link>
        {' / '}
        <span>{isEdit ? 'Edit Company' : 'New Company'}</span>
      </div>

      {/* Header */}
      <h1 style={{ margin: '0 0 2rem', fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>
        {isEdit ? '✏️ Edit Company' : '🏢 Add New Company'}
      </h1>

      {apiError && (
        <div style={{ backgroundColor: '#1f0a0a', border: '1px solid #dc2626', borderRadius: '0.5rem', padding: '0.875rem 1rem', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Section: Basic Info */}
          <Section title="Basic Information">
            <FormRow>
              <Field label="Company Name *" error={errors.name}>
                <input id="company-name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Google India" style={inputStyle(errors.name)} />
              </Field>
              <Field label="Industry" error={errors.industry}>
                <select id="company-industry" name="industry" value={form.industry} onChange={handleChange} style={inputStyle()}>
                  <option value="">— Select industry —</option>
                  {INDUSTRY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </Field>
            </FormRow>
            <FormRow>
              <Field label="Website" error={errors.website}>
                <input id="company-website" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" style={inputStyle(errors.website)} />
              </Field>
              <Field label="Logo URL">
                <input id="company-logo" name="logoUrl" value={form.logoUrl} onChange={handleChange} placeholder="https://…/logo.png" style={inputStyle()} />
              </Field>
            </FormRow>
            <Field label="Description">
              <textarea
                id="company-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief company description…"
                rows={3}
                style={{ ...inputStyle(), resize: 'vertical' }}
              />
            </Field>
          </Section>

          {/* Section: Contact */}
          <Section title="Contact Details">
            <FormRow>
              <Field label="Email" error={errors.email}>
                <input id="company-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="hr@company.com" style={inputStyle(errors.email)} />
              </Field>
              <Field label="Phone">
                <input id="company-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle()} />
              </Field>
            </FormRow>
          </Section>

          {/* Section: Location */}
          <Section title="Location">
            <Field label="Address">
              <input id="company-address" name="address" value={form.address} onChange={handleChange} placeholder="Street address" style={inputStyle()} />
            </Field>
            <FormRow>
              <Field label="City">
                <input id="company-city" name="city" value={form.city} onChange={handleChange} placeholder="City" style={inputStyle()} />
              </Field>
              <Field label="State">
                <input id="company-state" name="state" value={form.state} onChange={handleChange} placeholder="State" style={inputStyle()} />
              </Field>
              <Field label="Country">
                <input id="company-country" name="country" value={form.country} onChange={handleChange} placeholder="Country" style={inputStyle()} />
              </Field>
            </FormRow>
          </Section>

          {/* Status toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.6rem', padding: '1rem 1.25rem' }}>
            <input
              id="company-active"
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3b82f6' }}
            />
            <label htmlFor="company-active" style={{ color: '#cbd5e1', fontWeight: 600, cursor: 'pointer' }}>
              Active — this company is currently recruiting
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/companies')}
              style={{ ...cancelBtn }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              Cancel
            </button>
            <button
              id="submit-company-btn"
              type="submit"
              disabled={loading}
              style={{ ...submitBtn, opacity: loading ? 0.7 : 1 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; }}
            >
              {loading ? '⏳ Saving…' : isEdit ? '💾 Update Company' : '✅ Create Company'}
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
      <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
      {error && <span style={{ color: '#f87171', fontSize: '0.78rem' }}>{error}</span>}
    </div>
  );
}

const inputStyle = (error) => ({
  backgroundColor: '#0f172a',
  border: `1px solid ${error ? '#dc2626' : '#334155'}`,
  borderRadius: '0.5rem',
  color: '#f1f5f9',
  padding: '0.6rem 0.875rem',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

const cancelBtn = {
  padding: '0.65rem 1.25rem',
  borderRadius: '0.5rem',
  border: '1px solid #475569',
  backgroundColor: 'transparent',
  color: '#94a3b8',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.15s',
};

const submitBtn = {
  padding: '0.65rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: '#3b82f6',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'background-color 0.15s',
};
