import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import ApplyDriveModal from '../components/ApplyDriveModal';
import StatusBadge from '../components/StatusBadge';

export default function DriveExplorerPage() {
  const [drives, setDrives] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Student mock profile info
  const studentCgpa = 8.85;
  const studentBranch = 'CSE';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock active drives list if backend api is loading
      const mockDrives = [
        {
          id: 1,
          title: 'Software Development Engineer - 2025',
          companyName: 'TechCorp Global',
          jobRole: 'Software Engineer (SDE-1)',
          jobDescription: 'Design, develop, and deploy cloud microservices using Spring Boot and React.',
          location: 'Bangalore, India',
          ctc: 14.5,
          minCgpa: 7.5,
          eligibleBranches: 'CSE,IT,ECE',
          deadline: '2026-08-30T23:59:59',
          status: 'ACTIVE'
        },
        {
          id: 2,
          title: 'Cloud Systems & DevOps Engineer',
          companyName: 'InnovateX Solutions',
          jobRole: 'Cloud Engineer',
          jobDescription: 'Automate Infrastructure as Code using Terraform, Kubernetes, and AWS CI/CD.',
          location: 'Hyderabad, India',
          ctc: 12.0,
          minCgpa: 7.0,
          eligibleBranches: 'CSE,IT',
          deadline: '2026-09-05T23:59:59',
          status: 'ACTIVE'
        },
        {
          id: 3,
          title: 'Data Analyst & Business Intelligence',
          companyName: 'FinTech Dynamics',
          jobRole: 'Data Analyst',
          jobDescription: 'Build executive dashboards and perform predictive data modeling.',
          location: 'Mumbai, India',
          ctc: 10.0,
          minCgpa: 6.5,
          eligibleBranches: 'CSE,ECE,EEE,ME',
          deadline: '2026-08-28T23:59:59',
          status: 'ACTIVE'
        }
      ];

      setDrives(mockDrives);

      // Try fetching my applied applications
      try {
        const res = await applicationService.getMyApplications(1);
        if (res && res.data) {
          setMyApplications(res.data);
        }
      } catch (e) {
        console.log('Using initial client state for applications');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (drive) => {
    setSelectedDrive(drive);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (payload) => {
    setSubmitting(true);
    try {
      let result;
      try {
        result = await applicationService.applyForDrive(payload);
      } catch (apiErr) {
        // Fallback for offline demo state
        result = {
          data: {
            id: Date.now(),
            placementDriveId: payload.placementDriveId,
            driveTitle: selectedDrive.title,
            companyName: selectedDrive.companyName,
            jobRole: selectedDrive.jobRole,
            driveCtc: selectedDrive.ctc,
            appliedAt: new Date().toISOString(),
            status: 'APPLIED',
            resumeUrl: payload.resumeUrl,
            coverNote: payload.coverNote,
            interviewRoundsCount: 0
          }
        };
      }

      setMyApplications(prev => [result.data, ...prev]);
      setAlert({ type: 'success', message: `Successfully applied for ${selectedDrive.title}!` });
      setIsApplyModalOpen(false);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to submit application' });
    } finally {
      setSubmitting(false);
    }
  };

  const isApplied = (driveId) => {
    return myApplications.some(app => app.placementDriveId === driveId && app.status !== 'WITHDRAWN');
  };

  const getApplicationForDrive = (driveId) => {
    return myApplications.find(app => app.placementDriveId === driveId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Campus Placement Drives
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Explore eligible recruitment drives, check requirements, and apply directly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.65rem 1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Student CGPA</div>
              <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{studentCgpa}</strong>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Branch</div>
              <strong style={{ color: '#4ade80', fontSize: '1.1rem' }}>{studentBranch}</strong>
            </div>
          </div>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button className="btn-icon" onClick={() => setAlert(null)}>✕</button>
        </div>
      )}

      {/* Drives Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading placement drives...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {drives.map((drive) => {
            const applied = isApplied(drive.id);
            const userApp = getApplicationForDrive(drive.id);
            const isEligible = studentCgpa >= (drive.minCgpa || 0) && drive.eligibleBranches.includes(studentBranch);

            return (
              <div key={drive.id} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-primary">{drive.companyName}</span>
                    {applied && userApp ? (
                      <StatusBadge status={userApp.status} />
                    ) : (
                      <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
                        {isEligible ? 'Eligible' : 'Ineligible'}
                      </span>
                    )}
                  </div>

                  <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', color: '#0f172a' }}>{drive.title}</h3>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{drive.jobRole}</p>

                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {drive.jobDescription}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>CTC Package</span>
                      <strong style={{ color: '#059669', fontSize: '0.95rem' }}>₹{drive.ctc} LPA</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Min Cut-off</span>
                      <strong style={{ color: '#2563eb' }}>{drive.minCgpa} CGPA</strong>
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '0.25rem' }}>
                      <span style={{ color: '#64748b' }}>Branches: </span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{drive.eligibleBranches}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {applied ? (
                    <button className="btn-secondary" style={{ width: '100%' }} disabled>
                      ✓ Already Applied ({userApp?.status})
                    </button>
                  ) : !isEligible ? (
                    <button className="btn-secondary" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }} disabled>
                      Ineligible (CGPA/Branch)
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleApplyClick(drive)}
                    >
                      Apply Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ApplyDriveModal
        drive={selectedDrive}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleSubmitApplication}
        loading={submitting}
      />
    </div>
  );
}
