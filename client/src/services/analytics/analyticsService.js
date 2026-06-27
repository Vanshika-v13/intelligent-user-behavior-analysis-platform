import api from '../api';

export const analyticsService = {
  getOverview: async () => {
    const { data } = await api.get('/analytics/overview');
    return data;
  },
  getSessionsAnalytics: async () => {
    const { data } = await api.get('/analytics/sessions');
    return data;
  },
  getEventsAnalytics: async () => {
    const { data } = await api.get('/analytics/events');
    return data;
  },
  getJourneysAnalytics: async () => {
    const { data } = await api.get('/analytics/journeys');
    return data;
  },
  getEngagementAnalytics: async () => {
    const { data } = await api.get('/analytics/engagement');
    return data;
  }
};
