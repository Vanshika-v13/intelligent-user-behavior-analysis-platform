import { useEffect } from 'react';
import { batchTracker } from '../../utils/batchTracker';
import { ENABLE_ANALYTICS } from '../../config/analytics';

export const AnalyticsInitializer = () => {
  useEffect(() => {
    if (!ENABLE_ANALYTICS) return;

    // Start the batch processing interval
    batchTracker.startInterval();

    // Optionally flush events before unload
    const handleUnload = () => {
      batchTracker.flushEvents();
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      batchTracker.stopInterval();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return null; // This component does not render anything
};

export default AnalyticsInitializer;
