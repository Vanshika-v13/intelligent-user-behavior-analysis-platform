import React, { Suspense } from 'react';
import { useEngagementAnalytics } from '../../../hooks/analytics/useEngagementAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from '../charts/ChartPrimitives';

// Backend contract:
// GET /api/analytics/engagement
// Returns: {
//   engagementScores: [{ userId, engagementScore }],
//   engagementLevels: [{ userId, level }]
// }
//
// FIX: Old widget used data?.heatmap (doesn't exist).
// Rebuilt to show Engagement Distribution (High/Medium/Low) using engagementLevels.


const ActivityHeatmapWidget = () => {
  const { data, isLoading, error, refetch } = useEngagementAnalytics();

  const levels = data?.engagementLevels || [];
  
  const highEngagement = levels.filter(l => l.level === 'High').length;
  const mediumEngagement = levels.filter(l => l.level === 'Medium').length;
  const lowEngagement = levels.filter(l => l.level === 'Low').length;

  const pieData = [
    { name: 'High Engagement', value: highEngagement, color: 'var(--color-success, #10b981)' },
    { name: 'Medium Engagement', value: mediumEngagement, color: 'var(--color-warning, #f59e0b)' },
    { name: 'Low Engagement', value: lowEngagement, color: 'var(--color-error, #ef4444)' },
  ].filter(d => d.value > 0);

  const isEmpty = !isLoading && !error && pieData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Engagement Distribution" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty}
      emptyMessage="No engagement data available for this period."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <div className="w-full h-[320px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-text text-sm">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
                formatter={(value, name) => [`${value} Users`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
      <p className="text-xs text-center text-muted mt-2">Breakdown of users by their overall engagement health.</p>
    </Card>
  );
};

export default ActivityHeatmapWidget;
