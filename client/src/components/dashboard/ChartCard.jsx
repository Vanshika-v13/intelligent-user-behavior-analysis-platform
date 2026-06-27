import React from 'react';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import clsx from 'clsx';
import { BarChart2 } from 'lucide-react';

export default function ChartCard({ title, subtitle, children, className, actions, isLoading, isEmpty }) {
  return (
    <Card className={clsx("p-6 flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
          {subtitle && <p className="text-sm text-[var(--color-muted-text)]">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[300px] flex flex-col">
        {isLoading ? (
          <LoadingSkeleton type="chart" />
        ) : isEmpty ? (
          <EmptyState 
            icon={BarChart2} 
            title="No data available" 
            description="There is no data to display for the selected period." 
          />
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
