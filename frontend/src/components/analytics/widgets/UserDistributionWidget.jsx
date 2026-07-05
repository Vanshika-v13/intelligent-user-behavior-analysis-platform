import React, { Suspense } from 'react';
import { useUserAnalytics } from '../../../hooks/analytics/useUserAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ChartTooltip
} from '../charts/ChartPrimitives';

// Backend contract:
// GET /api/v2/analytics/users
// Returns: {
//   mostActiveUsers: [{ userId, eventCount }],
//   inactiveUsers: [{ userId, name, email }],
//   averageSessionCount, averageEvents, averageEngagement,
//   returningUsers, firstTimeUsers
// }
//
// FIX: Old widget used data?.countryDistribution — no such field exists in backend.
// Correct source: data?.mostActiveUsers[{userId, eventCount}]


const COLORS = [
  'var(--color-primary, #3b82f6)',
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#818cf8',
  '#60a5fa',
  '#34d399',
  '#fb923c',
  '#f472b6',
];

// Using default ChartTooltip instead of CustomTooltip

const UserDistributionWidget = () => {
  const { data, isLoading, error, refetch } = useUserAnalytics();

  // FIX: Backend returns mostActiveUsers[{userId, eventCount}], not countryDistribution
  const rawUsers = data?.mostActiveUsers || [];

  // Truncate userId for display (show last 6 chars)
  const chartData = rawUsers.slice(0, 10).map((u, idx) => ({
    userId: u.userId ? `User #${idx + 1}` : 'Unknown',
    fullId: u.userId || 'unknown',
    events: u.eventCount || 0,
  }));

  const isEmpty = !isLoading && !error && chartData.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Most Active Users" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No user activity data available for this period."
      onRetry={refetch}
      className="min-h-[350px]"
    >
      <div className="w-full h-[300px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 100) / 10}k` : v}
              />
              <YAxis
                type="category"
                dataKey="userId"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-primary-text)', fontSize: 11 }}
                width={55}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-muted)', opacity: 0.08 }} />
              <Bar dataKey="events" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={true} animationDuration={1000}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
      <p className="text-xs text-muted mt-2">Top 10 users by total event count in selected period.</p>
    </Card>
  );
};

export default UserDistributionWidget;
