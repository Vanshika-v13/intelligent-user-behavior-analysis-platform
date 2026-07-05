import React, { lazy } from 'react';

// Lazy load Recharts components centrally
export const AreaChart = lazy(() => import('recharts').then(m => ({ default: m.AreaChart })));
export const Area = lazy(() => import('recharts').then(m => ({ default: m.Area })));
export const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
export const Bar = lazy(() => import('recharts').then(m => ({ default: m.Bar })));
export const LineChart = lazy(() => import('recharts').then(m => ({ default: m.LineChart })));
export const Line = lazy(() => import('recharts').then(m => ({ default: m.Line })));
export const PieChart = lazy(() => import('recharts').then(m => ({ default: m.PieChart })));
export const Pie = lazy(() => import('recharts').then(m => ({ default: m.Pie })));
export const Cell = lazy(() => import('recharts').then(m => ({ default: m.Cell })));
export const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
export const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
export const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
export const Tooltip = lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
export const Legend = lazy(() => import('recharts').then(m => ({ default: m.Legend })));
export const ResponsiveContainer = lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));

// Reusable Custom Tooltip for consistent styling across all charts
export const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-border/60 rounded-soft shadow-premium p-3 text-sm">
        {label && <p className="font-semibold text-primary-text mb-2 text-xs">{label}</p>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload?.fill || 'var(--color-primary)' }} />
            <span className="text-muted text-xs">{entry.name}:</span>
            <span className="font-semibold text-primary-text text-xs">{entry.value?.toLocaleString() || 0}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Reusable standard chart axis props to reduce boilerplate
export const commonXAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: 'var(--color-muted)', fontSize: 11, fontWeight: 500 },
  dy: 15,
  minTickGap: 30,
};

export const commonYAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: 'var(--color-muted)', fontSize: 11, fontWeight: 500 },
  dx: -10,
};

export const commonGridProps = {
  strokeDasharray: "4 4",
  vertical: false,
  stroke: "var(--color-border)",
  strokeOpacity: 0.5,
};
