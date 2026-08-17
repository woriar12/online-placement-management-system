import api from './api';

/**
 * Authentication service — wraps all /auth API endpoints.
 *
 * All methods return the Axios response directly; callers should
 * access `.data.data` for the payload and `.data.message` for messages.
 */
const authService = {

  /**
   * Register a new user (STUDENT or PLACEMENT_OFFICER).
   */
  register: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),

  /**
   * Login with email and password. Returns access + refresh tokens + user info.
   */
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  /**
   * Logout — instructs server to log the event; client clears tokens.
   */
  logout: () =>
    api.post('/auth/logout'),

  /**
   * Refresh access token using a stored refresh token.
   */
  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),

  /**
   * Initiate forgot-password flow. Server sends reset link.
   */
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  /**
   * Complete password reset with the token from the email link.
   */
  resetPassword: (token, newPassword, confirmPassword) =>
    api.post('/auth/reset-password', { token, newPassword, confirmPassword }),

  /**
   * Get the currently authenticated user's profile.
   */
  getCurrentUser: () =>
    api.get('/auth/me'),

  /**
   * Change password for the logged-in user.
   */
  changePassword: (currentPassword, newPassword, confirmPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword, confirmPassword }),
};

export default authService;
