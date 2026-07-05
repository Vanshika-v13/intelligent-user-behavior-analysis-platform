import React, { Suspense } from 'react';
import { useSessionAnalytics } from '../../../hooks/analytics/useSessionAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  commonXAxisProps, commonYAxisProps, commonGridProps
} from '../charts/ChartPrimitives';

// Custom Tooltip for Premium SaaS Look
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-border/60 rounded-soft shadow-premium p-3 text-sm">
        <p className="font-medium text-primary-text mb-2 text-xs">{label} Duration</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted">Users:</span>
          <span className="font-semibold text-primary-text">{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

const SessionDurationHistogramWidget = () => {
  const { data, isLoading, error, refetch } = useSessionAnalytics();

  // Backend returns: { sessionDistribution: [{bucket, count}], ... }
  const chartData = data?.sessionDistribution || [];
  const isEmpty = !isLoading && !error && chartData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Session Duration Distribution" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty} 
      emptyMessage="No session duration data available."
      onRetry={refetch}
      className="min-h-[350px] lg:col-span-2"
    >
      <div className="w-full h-[300px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted/60">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid {...commonGridProps} />
              <XAxis 
                dataKey="bucket" 
                {...commonXAxisProps}
              />
              <YAxis 
                {...commonYAxisProps}
              />
              <Tooltip 
                cursor={{ fill: 'var(--color-muted)', opacity: 0.1 }}
                content={<CustomTooltip />}
              />
              <Bar 
                dataKey="count" 
                fill="var(--color-primary, #3b82f6)" 
                radius={[6, 6, 0, 0]} 
                barSize={45}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
    </Card>
  );
};

export default SessionDurationHistogramWidget;
