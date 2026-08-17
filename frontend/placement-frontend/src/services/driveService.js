import api from './api';

/**
 * Service module for Placement Drive API operations.
 * All methods return Axios promise responses.
 */

const BASE = '/drives';

const driveService = {
  /**
   * Fetch paginated drives, optionally filtered by status.
   * @param {Object} params - { status, page, size, sort }
   */
  getAll: (params = {}) => {
    const { status, page = 0, size = 10, sort = 'createdAt,desc' } = params;
    return api.get(BASE, { params: { status, page, size, sort } });
  },

  /**
   * Fetch a single drive by ID.
   * @param {number} id
   */
  getById: (id) => api.get(`${BASE}/${id}`),

  /**
   * Fetch all drives for a given company.
   * @param {number} companyId
   * @param {Object} params - { page, size }
   */
  getByCompany: (companyId, params = {}) => {
    const { page = 0, size = 10 } = params;
    return api.get(`${BASE}/company/${companyId}`, { params: { page, size } });
  },

  /**
   * Create a new placement drive.
   * @param {Object} data - Drive form data
   */
  create: (data) => api.post(BASE, data),

  /**
   * Update an existing placement drive.
   * @param {number} id
   * @param {Object} data - Updated drive form data
   */
  update: (id, data) => api.put(`${BASE}/${id}`, data),

  /**
   * Close a placement drive (sets status to CLOSED).
   * @param {number} id
   */
  close: (id) => api.patch(`${BASE}/${id}/close`),

  /**
   * Delete a placement drive.
   * @param {number} id
   */
  delete: (id) => api.delete(`${BASE}/${id}`),
};

export default driveService;
