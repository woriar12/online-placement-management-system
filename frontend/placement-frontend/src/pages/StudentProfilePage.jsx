import React, { useState, useEffect } from 'react';
import AcademicDetails from '../components/student/AcademicDetails';
import SkillsSection from '../components/student/SkillsSection';
import ResumeUpload from '../components/student/ResumeUpload';
import CertificationsSection from '../components/student/CertificationsSection';
import ProjectsSection from '../components/student/ProjectsSection';
import { getStudentProfile, saveStudentProfile, updateStudentProfile } from '../services/studentApi';
import './StudentProfilePage.css';

// Demo student id — in a real app, read from auth context
const DEMO_STUDENT_ID = 1;

const TABS = ['Profile', 'Academic', 'Skills', 'Resume', 'Certifications', 'Projects'];

const StudentProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({
    fullName: '', email: '', phoneNumber: '', address: '',
    linkedinUrl: '', githubUrl: '',
    college: '', degree: '', branch: '', graduationYear: '',
    cgpa: '', percentage: '', tenthMarks: '', twelfthMarks: '',
    skills: [], certifications: [], projects: [],
    resumeOriginalName: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentProfile(DEMO_STUDENT_ID)
      .then((data) => {
        setProfile({
          ...data,
          skills: data.skills || [],
          certifications: data.certifications
            ? JSON.parse(data.certifications)
            : [],
          projects: data.projects
            ? JSON.parse(data.projects)
            : [],
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...profile,
      certifications: JSON.stringify(profile.certifications),
      projects: JSON.stringify(profile.projects),
    };
    try {
      if (profile.id) {
        await updateStudentProfile(profile.id, payload);
      } else {
        const created = await saveStudentProfile(payload);
        setProfile((p) => ({ ...p, id: created.id }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="spp-loading">
        <div className="spp-spinner" />
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="spp">
      {/* Header */}
      <div className="spp__header">
        <div className="spp__avatar">
          {profile.fullName ? profile.fullName[0].toUpperCase() : 'S'}
        </div>
        <div>
          <h1 className="spp__name">{profile.fullName || 'Your Name'}</h1>
          <p className="spp__email">{profile.email || 'your@email.com'}</p>
        </div>
        <button
          className={`spp__save-btn ${saved ? 'spp__save-btn--saved' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="spp__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`spp__tab ${activeTab === tab ? 'spp__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="spp__content">
        {activeTab === 'Profile' && (
          <div className="spp__grid">
            {[
              { label: 'Full Name', name: 'fullName', placeholder: 'e.g. Rahul Sharma' },
              { label: 'Email', name: 'email', placeholder: 'e.g. rahul@email.com' },
              { label: 'Phone Number', name: 'phoneNumber', placeholder: '+91 9876543210' },
              { label: 'LinkedIn URL', name: 'linkedinUrl', placeholder: 'https://linkedin.com/in/...' },
              { label: 'GitHub URL', name: 'githubUrl', placeholder: 'https://github.com/...' },
              { label: 'Address', name: 'address', placeholder: 'City, State' },
            ].map(({ label, name, placeholder }) => (
              <div key={name} className="spp__field">
                <label className="spp__label">{label}</label>
                <input
                  className="spp__input"
                  type="text"
                  name={name}
                  value={profile[name] || ''}
                  onChange={handleChange}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Academic' && (
          <AcademicDetails
            data={profile}
            onChange={(updated) => setProfile((p) => ({ ...p, ...updated }))}
          />
        )}

        {activeTab === 'Skills' && (
          <SkillsSection
            skills={profile.skills}
            onChange={(skills) => setProfile((p) => ({ ...p, skills }))}
          />
        )}

        {activeTab === 'Resume' && (
          <ResumeUpload
            studentId={profile.id || DEMO_STUDENT_ID}
            currentResumeName={profile.resumeOriginalName}
            onUploaded={(updated) =>
              setProfile((p) => ({ ...p, resumeOriginalName: updated.resumeOriginalName }))
            }
          />
        )}

        {activeTab === 'Certifications' && (
          <CertificationsSection
            certifications={profile.certifications}
            onChange={(certifications) => setProfile((p) => ({ ...p, certifications }))}
          />
        )}

        {activeTab === 'Projects' && (
          <ProjectsSection
            projects={profile.projects}
            onChange={(projects) => setProfile((p) => ({ ...p, projects }))}
          />
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
