import React, { Suspense } from 'react';
import { useTimeSeriesAnalytics } from '../../../hooks/analytics/useTimeSeriesAnalytics';
import { useUserAnalytics } from '../../../hooks/analytics/useUserAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ChartTooltip, commonXAxisProps, commonYAxisProps, commonGridProps
} from '../charts/ChartPrimitives';

// Backend contract:
// GET /api/v2/analytics/timeseries
// Returns: { dailyUsers[{period, count}], dailySessions[{period, count}], ... }
//
// GET /api/v2/analytics/users
// Returns: { returningUsers, firstTimeUsers, ... }
//
// FIX: Old widget used data?.trend which doesn't exist in backend.
// Correct source is useTimeSeriesAnalytics → dailyUsers[{period, count}]


const UserGrowthTrendWidget = () => {
  // Correct data source: useTimeSeriesAnalytics for trend chart
  const { data: tsData, isLoading: tsLoading, error: tsError, refetch } = useTimeSeriesAnalytics();
  const { data: userData } = useUserAnalytics();

  // dailyUsers: [{period, count}] — distinct active users per period
  const dailyUsers = tsData?.dailyUsers || [];

  // For "returning" vs "new" split, we only have the aggregate totals from user analytics
  // We'll show active users trend from timeseries + annotate with returning/firstTime from user analytics
  const chartData = dailyUsers.map(d => ({
    period: d.period,
    users: d.count || 0,
  }));

  // Summary stats from user analytics
  const returningUsers = userData?.returningUsers ?? 0;
  const firstTimeUsers = userData?.firstTimeUsers ?? 0;

  const isLoading = tsLoading;
  const error = tsError;
  const isEmpty = !isLoading && !error && chartData.length === 0;

  return (
    <Card
      title={
        <span className="flex items-center justify-between w-full">
          <span>Active User Trend</span>
          {(returningUsers > 0 || firstTimeUsers > 0) && (
            <span className="flex items-center gap-3 text-xs font-normal">
              <span className="text-success">{returningUsers} returning</span>
              <span className="text-primary">{firstTimeUsers} new</span>
            </span>
          )}
        </span>
      }
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No user trend data available for this period."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <div className="w-full h-[320px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ugColorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0}/>
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
              <Area
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="var(--color-primary, #3b82f6)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#ugColorUsers)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-surface)' }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
    </Card>
  );
};

export default UserGrowthTrendWidget;
