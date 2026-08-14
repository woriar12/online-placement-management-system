import React from 'react';

/**
 * Clean, pure React & CSS SVG chart renderer without external chart library dependencies.
 * Fully responsive, pixel-perfect, zero bundle bloat, and smooth visuals.
 */
export default function PlacementChart({ type, title, data = [] }) {
  // Render Department-wise Placements (Horizontal Bar Chart)
  if (type === 'department') {
    const maxVal = Math.max(...data.map((d) => d.selectedStudents || 1), 10);
    return (
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>{title || 'Department-wise Placements'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {data.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.selectedStudents / maxVal) * 100));
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>
                  <span>{item.department}</span>
                  <span style={{ color: '#2563eb' }}>{item.selectedStudents} Placed ({item.placementPercentage}%)</span>
                </div>
                <div style={{ height: '10px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                      borderRadius: '9999px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Application Status Distribution (Donut Chart)
  if (type === 'status-distribution') {
    const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
    let accumulated = 0;
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'];

    return (
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>{title || 'Application Status Distribution'}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          <svg width="140" height="140" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
            {data.map((item, idx) => {
              const strokeDash = (item.value / total) * 100;
              const strokeOffset = 100 - accumulated;
              accumulated += strokeDash;
              return (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke={colors[idx % colors.length]}
                  strokeWidth="4"
                  strokeDasharray={`${strokeDash} ${100 - strokeDash}`}
                  strokeDashoffset={strokeOffset}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              );
            })}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[idx % colors.length] }} />
                <span style={{ color: '#475569', fontWeight: '500' }}>{item.label}:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Monthly Placement Trend (Line/Area Visual)
  if (type === 'trend') {
    const maxVal = Math.max(...data.map((d) => d.value || 1), 10);
    return (
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>{title || 'Monthly Placement Trend'}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '1rem', paddingBottom: '0.5rem', gap: '0.5rem' }}>
          {data.map((item, idx) => {
            const heightPct = Math.min(100, Math.round((item.value / maxVal) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#2563eb', marginBottom: '0.25rem' }}>{item.value}</span>
                <div
                  style={{
                    width: '70%',
                    maxWidth: '30px',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, #3b82f6, #60a5fa)',
                    borderRadius: '0.375rem 0.375rem 0 0',
                    transition: 'height 0.5s ease',
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.375rem', fontWeight: '600' }}>{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
