import api from './api';

export const progressService = {
  getProgress: async (courseId) => {
    const response = await api.get(`/progress/${courseId}`);
    return response.data;
  },
  saveProgress: async (courseId, lessonId, analyticsData = {}) => {
    const payload = {
      courseId,
      lessonId,
      completedAt: new Date().toISOString(),
      // Prepare for analytics
      eventType: 'LESSON_COMPLETED',
      ...analyticsData
    };
    const response = await api.post('/progress', payload);
    return response.data;
  }
};
