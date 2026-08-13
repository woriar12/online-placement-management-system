/**
 * Application Constants
 */
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  STUDENT: 'ROLE_STUDENT',
  COMPANY: 'ROLE_COMPANY',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  STUDENT: '/students',
  COMPANY: '/companies',
  DRIVES: '/drives',
  APPLICATIONS: '/applications',
};
