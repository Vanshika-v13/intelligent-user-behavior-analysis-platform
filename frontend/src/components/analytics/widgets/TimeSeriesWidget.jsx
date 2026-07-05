import React, { Suspense } from 'react';
import { useTimeSeriesAnalytics } from '../../../hooks/analytics/useTimeSeriesAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ChartTooltip, commonXAxisProps, commonYAxisProps, commonGridProps
} from '../charts/ChartPrimitives';

// Backend contract:
// GET /api/v2/analytics/timeseries
// Returns: { interval, dailyEvents[{period,count}], dailySessions[{period,count}], dailyUsers[{period,count}], dailyPageViews[{period,count}], dailyQuizAttempts[{period,count}], dailyVideoPlays[{period,count}] }

/**
 * Merges two time-series arrays [{period, count}] into a unified chart array
 * keyed by `period`. Fills missing periods with 0.
 */
const mergeTimeSeries = (seriesA = [], seriesB = [], keyA = 'users', keyB = 'sessions', seriesC = [], keyC = 'events') => {
  const map = new Map();

  for (const { period, count } of seriesA) {
    map.set(period, { period, [keyA]: count, [keyB]: 0, [keyC]: 0 });
  }
  for (const { period, count } of seriesB) {
    const existing = map.get(period) || { period, [keyA]: 0, [keyB]: 0, [keyC]: 0 };
    map.set(period, { ...existing, [keyB]: count });
  }
  for (const { period, count } of seriesC) {
    const existing = map.get(period) || { period, [keyA]: 0, [keyB]: 0, [keyC]: 0 };
    map.set(period, { ...existing, [keyC]: count });
  }

  return [...map.values()].sort((a, b) => a.period.localeCompare(b.period));
};

const TimeSeriesWidget = () => {
  const { data, isLoading, error, refetch } = useTimeSeriesAnalytics();

  // Backend returns: dailyUsers[{period,count}], dailySessions[{period,count}], dailyEvents[{period,count}]
  const dailyUsers = data?.dailyUsers || [];
  const dailySessions = data?.dailySessions || [];
  const dailyEvents = data?.dailyEvents || [];

  const chartData = mergeTimeSeries(dailyUsers, dailySessions, 'users', 'sessions', dailyEvents, 'events');
  const isEmpty = !isLoading && !error && chartData.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Platform Activity Trend" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No time series data available for this period."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <div className="w-full h-[350px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted/60 text-sm">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tsColorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tsColorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary, #8b5cf6)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-secondary, #8b5cf6)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tsColorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent, #10b981)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--color-accent, #10b981)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid {...commonGridProps} />
              <XAxis
                dataKey="period"
                {...commonXAxisProps}
                tickFormatter={(v) => v?.slice(5) || v}
              />
              <YAxis {...commonYAxisProps} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }} />
              <Area
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="var(--color-primary, #3b82f6)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tsColorUsers)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-surface)' }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="var(--color-secondary, #8b5cf6)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tsColorSessions)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-surface)' }}
                isAnimationActive={true}
                animationDuration={1400}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="events"
                name="Events"
                stroke="var(--color-accent, #10b981)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tsColorEvents)"
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--color-surface)' }}
                isAnimationActive={true}
                animationDuration={1600}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
    </Card>
  );
};

export default TimeSeriesWidget;
