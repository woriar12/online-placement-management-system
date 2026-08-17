import api from './api';

/**
 * Service module for Company API operations.
 * All methods return Axios promise responses.
 */

const BASE = '/companies';

const companyService = {
  /**
   * Fetch paginated companies, optionally filtered by name search.
   * @param {Object} params - { search, page, size, sort }
   */
  getAll: (params = {}) => {
    const { search, page = 0, size = 10, sort = 'name,asc' } = params;
    return api.get(BASE, { params: { search, page, size, sort } });
  },

  /**
   * Fetch a single company by ID.
   * @param {number} id
   */
  getById: (id) => api.get(`${BASE}/${id}`),

  /**
   * Create a new company.
   * @param {Object} data - Company form data
   */
  create: (data) => api.post(BASE, data),

  /**
   * Update an existing company.
   * @param {number} id
   * @param {Object} data - Updated company form data
   */
  update: (id, data) => api.put(`${BASE}/${id}`, data),

  /**
   * Delete a company by ID.
   * @param {number} id
   */
  delete: (id) => api.delete(`${BASE}/${id}`),
};

export default companyService;
