import React, { useState } from 'react';

export default function ScheduleInterviewModal({ application, isOpen, onClose, onSubmit, loading }) {
  const [roundNumber, setRoundNumber] = useState((application?.interviewRoundsCount || 0) + 1);
  const [roundName, setRoundName] = useState('Technical Coding Round');
  const [scheduledDateTime, setScheduledDateTime] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );
  const [mode, setMode] = useState('ONLINE');
  const [venueOrLink, setVenueOrLink] = useState('https://meet.google.com/opms-interview');
  const [instructions, setInstructions] = useState('Please bring your ID card and ensure stable internet connectivity with webcam enabled.');

  if (!isOpen || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      applicationId: application.id,
      roundNumber: parseInt(roundNumber, 10),
      roundName,
      scheduledDateTime,
      mode,
      venueOrLink,
      instructions
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Schedule Interview Round</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Candidate: <strong>{application.studentName}</strong> ({application.rollNumber}) — {application.driveTitle}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Round #
              </label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Round Name *
              </label>
              <input
                type="text"
                className="input-field"
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                placeholder="e.g. Aptitude Test / Technical Round 1"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Interview Mode *
              </label>
              <select className="input-field" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="ONLINE">ONLINE (Video Call / Link)</option>
                <option value="IN_PERSON">IN_PERSON (On Campus / Venue)</option>
                <option value="TELEPHONIC">TELEPHONIC</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Meeting Link or Physical Venue Address
            </label>
            <input
              type="text"
              className="input-field"
              value={venueOrLink}
              onChange={(e) => setVenueOrLink(e.target.value)}
              placeholder="e.g. Google Meet Link or Placement Cell Room 302"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Candidate Instructions
            </label>
            <textarea
              className="input-field"
              rows="2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Scheduling...' : 'Confirm & Schedule Round'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
