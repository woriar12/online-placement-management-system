import React, { useState } from 'react';

export default function ApplyDriveModal({ drive, isOpen, onClose, onSubmit, loading }) {
  const [resumeUrl, setResumeUrl] = useState('https://example.com/resumes/my_resume.pdf');
  const [coverNote, setCoverNote] = useState('');

  if (!isOpen || !drive) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      placementDriveId: drive.id,
      resumeUrl,
      coverNote
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Apply for Placement Drive</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              {drive.title} — {drive.companyName || drive.company?.companyName}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ color: '#64748b' }}>Role:</span>
              <strong style={{ color: '#0f172a' }}>{drive.jobRole}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ color: '#64748b' }}>CTC Package:</span>
              <strong style={{ color: '#10b981' }}>₹{drive.ctc} LPA</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Min CGPA Cut-off:</span>
              <strong style={{ color: '#2563eb' }}>{drive.minCgpa || 'N/A'}</strong>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Resume URL / Link *
            </label>
            <input
              type="url"
              className="input-field"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/your-resume.pdf"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Cover Note / Statement of Interest (Optional)
            </label>
            <textarea
              className="input-field"
              rows="3"
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Briefly state your key skills, relevant projects, and why you are interested in this position..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
