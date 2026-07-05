import api from '../api';

/**
 * Service for v1 Analytics APIs (/api/analytics)
 */
class AnalyticsV1Service {
  async getOverview(filters, config = {}) {
    const response = await api.get('/analytics/overview', { params: filters, ...config });
    return response.data;
  }

  async getSessionsAnalytics(filters, config = {}) {
    const response = await api.get('/analytics/sessions', { params: filters, ...config });
    return response.data;
  }

  async getEventsAnalytics(filters, config = {}) {
    const response = await api.get('/analytics/events', { params: filters, ...config });
    return response.data;
  }

  async getJourneysAnalytics(filters, config = {}) {
    const response = await api.get('/analytics/journeys', { params: filters, ...config });
    return response.data;
  }

  async getEngagementAnalytics(filters, config = {}) {
    const response = await api.get('/analytics/engagement', { params: filters, ...config });
    return response.data;
  }

  async trackEvent(eventData, config = {}) {
    const response = await api.post('/analytics/track', eventData, config);
    return response.data;
  }
}

export default new AnalyticsV1Service();
