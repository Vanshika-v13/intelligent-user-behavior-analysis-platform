import { useEffect } from 'react';
import { useAnalyticsTracking } from '../../contexts/AnalyticsContext';
import { trackingService } from '../../services/trackingService';

const IDLE_CHECK_INTERVAL = 60 * 1000; // Check every minute
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const IdleTracker = () => {
  const { sessionId, updateSessionId, isTrackingEnabled } = useAnalyticsTracking();

  useEffect(() => {
    if (!isTrackingEnabled || !sessionId) return;

    const intervalId = setInterval(() => {
      const lastActivityStr = localStorage.getItem('analytics_last_activity');
      if (!lastActivityStr) return;

      const lastActivity = parseInt(lastActivityStr, 10);
      const now = Date.now();

      if (now - lastActivity > SESSION_TIMEOUT_MS) {
        // Session has expired due to inactivity
        trackingService.endSession(sessionId);
        updateSessionId(null);
        localStorage.removeItem('analytics_last_activity');
      }
    }, IDLE_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [sessionId, updateSessionId, isTrackingEnabled]);

  return null;
};

export default IdleTracker;
