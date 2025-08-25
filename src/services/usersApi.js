import { apiClient } from './apiClient.js';

export const usersApi = {
  getUserDetail: () => apiClient.get('/user'),

  updateUser: (userName) => apiClient.patch('/user', { userName }),

  changePassword: (password, newPassword) => apiClient.patch('/user/change-password', { password, newPassword }),
};
