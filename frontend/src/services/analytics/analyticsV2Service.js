import api from '../api';
import { buildAnalyticsQuery } from '../../utils/analytics/queryHelpers';

/**
 * Service for v2 Analytics APIs (/api/analytics/v2)
 */
class AnalyticsV2Service {
  async getDevices(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/devices${query}`);
    return response.data;
  }

  async getCourses(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/courses${query}`);
    return response.data;
  }

  async getVideos(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/videos${query}`);
    return response.data;
  }

  async getQuizzes(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/quizzes${query}`);
    return response.data;
  }

  async getUsers(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/users${query}`);
    return response.data;
  }

  async getFunnels(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/funnels${query}`);
    return response.data;
  }

  async getTimeSeries(filters) {
    const query = buildAnalyticsQuery(filters);
    const response = await api.get(`/analytics/v2/timeseries${query}`);
    return response.data;
  }
}

export default new AnalyticsV2Service();
