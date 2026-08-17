import React from 'react';

const steps = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interviews' },
  { key: 'FINAL_OUTCOME', label: 'Final Outcome' },
];

export default function ApplicationTimeline({ status, interviewRoundsCount = 0 }) {
  const getStepStatus = (stepKey) => {
    if (status === 'WITHDRAWN') return 'disabled';
    
    if (status === 'REJECTED') {
      if (stepKey === 'FINAL_OUTCOME') return 'failed';
      if (stepKey === 'APPLIED') return 'completed';
      if (stepKey === 'SHORTLISTED' && interviewRoundsCount > 0) return 'completed';
      if (stepKey === 'INTERVIEW_SCHEDULED' && interviewRoundsCount > 0) return 'completed';
    }

    if (status === 'SELECTED') return 'completed';

    switch (stepKey) {
      case 'APPLIED':
        return 'completed';
      case 'SHORTLISTED':
        return ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED'].includes(status) ? 'completed' : 
               status === 'UNDER_REVIEW' ? 'current' : 'pending';
      case 'INTERVIEW_SCHEDULED':
        return ['INTERVIEW_SCHEDULED', 'SELECTED'].includes(status) ? 'completed' : 
               status === 'SHORTLISTED' ? 'current' : 'pending';
      case 'FINAL_OUTCOME':
        return status === 'SELECTED' ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div style={{ padding: '0.75rem 0', margin: '0.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '10%',
            right: '10%',
            height: '3px',
            backgroundColor: '#e2e8f0',
            zIndex: 1
          }}
        />

        {steps.map((step, idx) => {
          const state = getStepStatus(step.key);
          let circleBg = '#cbd5e1';
          let textColor = '#64748b';
          let symbol = idx + 1;

          if (state === 'completed') {
            circleBg = '#10b981';
            textColor = '#0f766e';
            symbol = '✓';
          } else if (state === 'current') {
            circleBg = '#3b82f6';
            textColor = '#1d4ed8';
          } else if (state === 'failed') {
            circleBg = '#ef4444';
            textColor = '#b91c1c';
            symbol = '✕';
          } else if (state === 'disabled') {
            circleBg = '#94a3b8';
            textColor = '#64748b';
          }

          let stepLabel = step.label;
          if (step.key === 'FINAL_OUTCOME') {
            if (status === 'SELECTED') stepLabel = 'Selected 🎉';
            else if (status === 'REJECTED') stepLabel = 'Rejected';
          }

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                flex: 1
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  boxShadow: state === 'current' ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                {symbol}
              </div>
              <span
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: state === 'current' || state === 'completed' ? '600' : '500',
                  color: textColor,
                  textAlign: 'center'
                }}
              >
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
