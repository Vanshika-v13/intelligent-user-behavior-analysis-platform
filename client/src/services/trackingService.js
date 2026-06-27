import { batchTracker } from '../utils/batchTracker';
import { EVENT_TYPES } from '../constants/eventTypes';
import { EVENT_VERSION, EVENT_CATEGORIES } from '../constants/analyticsConfig';
import { getDeviceInfo } from '../utils/deviceInfo';
import { ENABLE_ANALYTICS } from '../config/analytics';
import api from './api';

let sessionSequenceNumber = 0;

const createPayload = (eventType, metadata = {}, sessionId, userId, page) => {
  sessionSequenceNumber += 1;

  return {
    version: EVENT_VERSION,
    sessionId,
    sessionSequenceNumber,
    userId,
    eventType,
    page: page || window.location.pathname,
    timestamp: new Date().toISOString(),
    metadata: {
      ...getDeviceInfo(),
      ...metadata
    }
  };
};

export const trackingService = {
  startSession: async (userId) => {
    if (!ENABLE_ANALYTICS) return null;
    sessionSequenceNumber = 0; // Reset sequence on new session
    try {
      const response = await api.post('/sessions/start', { userId });
      return response.data.sessionId;
    } catch (error) {
      console.error('Failed to start session on backend', error);
      return null;
    }
  },

  endSession: async (sessionId) => {
    if (!ENABLE_ANALYTICS) return;
    try {
      await api.post('/sessions/end', { sessionId });
    } catch (error) {
      console.error('Failed to end session on backend', error);
    }
  },

  trackPageView: (sessionId, userId, page, previousPage, duration) => {
    if (!ENABLE_ANALYTICS) return;
    const metadata = { previousPage, category: EVENT_CATEGORIES.NAVIGATION };
    if (duration) metadata.duration = duration;
    const payload = createPayload(EVENT_TYPES.PAGE_VIEW, metadata, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackClick: (sessionId, userId, page, elementId, elementText, elementType) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.CLICK, { elementId, elementText, elementType, category: EVENT_CATEGORIES.NAVIGATION }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackSearch: (sessionId, userId, page, queryLength, resultsCount) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.SEARCH, { queryLength, resultsCount, category: EVENT_CATEGORIES.SEARCH }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackCourseOpen: (sessionId, userId, page, courseId, courseTitle, categoryName) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.COURSE_OPEN, { courseId, courseTitle, courseCategory: categoryName, category: EVENT_CATEGORIES.COURSE }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackVideoPlay: (sessionId, userId, page, videoId) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.VIDEO_PLAY, { videoId, category: EVENT_CATEGORIES.VIDEO }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackVideoPause: (sessionId, userId, page, videoId) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.VIDEO_PAUSE, { videoId, category: EVENT_CATEGORIES.VIDEO }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackVideoComplete: (sessionId, userId, page, videoId) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.VIDEO_COMPLETE, { videoId, category: EVENT_CATEGORIES.VIDEO }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackQuizStart: (sessionId, userId, page, quizId) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.QUIZ_START, { quizId, category: EVENT_CATEGORIES.QUIZ }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackQuizSubmit: (sessionId, userId, page, quizId, score) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(EVENT_TYPES.QUIZ_SUBMIT, { quizId, score, category: EVENT_CATEGORIES.QUIZ }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  },

  trackDashboardEvent: (sessionId, userId, page, eventType, metadata = {}) => {
    if (!ENABLE_ANALYTICS) return;
    const payload = createPayload(eventType, { ...metadata, category: EVENT_CATEGORIES.DASHBOARD }, sessionId, userId, page);
    batchTracker.addEvent(payload);
  }
};
