import React from 'react';
import './AcademicDetails.css';

const FormField = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div className="academic__field">
    <label className="academic__label">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder || ''}
      className="academic__input"
    />
  </div>
);

const AcademicDetails = ({ data = {}, onChange }) => {
  const handle = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="academic-details">
      <h3 className="academic-details__title">Academic Details</h3>
      <div className="academic__grid">
        <FormField label="College / University" name="college" value={data.college} onChange={handle} placeholder="e.g. IIT Delhi" />
        <FormField label="Degree" name="degree" value={data.degree} onChange={handle} placeholder="e.g. B.Tech" />
        <FormField label="Branch / Stream" name="branch" value={data.branch} onChange={handle} placeholder="e.g. Computer Science" />
        <FormField label="Graduation Year" name="graduationYear" value={data.graduationYear} onChange={handle} type="number" placeholder="e.g. 2025" />
        <FormField label="CGPA" name="cgpa" value={data.cgpa} onChange={handle} type="number" placeholder="e.g. 8.7" />
        <FormField label="Percentage (%)" name="percentage" value={data.percentage} onChange={handle} type="number" placeholder="e.g. 85.5" />
        <FormField label="10th Marks / %" name="tenthMarks" value={data.tenthMarks} onChange={handle} placeholder="e.g. 92%" />
        <FormField label="12th Marks / %" name="twelfthMarks" value={data.twelfthMarks} onChange={handle} placeholder="e.g. 88%" />
      </div>
    </div>
  );
};

export default AcademicDetails;
