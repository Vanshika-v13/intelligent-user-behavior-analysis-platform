import { usePageTracking } from '../../hooks/usePageTracking';

export const PageTracker = () => {
  usePageTracking();
  return null; // This component is logic only
};

export default PageTracker;
