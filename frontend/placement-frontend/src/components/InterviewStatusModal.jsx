import React, { useState, useEffect } from 'react';

export default function InterviewStatusModal({ round, isOpen, onClose, onSubmit, loading }) {
  const [status, setStatus] = useState('PASSED');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(85);

  useEffect(() => {
    if (round) {
      setStatus(round.status || 'PASSED');
      setFeedback(round.interviewerFeedback || '');
      setScore(round.score || 85);
    }
  }, [round]);

  if (!isOpen || !round) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: round.id,
      status,
      interviewerFeedback: feedback,
      score: parseFloat(score)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Update Interview Result</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Round {round.roundNumber}: {round.roundName} — {round.studentName}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Outcome Status *
              </label>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PASSED">PASSED (Advanced to next step)</option>
                <option value="FAILED">FAILED (Rejected)</option>
                <option value="SCHEDULED">SCHEDULED (Pending)</option>
                <option value="ABSENT">ABSENT</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Score / Rating (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Interviewer Feedback / Evaluation Notes
            </label>
            <textarea
              className="input-field"
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Candidate demonstrated strong algorithmic knowledge, clean coding structure, and good problem solving skills..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Interview Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
