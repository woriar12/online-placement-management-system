import React, { useState } from 'react';
import './SkillsSection.css';

const SkillsSection = ({ skills = [], onChange }) => {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="skills-section">
      <h3 className="skills-section__title">Skills</h3>
      <div className="skills-section__tags">
        {skills.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
            <button
              type="button"
              className="skill-tag__remove"
              onClick={() => removeSkill(skill)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="skills-section__input-row">
        <input
          type="text"
          placeholder="Add a skill (press Enter)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="skills-section__input"
        />
        <button type="button" className="skills-section__add-btn" onClick={addSkill}>
          Add
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;
