import React from 'react';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import './DriveCard.css';

const DriveCard = ({ drive, onApply }) => (
  <div className={`drive-card ${!drive.eligible ? 'drive-card--ineligible' : ''}`}>
    <div className="drive-card__header">
      <h3 className="drive-card__company">{drive.company}</h3>
      {drive.eligible ? (
        <span className="drive-card__tag drive-card__tag--eligible">Eligible</span>
      ) : (
        <span className="drive-card__tag drive-card__tag--ineligible">Not Eligible</span>
      )}
    </div>
    <p className="drive-card__role">{drive.role}</p>
    <div className="drive-card__meta">
      <span>Min CGPA: <strong>{drive.minCgpa}</strong></span>
      <span>Deadline: <strong>{drive.deadline}</strong></span>
    </div>
    {drive.status && (
      <div className="drive-card__status">
        Status: <ApplicationStatusBadge status={drive.status} />
      </div>
    )}
    {drive.eligible && onApply && (
      <button className="drive-card__btn" onClick={() => onApply(drive)}>
        Apply Now
      </button>
    )}
  </div>
);

export default DriveCard;
