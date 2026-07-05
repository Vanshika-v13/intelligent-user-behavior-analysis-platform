import { useQuery } from '@tanstack/react-query';
import { sharedQueryOptions } from './sharedQueryOptions';
import { useAnalyticsFilter, buildBackendParams } from '../../context/analytics/AnalyticsFilterContext';
import analyticsV2Service from '../../services/analytics/analyticsV2Service';

export const useFunnelsAnalytics = (options = {}) => {
  const { dateRange, timeInterval, courseFilter, globalRefreshTrigger } = useAnalyticsFilter();

  const queryKey = ['analytics', 'funnels', { dateRange, timeInterval, courseFilter, globalRefreshTrigger }];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const params = buildBackendParams({ dateRange, timeInterval, courseFilter });
      return analyticsV2Service.getFunnels(params, { signal });
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
