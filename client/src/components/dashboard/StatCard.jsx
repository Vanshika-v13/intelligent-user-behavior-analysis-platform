import React from 'react';
import Card from '../ui/Card';
import MetricBadge from '../ui/MetricBadge';
import clsx from 'clsx';

export default function StatCard({ title, value, change, trend = 'neutral', icon: Icon, withLeftBorder = false, className }) {
  return (
    <Card 
      className={clsx(
        "p-6 flex flex-col gap-4", 
        withLeftBorder && "border-l-4 border-l-[var(--color-primary)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[var(--color-muted-text)] text-sm font-medium mb-1">{title}</p>
          <h3 className="text-[var(--font-size-h3)] font-bold text-[var(--color-text)]">{value}</h3>
        </div>
        {Icon && (
          <div className="p-3 bg-gray-50 rounded-[var(--radius-md)] text-[var(--color-primary)]">
            <Icon size={24} />
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-2 mt-auto">
          <MetricBadge value={change} variant={trend} />
          <span className="text-xs text-[var(--color-muted-text)]">vs last period</span>
        </div>
      )}
    </Card>
  );
}
