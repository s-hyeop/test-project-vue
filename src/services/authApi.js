import { apiClient } from './apiClient.js';

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }, { skipAuth: true }),

  signup: (email, password, userName, code) => apiClient.post('/auth/signup', { email, password, userName, code }, { skipAuth: true }),

  sendSignupCode: (email) => apiClient.post('/auth/signup/code', { email }, { skipAuth: true }),

  verifySignupCode: (email, code) => apiClient.post('/auth/signup/verify', { email, code }, { skipAuth: true }),

  sendResetPasswordCode: (email) => apiClient.post('/auth/reset-password/code', { email }, { skipAuth: true }),

  verifyResetPasswordCode: (email, code) => apiClient.post('/auth/reset-password/verify', { email, code }, { skipAuth: true }),

  resetPassword: (email, password, code) => apiClient.post('/auth/reset-password', { email, password, code }, { skipAuth: true }),

  checkEmailExist: (email) => apiClient.post('/auth/email/exist', { email }, { skipAuth: true }),

  deleteCurrentToken: () => apiClient.delete('/tokens/current'),

  deleteToken: (refreshToken) => apiClient.delete(`/tokens/${refreshToken}`),

  getTokens: () => apiClient.get('/tokens'),
};
