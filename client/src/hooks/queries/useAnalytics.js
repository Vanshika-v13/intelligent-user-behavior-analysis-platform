import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics/analyticsService';
import { QUERY_KEYS } from '../../constants/queryKeys';

export function useOverviewAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.OVERVIEW],
    queryFn: analyticsService.getOverview,
  });
}

export function useSessionAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.SESSIONS],
    queryFn: analyticsService.getSessionsAnalytics,
  });
}

export function useEventAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.EVENTS],
    queryFn: analyticsService.getEventsAnalytics,
  });
}

export function useJourneyAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.JOURNEYS],
    queryFn: analyticsService.getJourneysAnalytics,
  });
}

export function useEngagementAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.ENGAGEMENT],
    queryFn: analyticsService.getEngagementAnalytics,
  });
}
