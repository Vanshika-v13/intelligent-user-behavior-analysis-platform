import { useAnalyticsTracking } from '../contexts/AnalyticsContext';
import { trackingService } from '../services/trackingService';

export const useQuizTracking = () => {
  const { sessionId, userId, isTrackingEnabled } = useAnalyticsTracking();

  const trackStart = (quizId) => {
    if (!isTrackingEnabled || !sessionId) return;
    trackingService.trackQuizStart(sessionId, userId, window.location.pathname, quizId);
    localStorage.setItem('analytics_last_activity', Date.now().toString());
  };

  const trackSubmit = (quizId, score) => {
    if (!isTrackingEnabled || !sessionId) return;
    trackingService.trackQuizSubmit(sessionId, userId, window.location.pathname, quizId, score);
    localStorage.setItem('analytics_last_activity', Date.now().toString());
  };

  return {
    trackStart,
    trackSubmit
  };
};
