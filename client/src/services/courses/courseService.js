import api from '../api';

export const courseService = {
  getCourses: async () => {
    const { data } = await api.get('/courses');
    return data;
  },
  getCourseById: async (id) => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  }
};
