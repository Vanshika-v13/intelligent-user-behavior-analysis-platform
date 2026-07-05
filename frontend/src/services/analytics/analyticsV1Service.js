import api from '../api';
import { buildAnalyticsQuery } from '../../utils/analytics/queryHelpers';

/**
 * Service for v1 Analytics APIs (/api/analytics)
 */
class AnalyticsV1Service {
  async getOverview(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/overview${query}`);
    return response.data;
  }

  async getSessionsAnalytics(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/sessions${query}`);
    return response.data;
  }

  async getEventsAnalytics(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/events${query}`);
    return response.data;
  }

  async getJourneysAnalytics(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/journeys${query}`);
    return response.data;
  }

  async getEngagementAnalytics(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/engagement${query}`);
    return response.data;
  }

  async trackEvent(eventData) {
    const response = await api.post('/analytics/track', eventData);
    return response.data;
  }
}

export default new AnalyticsV1Service();
