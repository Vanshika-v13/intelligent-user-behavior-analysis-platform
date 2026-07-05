import React, { Suspense } from 'react';
import { useFunnelsAnalytics } from '../../../hooks/analytics/useFunnelsAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import { StatBadge } from '../shared/StatBadge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  commonXAxisProps, commonYAxisProps
} from '../charts/ChartPrimitives';


// Backend contract:
// GET /api/v2/analytics/funnels
// Returns: {
//   steps: [{ step, eventType, users, conversionRate, dropOffRate }],
//   exitPoints: [{ fromStep, toStep, dropOffRate, usersLost }],
//   overallConversionRate
// }
// NOTE: backend returns "step" field (not "name") for step label

const FUNNEL_COLORS = [
  'var(--color-primary, #3b82f6)',
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#ddd6fe',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-border/60 rounded-soft shadow-premium p-3 text-sm">
        <p className="font-semibold text-primary-text mb-1 text-xs">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted text-xs">Users:</span>
          <span className="font-semibold text-primary-text text-xs">{payload[0]?.value?.toLocaleString()}</span>
        </div>
        {payload[0]?.payload?.conversionRate != null && (
          <div className="text-xs text-success mt-1">
            {payload[0].payload.conversionRate}% conversion
          </div>
        )}
      </div>
    );
  }
  return null;
};

const FunnelsSummaryWidget = () => {
  const { data, isLoading, error, refetch } = useFunnelsAnalytics();

  // Backend returns: steps[{ step, users, conversionRate, dropOffRate }]
  // NOTE: field is "step" not "name"
  const funnelSteps = data?.steps || [];
  const overallConversionRate = data?.overallConversionRate ?? 0;
  const isEmpty = !isLoading && !error && funnelSteps.length === 0;

  // Format for recharts: need { step, users, conversionRate }
  const chartData = funnelSteps.map(s => ({
    step: s.step,        // backend field is "step"
    users: s.users || 0,
    conversionRate: s.conversionRate || 0,
    dropOffRate: s.dropOffRate || 0,
  }));

  return (
    <Card
      title={
        <WidgetHeader 
          title="Conversion Funnel" 
          badge={overallConversionRate > 0 ? <StatBadge value={`${overallConversionRate}%`} type="success" label="overall" /> : null}
        />
      }
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No funnel data to display."
      onRetry={refetch}
      className="h-full"
    >
      <div className="flex flex-col gap-5 pt-1">
        {/* Funnel Bar Chart */}
        <div className="w-full h-[200px]">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted/60 text-sm">Loading Chart...</div>}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis
                  dataKey="step"
                  {...commonXAxisProps}
                  dy={10}
                  tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: 500 }}
                />
                <YAxis
                  {...commonYAxisProps}
                  tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)', opacity: 0.08 }} />
                <Bar dataKey="users" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Suspense>
        </div>

        {/* Step Progress Bars */}
        <div className="flex flex-col gap-3">
          {funnelSteps.map((step, index) => {
            const percentage = step.conversionRate || 0;
            return (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  {/* FIX: backend field is "step", not "name" */}
                  <span className="font-medium text-primary-text">{step.step}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">{(step.users || 0).toLocaleString()} users</span>
                    <span className="text-primary font-semibold w-10 text-right">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-border/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default FunnelsSummaryWidget;
