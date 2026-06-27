import { useAnalyticsTracking } from '../contexts/AnalyticsContext';
import { trackingService } from '../services/trackingService';

export const useVideoTracking = () => {
  const { sessionId, userId, isTrackingEnabled } = useAnalyticsTracking();

  const trackPlay = (videoId) => {
    if (!isTrackingEnabled || !sessionId) return;
    trackingService.trackVideoPlay(sessionId, userId, window.location.pathname, videoId);
    localStorage.setItem('analytics_last_activity', Date.now().toString());
  };

  const trackPause = (videoId) => {
    if (!isTrackingEnabled || !sessionId) return;
    trackingService.trackVideoPause(sessionId, userId, window.location.pathname, videoId);
    localStorage.setItem('analytics_last_activity', Date.now().toString());
  };

  const trackComplete = (videoId) => {
    if (!isTrackingEnabled || !sessionId) return;
    trackingService.trackVideoComplete(sessionId, userId, window.location.pathname, videoId);
    localStorage.setItem('analytics_last_activity', Date.now().toString());
  };

  return {
    trackPlay,
    trackPause,
    trackComplete
  };
};
