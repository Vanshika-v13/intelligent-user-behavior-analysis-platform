import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalyticsTracking } from '../contexts/AnalyticsContext';
import { trackingService } from '../services/trackingService';

export const usePageTracking = () => {
  const location = useLocation();
  const { sessionId, userId, isTrackingEnabled } = useAnalyticsTracking();
  const prevPageRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!isTrackingEnabled || !sessionId) return;

    const currentPage = location.pathname;
    
    // Only track if page changed or first load
    if (prevPageRef.current !== currentPage) {
      const duration = prevPageRef.current ? Date.now() - startTimeRef.current : 0;
      trackingService.trackPageView(sessionId, userId, currentPage, prevPageRef.current, duration);
      prevPageRef.current = currentPage;
      startTimeRef.current = Date.now();
    }
    
    // Update last activity for session timeout logic
    localStorage.setItem('analytics_last_activity', Date.now().toString());

  }, [location.pathname, sessionId, userId, isTrackingEnabled]);
};
