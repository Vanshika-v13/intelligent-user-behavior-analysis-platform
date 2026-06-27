import { useEffect, useRef } from 'react';
import { useAnalyticsTracking } from '../contexts/AnalyticsContext';
import { trackingService } from '../services/trackingService';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const useSessionTracking = () => {
  const { sessionId, updateSessionId, userId, isTrackingEnabled } = useAnalyticsTracking();
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!isTrackingEnabled) return;

    const initializeSession = async () => {
      if (isInitializing.current) return;
      isInitializing.current = true;

      let currentSessionId = localStorage.getItem('analytics_session_id');
      const lastActivityStr = localStorage.getItem('analytics_last_activity');
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : 0;
      const now = Date.now();

      // Check if session expired
      if (currentSessionId && (now - lastActivity > SESSION_TIMEOUT_MS)) {
        await trackingService.endSession(currentSessionId);
        currentSessionId = null;
      }

      if (!currentSessionId) {
        currentSessionId = await trackingService.startSession(userId);
        if (currentSessionId) {
          updateSessionId(currentSessionId);
          localStorage.setItem('analytics_session_start_time', now.toString());
        }
      } else {
        updateSessionId(currentSessionId);
      }
      
      localStorage.setItem('analytics_last_activity', now.toString());
      isInitializing.current = false;
    };

    initializeSession();

    const handleUnload = () => {
      const currentSessionId = localStorage.getItem('analytics_session_id');
      if (currentSessionId) {
        // Send a synchronous beacon or an end session call
        // we'll rely on the backend tracking session ends based on activity timeouts too
        // but we'll try to end it explicitly if we can
        trackingService.endSession(currentSessionId);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const currentSessionId = localStorage.getItem('analytics_session_id');
        if (currentSessionId) {
            // Can't reliably async await here, just fire off the request
            trackingService.endSession(currentSessionId);
        }
      } else if (document.visibilityState === 'visible') {
        // re-initialize or extend session on visibility change
        initializeSession();
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateSessionId, userId, isTrackingEnabled]);
};
