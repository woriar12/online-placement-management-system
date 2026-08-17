import React, { useState } from 'react';
import './ProjectsSection.css';

const empty = () => ({ title: '', description: '', techStack: '', link: '' });

const ProjectsSection = ({ projects = [], onChange }) => {
  const [items, setItems] = useState(projects.length > 0 ? projects : [empty()]);

  const update = (idx, field, val) => {
    const updated = items.map((p, i) => (i === idx ? { ...p, [field]: val } : p));
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
    <div className="projects-section">
      <h3 className="projects-section__title">Projects</h3>
      {items.map((proj, idx) => (
        <div key={idx} className="project-card">
          <div className="project-card__header">
            <span className="project-card__num">#{idx + 1}</span>
            <button
              type="button"
              className="project-card__remove"
              onClick={() => removeRow(idx)}
            >
              Remove
            </button>
          </div>
          <div className="project-card__grid">
            <input
              className="proj-input proj-input--full"
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => update(idx, 'title', e.target.value)}
            />
            <input
              className="proj-input"
              placeholder="Tech Stack (e.g. React, Spring Boot)"
              value={proj.techStack}
              onChange={(e) => update(idx, 'techStack', e.target.value)}
            />
            <input
              className="proj-input"
              placeholder="Project Link / GitHub URL"
              value={proj.link}
              onChange={(e) => update(idx, 'link', e.target.value)}
            />
            <textarea
              className="proj-textarea proj-input--full"
              placeholder="Short description…"
              rows={3}
              value={proj.description}
              onChange={(e) => update(idx, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}
      <button type="button" className="proj-add-btn" onClick={addRow}>
        + Add Project
      </button>
    </div>
  );
};

export default ProjectsSection;
