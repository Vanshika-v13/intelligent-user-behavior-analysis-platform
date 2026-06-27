export const API_ENDPOINTS = {
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    SESSIONS: '/analytics/sessions',
    EVENTS: '/analytics/events',
    JOURNEYS: '/analytics/journeys',
    ENGAGEMENT: '/analytics/engagement',
  },
  COURSES: {
    BASE: '/courses',
    DETAIL: (id) => `/courses/${id}`,
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id) => `/users/${id}`,
  },
  EVENTS: {
    BASE: '/events',
    DETAIL: (id) => `/events/${id}`,
    BY_SESSION: (sessionId) => `/events/session/${sessionId}`,
    BY_USER: (userId) => `/events/user/${userId}`,
  },
  SESSIONS: {
    START: '/sessions/start',
    END: (id) => `/sessions/${id}/end`,
    DETAIL: (id) => `/sessions/${id}`,
  },
};
