export const QUERY_KEYS = {
  ANALYTICS: {
    OVERVIEW: 'analytics-overview',
    SESSIONS: 'analytics-sessions',
    EVENTS: 'analytics-events',
    JOURNEYS: 'analytics-journeys',
    ENGAGEMENT: 'analytics-engagement',
  },
  COURSES: {
    ALL: 'courses-all',
    DETAIL: (id) => ['course', id],
  },
  USERS: {
    ALL: 'users-all',
    DETAIL: (id) => ['user', id],
  },
  EVENTS: {
    ALL: 'events-all',
    BY_SESSION: (sessionId) => ['events', 'session', sessionId],
    BY_USER: (userId) => ['events', 'user', userId],
  },
  SESSIONS: {
    DETAIL: (id) => ['session', id],
  },
};
