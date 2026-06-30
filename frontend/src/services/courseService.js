import api from './api';

export const courseService = {
  getAllCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.categories;
  }
};
