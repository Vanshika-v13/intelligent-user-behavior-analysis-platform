import { useQuery } from '@tanstack/react-query';
import { sharedQueryOptions } from './sharedQueryOptions';
import { useAnalyticsFilter, buildBackendParams } from '../../context/analytics/AnalyticsFilterContext';
import analyticsV1Service from '../../services/analytics/analyticsV1Service';

export const useSessionAnalytics = (options = {}) => {
  const { dateRange, timeInterval, courseFilter, globalRefreshTrigger } = useAnalyticsFilter();

  const queryKey = ['analytics', 'sessions', { dateRange, timeInterval, courseFilter, globalRefreshTrigger }];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const params = buildBackendParams({ dateRange, timeInterval, courseFilter });
      return analyticsV1Service.getSessionsAnalytics(params, { signal });
    },
    ...sharedQueryOptions,
    ...options,
  });

  return {
    data: query.data?.data,
    isLoading: query.isLoading || query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
