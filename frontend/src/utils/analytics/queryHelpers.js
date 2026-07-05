/**
 * Converts the analytics context filters into a query string for API requests.
 */
export const buildAnalyticsQuery = (filters) => {
  const params = new URLSearchParams();

  if (filters.dateRange?.start) {
    params.append('startDate', filters.dateRange.start);
  }
  if (filters.dateRange?.end) {
    params.append('endDate', filters.dateRange.end);
  }
  if (filters.courseFilter && filters.courseFilter !== 'all') {
    params.append('courseId', filters.courseFilter);
  }
  if (filters.deviceFilter && filters.deviceFilter !== 'all') {
    params.append('device', filters.deviceFilter);
  }
  if (filters.browserFilter && filters.browserFilter !== 'all') {
    params.append('browser', filters.browserFilter);
  }
  if (filters.interval && filters.interval !== 'day') {
    params.append('interval', filters.interval);
  }
  if (filters.engagementLevel && filters.engagementLevel !== 'all') {
    params.append('engagement', filters.engagementLevel);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};
