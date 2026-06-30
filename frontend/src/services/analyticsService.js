import api from './api';

export const analyticsService = {
  trackEvent: async (eventName, payload = {}) => {
    // Analytics is currently mocked, but ready for future integration
    try {
      const response = await api.post('/analytics/track', {
        eventType: eventName,
        timestamp: new Date().toISOString(),
        ...payload
      });
      return response.data;
    } catch (error) {
      console.warn('Analytics trackEvent failed:', error);
      return null; // Don't crash app on analytics failure
    }
  }
};
