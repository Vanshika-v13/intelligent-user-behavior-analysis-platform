import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: () => {
    // Local cleanup is handled by AuthContext, this is just for api specifics if needed later
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },
  updatePassword: async (data) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await api.delete('/auth/me');
    return response.data;
  }
};
