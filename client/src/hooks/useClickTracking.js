import { useEffect } from 'react';
import { useAnalyticsTracking } from '../contexts/AnalyticsContext';
import { trackingService } from '../services/trackingService';

export const useClickTracking = () => {
  const { sessionId, userId, isTrackingEnabled } = useAnalyticsTracking();

  useEffect(() => {
    if (!isTrackingEnabled || !sessionId) return;

    const handleClick = (e) => {
      // Find the closest clickable element up the tree
      const target = e.target.closest('button, a, [role="button"], .card, [data-trackable="true"]');
      
      if (!target) return;
      
      // Do not track elements containing sensitive info
      const type = target.type ? target.type.toLowerCase() : '';
      if (type === 'password' || type === 'email' || target.hasAttribute('data-no-track')) return;

      const elementId = target.id || target.getAttribute('data-id') || null;
      let elementText = target.innerText || target.getAttribute('aria-label') || target.value || null;
      
      // limit text length to avoid huge payloads
      if (elementText) {
          elementText = elementText.substring(0, 100).trim();
      }
      
      const elementType = target.tagName.toLowerCase();

      trackingService.trackClick(
        sessionId,
        userId,
        window.location.pathname,
        elementId,
        elementText,
        elementType
      );
      
      // Update last activity for session timeout logic
      localStorage.setItem('analytics_last_activity', Date.now().toString());
    };

    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [sessionId, userId, isTrackingEnabled]);
};
