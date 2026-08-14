import api from './api';

/**
 * Service methods for Admin & Reports Module REST API endpoints.
 */
export const adminService = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Student Management
  getStudents: async (params = {}) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await api.post('/admin/students', studentData);
    return response.data;
  },

  updateStudentStatus: async (id, statusData) => {
    const response = await api.put(`/admin/students/${id}/status`, statusData);
    return response.data;
  },

  // Company Management
  getCompanies: async (params = {}) => {
    const response = await api.get('/admin/companies', { params });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/admin/companies/${id}`);
    return response.data;
  },

  updateCompanyApprovalStatus: async (id, statusData) => {
    const response = await api.put(`/admin/companies/${id}/approval`, statusData);
    return response.data;
  },

  updateCompanyAccountStatus: async (id, statusData) => {
    const response = await api.put(`/admin/companies/${id}/status`, statusData);
    return response.data;
  },

  // Placement Drive Monitoring
  getDrives: async (params = {}) => {
    const response = await api.get('/admin/drives', { params });
    return response.data;
  },

  getDriveById: async (id) => {
    const response = await api.get(`/admin/drives/${id}`);
    return response.data;
  },

  // Application Monitoring
  getApplications: async (params = {}) => {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data;
  },

  // Reports API
  getOverallReport: async () => {
    const response = await api.get('/admin/reports/overall');
    return response.data;
  },

  getCompanyReport: async () => {
    const response = await api.get('/admin/reports/company');
    return response.data;
  },

  getDepartmentReport: async () => {
    const response = await api.get('/admin/reports/department');
    return response.data;
  },

  getYearReport: async () => {
    const response = await api.get('/admin/reports/year');
    return response.data;
  },

  getDriveReport: async () => {
    const response = await api.get('/admin/reports/drive');
    return response.data;
  },
};

export default adminService;
