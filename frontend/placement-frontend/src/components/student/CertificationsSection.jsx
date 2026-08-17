import React, { useState } from 'react';
import './CertificationsSection.css';

const empty = () => ({ name: '', issuer: '', year: '' });

const CertificationsSection = ({ certifications = [], onChange }) => {
  const [items, setItems] = useState(
    certifications.length > 0 ? certifications : [empty()]
  );

  const update = (idx, field, val) => {
    const updated = items.map((c, i) =>
      i === idx ? { ...c, [field]: val } : c
    );
    setItems(updated);
    onChange(updated);
  };

  const addRow = () => {
    const updated = [...items, empty()];
    setItems(updated);
    onChange(updated);
  };

  const removeRow = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    onChange(updated);
  };

  return (
    <div className="certifications">
      <h3 className="certifications__title">Certifications</h3>
      {items.map((cert, idx) => (
        <div key={idx} className="cert-row">
          <input
            className="cert-input"
            placeholder="Certification Name"
            value={cert.name}
            onChange={(e) => update(idx, 'name', e.target.value)}
          />
          <input
            className="cert-input"
            placeholder="Issuer (e.g. Coursera)"
            value={cert.issuer}
            onChange={(e) => update(idx, 'issuer', e.target.value)}
          />
          <input
            className="cert-input cert-input--year"
            placeholder="Year"
            value={cert.year}
            type="number"
            onChange={(e) => update(idx, 'year', e.target.value)}
          />
          <button
            type="button"
            className="cert-remove-btn"
            onClick={() => removeRow(idx)}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="cert-add-btn" onClick={addRow}>
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsSection;
