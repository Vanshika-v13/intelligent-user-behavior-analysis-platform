import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [courseFilter, setCourseFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [browserFilter, setBrowserFilter] = useState('all');
  const [interval, setInterval] = useState('day'); // hour, day, week, month
  const [engagementLevel, setEngagementLevel] = useState('all');

  const updateDateRange = useCallback((start, end) => setDateRange({ start, end }), []);
  const resetFilters = useCallback(() => {
    setDateRange({ start: null, end: null });
    setCourseFilter('all');
    setDeviceFilter('all');
    setBrowserFilter('all');
    setInterval('day');
    setEngagementLevel('all');
  }, []);

  const value = useMemo(() => ({
    filters: {
      dateRange,
      courseFilter,
      deviceFilter,
      browserFilter,
      interval,
      engagementLevel,
    },
    actions: {
      setDateRange: updateDateRange,
      setCourseFilter,
      setDeviceFilter,
      setBrowserFilter,
      setInterval,
      setEngagementLevel,
      resetFilters,
    }
  }), [dateRange, courseFilter, deviceFilter, browserFilter, interval, engagementLevel, updateDateRange, resetFilters]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
