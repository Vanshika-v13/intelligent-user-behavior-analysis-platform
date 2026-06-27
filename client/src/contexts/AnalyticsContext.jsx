import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trackingService } from '../services/trackingService';
import { ENABLE_ANALYTICS } from '../config/analytics';

const AnalyticsContext = createContext();

export const useAnalyticsTracking = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('analytics_session_id'));
  const [userId, setUserId] = useState(() => localStorage.getItem('analytics_user_id') || 'anonymous_user');
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(ENABLE_ANALYTICS);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSessionId = useCallback((newId) => {
    setSessionId(newId);
    if (newId) {
      localStorage.setItem('analytics_session_id', newId);
    } else {
      localStorage.removeItem('analytics_session_id');
    }
  }, []);

  const value = {
    sessionId,
    userId,
    isTrackingEnabled,
    isOnline,
    updateSessionId,
    setUserId,
    setIsTrackingEnabled
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
