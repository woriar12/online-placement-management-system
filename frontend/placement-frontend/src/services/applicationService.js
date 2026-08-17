import api from './api';

/**
 * Service handling REST API calls for Applications and Interviews.
 */
export const applicationService = {
  // Student: Apply for placement drive
  applyForDrive: async (payload) => {
    const res = await api.post('/applications/apply', payload);
    return res.data;
  },

  // Student: Get my applications
  getMyApplications: async (studentProfileId = 1) => {
    const res = await api.get(`/applications/my-applications?studentProfileId=${studentProfileId}`);
    return res.data;
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  // Admin/Company: Get applications for placement drive with filters
  getApplicationsForDrive: async (driveId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/applications/drive/${driveId}${query ? '?' + query : ''}`);
    return res.data;
  },

  // Admin/Company: Bulk shortlist candidates
  shortlistCandidates: async (payload) => {
    const res = await api.post('/applications/shortlist', payload);
    return res.data;
  },

  // Update application status
  updateStatus: async (id, payload) => {
    const res = await api.put(`/applications/${id}/status`, payload);
    return res.data;
  },

  // Student: Withdraw application
  withdrawApplication: async (id, studentProfileId = 1) => {
    const res = await api.put(`/applications/${id}/withdraw?studentProfileId=${studentProfileId}`);
    return res.data;
  },

  // Admin/Company: Update final selection outcome
  updateSelectionStatus: async (id, payload) => {
    const res = await api.put(`/applications/${id}/selection`, payload);
    return res.data;
  },

  // Interview API Calls
  scheduleInterview: async (payload) => {
    const res = await api.post('/interviews/schedule', payload);
    return res.data;
  },

  getInterviewsForApplication: async (applicationId) => {
    const res = await api.get(`/interviews/application/${applicationId}`);
    return res.data;
  },

  getInterviewsForDrive: async (driveId) => {
    const res = await api.get(`/interviews/drive/${driveId}`);
    return res.data;
  },

  getMyInterviews: async (studentProfileId = 1) => {
    const res = await api.get(`/interviews/my-interviews?studentProfileId=${studentProfileId}`);
    return res.data;
  },

  updateInterviewStatus: async (id, payload) => {
    const res = await api.put(`/interviews/${id}/status`, payload);
    return res.data;
  }
};

export default applicationService;
