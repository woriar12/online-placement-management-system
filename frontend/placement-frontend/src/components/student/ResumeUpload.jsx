import React, { useState } from 'react';
import './ResumeUpload.css';
import { uploadResume } from '../../services/studentApi';

const ResumeUpload = ({ studentId, currentResumeName, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const updated = await uploadResume(studentId, file);
      setSuccess(true);
      setFile(null);
      if (onUploaded) onUploaded(updated);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-upload">
      <h3 className="resume-upload__title">Resume / CV</h3>
      {currentResumeName && (
        <p className="resume-upload__current">
          📄 Current: <span>{currentResumeName}</span>
        </p>
      )}
      <label className="resume-upload__dropzone">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {file ? (
          <span className="resume-upload__filename">✅ {file.name}</span>
        ) : (
          <span className="resume-upload__hint">
            Click to select PDF resume<br />
            <small>Max size: 10 MB</small>
          </span>
        )}
      </label>
      {error && <p className="resume-upload__error">{error}</p>}
      {success && <p className="resume-upload__success">Resume uploaded successfully!</p>}
      <button
        className="resume-upload__btn"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading…' : 'Upload Resume'}
      </button>
    </div>
  );
};

export default ResumeUpload;
