import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from '../../context/analytics/AnalyticsContext';

/**
 * A base hook for fetching analytics data with standard loading/error state.
 * @param {Function} fetchFn - The service method to call (e.g., analyticsV1Service.getOverview)
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const useAnalyticsData = (fetchFn) => {
  const { filters } = useAnalytics();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn(filters);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
