import React from 'react';
import { BarChart3 } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export function EmptyAnalyticsState({ 
  title = "No analytics data available",
  description = "There is no data to display for the selected date range or filters."
}) {
  return (
    <div className="py-12 flex justify-center w-full">
      <EmptyState
        icon={BarChart3}
        title={title}
        description={description}
      />
    </div>
  );
}
