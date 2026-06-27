import { useSessionTracking } from '../../hooks/useSessionTracking';

export const SessionTracker = () => {
  useSessionTracking();
  return null; // Logic only component
};

export default SessionTracker;
