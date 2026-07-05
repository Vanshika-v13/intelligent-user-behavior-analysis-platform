import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const AnalyticsFilterContext = createContext();

/**
 * Converts the dashboard's date range shorthand into ISO startDate/endDate strings.
 * Backend expects: startDate (ISO), endDate (ISO)
 */
export const resolveDateRange = (dateRange) => {
  const now = new Date();
  const end = now.toISOString();

  switch (dateRange) {
    case '7D': {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      return { startDate: start.toISOString(), endDate: end };
    }
    case '30D': {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      return { startDate: start.toISOString(), endDate: end };
    }
    case '90D': {
      const start = new Date(now);
      start.setDate(start.getDate() - 90);
      return { startDate: start.toISOString(), endDate: end };
    }
    case '1Y': {
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      return { startDate: start.toISOString(), endDate: end };
    }
    case 'YTD': {
      const start = new Date(now.getFullYear(), 0, 1).toISOString();
      return { startDate: start, endDate: end };
    }
    default:
      return {}; // no date filter = all time
  }
};

/**
 * Converts interval shorthand to backend-accepted values.
 * Backend expects: 'daily' | 'weekly' | 'monthly'
 */
const resolveInterval = (timeInterval) => {
  // Backend supports: 'daily' | 'weekly' | 'monthly'
  const map = { day: 'daily', week: 'weekly', month: 'monthly' };
  return map[timeInterval] || 'daily';
};

/**
 * Builds the flat query param object expected by the backend analytics endpoints.
 * Only includes params the backend actually accepts.
 */
export const buildBackendParams = (filters) => {
  const { dateRange, timeInterval, courseFilter } = filters;
  const dateParams = resolveDateRange(dateRange);
  const interval = resolveInterval(timeInterval);

  const params = { interval, ...dateParams };

  // courseFilter: 'all' means no filter; otherwise it's a courseId
  if (courseFilter && courseFilter !== 'all') {
    params.courseId = courseFilter;
  }

  return params;
};

export const AnalyticsFilterProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState('30D'); // 7D, 30D, 90D, 1Y
  const [timeInterval, setTimeInterval] = useState('day'); // day, week, month
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all'); // 'all' | courseId string

  // Global states
  const [globalLoadingState, setGlobalLoadingState] = useState(false);
  const [globalRefreshTrigger, setGlobalRefreshTrigger] = useState(0);

  const triggerGlobalRefresh = useCallback(() => {
    setGlobalRefreshTrigger(prev => prev + 1);
  }, []);

  const value = useMemo(() => ({
    dateRange,
    timeInterval,
    segmentFilter,
    courseFilter,
    globalLoadingState,
    globalRefreshTrigger,
    actions: {
      setDateRange,
      setTimeInterval,
      setSegmentFilter,
      setCourseFilter,
      setGlobalLoadingState,
      triggerGlobalRefresh,
    },
  }), [
    dateRange,
    timeInterval,
    segmentFilter,
    courseFilter,
    globalLoadingState,
    globalRefreshTrigger,
    triggerGlobalRefresh,
  ]);

  return (
    <AnalyticsFilterContext.Provider value={value}>
      {children}
    </AnalyticsFilterContext.Provider>
  );
};

export const useAnalyticsFilter = () => {
  const context = useContext(AnalyticsFilterContext);
  if (!context) {
    throw new Error('useAnalyticsFilter must be used within an AnalyticsFilterProvider');
  }
  return context;
};
