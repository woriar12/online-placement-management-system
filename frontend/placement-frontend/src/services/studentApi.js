import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

// ── Student Profile ────────────────────────────────────────────────
export const getStudentProfile = (id) =>
  api.get(`/students/${id}`).then((r) => r.data);

export const saveStudentProfile = (data) =>
  api.post('/students', data).then((r) => r.data);

export const updateStudentProfile = (id, data) =>
  api.put(`/students/${id}`, data).then((r) => r.data);

// ── Resume Upload ──────────────────────────────────────────────────
export const uploadResume = (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return api
    .post(`/students/${id}/resume`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

// ── Placement Drives ───────────────────────────────────────────────
export const getEligibleDrives = (id) =>
  api.get(`/students/${id}/drives`).then((r) => r.data);

// ── Application Status ─────────────────────────────────────────────
export const getApplicationStatus = (id) =>
  api.get(`/students/${id}/applications`).then((r) => r.data);
