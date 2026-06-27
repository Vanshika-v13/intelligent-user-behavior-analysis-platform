import api from '../api';

export const sessionService = {
  startSession: async (sessionData) => {
    const { data } = await api.post('/sessions/start', sessionData);
    return data;
  },
  endSession: async (sessionId) => {
    const { data } = await api.post(`/sessions/${sessionId}/end`);
    return data;
  },
  getSession: async (sessionId) => {
    const { data } = await api.get(`/sessions/${sessionId}`);
    return data;
  }
};
