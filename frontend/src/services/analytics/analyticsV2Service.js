import api from '../api';

/**
 * Service for v2 Analytics APIs (/api/v2/analytics)
 */
class AnalyticsV2Service {
  async getDevices(filters, config = {}) {
    const response = await api.get('/v2/analytics/devices', { params: filters, ...config });
    return response.data;
  }

  async getCourses(filters, config = {}) {
    const response = await api.get('/v2/analytics/courses', { params: filters, ...config });
    return response.data;
  }

  async getVideos(filters, config = {}) {
    const response = await api.get('/v2/analytics/videos', { params: filters, ...config });
    return response.data;
  }

  async getQuizzes(filters, config = {}) {
    const response = await api.get('/v2/analytics/quizzes', { params: filters, ...config });
    return response.data;
  }

  async getUsers(filters, config = {}) {
    const response = await api.get('/v2/analytics/users', { params: filters, ...config });
    return response.data;
  }

  async getFunnels(filters, config = {}) {
    const response = await api.get('/v2/analytics/funnels', { params: filters, ...config });
    return response.data;
  }

  async getTimeSeries(filters, config = {}) {
    const response = await api.get('/v2/analytics/timeseries', { params: filters, ...config });
    return response.data;
  }
}

export default new AnalyticsV2Service();
