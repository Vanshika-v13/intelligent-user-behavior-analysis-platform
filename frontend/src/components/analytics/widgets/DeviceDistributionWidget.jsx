import React, { Suspense } from 'react';
import { useDeviceAnalytics } from '../../../hooks/analytics/useDeviceAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from '../charts/ChartPrimitives';

// Backend contract:
// GET /api/v2/analytics/devices
// Returns: { byDeviceCategory[{category, count}], byOperatingSystem[{name, count}], byBrowser[{name, count}], ... }


const COLORS = [
  'var(--color-primary, #3b82f6)',
  'var(--color-secondary, #8b5cf6)',
  'var(--color-accent, #10b981)',
  '#f59e0b',
  '#ef4444',
];

const DeviceDistributionWidget = () => {
  const { data, isLoading, error, refetch } = useDeviceAnalytics();

  // Backend returns byDeviceCategory: [{ category: 'Desktop', count: 120 }, ...]
  // Recharts Pie needs: [{ name: string, value: number }]
  const pieData = (data?.byDeviceCategory || []).map(d => ({
    name: d.category,
    value: d.count || 0,
  }));

  const isEmpty = !isLoading && !error && pieData.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Device Family" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No device data available."
      onRetry={refetch}
      className="h-[350px]"
    >
      <div className="w-full h-[280px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-text text-sm">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
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
                formatter={(value, name) => [value.toLocaleString() + ' sessions', name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
    </Card>
  );
};

export default DeviceDistributionWidget;
