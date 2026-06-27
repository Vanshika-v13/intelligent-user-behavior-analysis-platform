import api from '../api';

export const eventService = {
  getEvents: async () => {
    const { data } = await api.get('/events');
    return data;
  },
  getEventById: async (id) => {
    const { data } = await api.get(`/events/${id}`);
    return data;
  },
  getEventsBySession: async (sessionId) => {
    const { data } = await api.get(`/events/session/${sessionId}`);
    return data;
  },
  getEventsByUser: async (userId) => {
    const { data } = await api.get(`/events/user/${userId}`);
    return data;
  },
  createEvent: async (eventData) => {
    const { data } = await api.post('/events', eventData);
    return data;
  }
};
