import React, { useState } from 'react';

export default function SelectionOutcomeModal({ application, isOpen, onClose, onSubmit, loading }) {
  const [outcome, setOutcome] = useState('SELECTED');
  const [offeredCtc, setOfferedCtc] = useState(application?.driveCtc || 14.5);
  const [remarks, setRemarks] = useState('Congratulations! Offer letter issued for SDE-1 position.');

  if (!isOpen || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: application.id,
      status: outcome,
      offeredCtc: outcome === 'SELECTED' ? parseFloat(offeredCtc) : null,
      selectionRemarks: remarks
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Declare Final Selection / Rejection</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Candidate: <strong>{application.studentName}</strong> — {application.driveTitle}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Final Decision *
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: '#059669' }}>
                <input
                  type="radio"
                  name="outcome"
                  value="SELECTED"
                  checked={outcome === 'SELECTED'}
                  onChange={() => setOutcome('SELECTED')}
                />
                SELECTED / EXTEND OFFER
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: '#dc2626' }}>
                <input
                  type="radio"
                  name="outcome"
                  value="REJECTED"
                  checked={outcome === 'REJECTED'}
                  onChange={() => setOutcome('REJECTED')}
                />
                REJECTED
              </label>
            </div>
          </div>

          {outcome === 'SELECTED' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Offered CTC (LPA in ₹) *
              </label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={offeredCtc}
                onChange={(e) => setOfferedCtc(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Remarks & Notification Notes
            </label>
            <textarea
              className="input-field"
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Detailed offer notes or rejection reason..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className={outcome === 'SELECTED' ? 'btn-success' : 'btn-danger'}
              disabled={loading}
            >
              {loading ? 'Processing...' : outcome === 'SELECTED' ? 'Issue Offer & Mark Selected' : 'Mark Rejected'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
