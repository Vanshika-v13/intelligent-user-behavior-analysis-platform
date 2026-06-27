import api from '../api';
import { eventService } from '../events/eventService';
import { sessionService } from '../sessions/sessionService';

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
  },
  getUsersAnalytics: async () => {
    // Temporary aggregation since /api/analytics/users does not exist
    const [{ data: overview }, { data: sessions }, { data: events }] = await Promise.all([
      api.get('/analytics/overview'),
      api.get('/sessions'),
      api.get('/events')
    ]);
    return {
      overview,
      sessions,
      events
    };
  }
};
