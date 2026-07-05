import React from 'react';
import { useUserAnalytics } from '../../../hooks/analytics/useUserAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

const GeoDistributionWidget = () => {
  const { data, isLoading, error, refetch } = useUserAnalytics();

  // FIX: Backend has no 'geoDistribution' data. 
  // Repurposed widget to show Inactive Users (which IS provided by useUserAnalytics)
  // to maintain UI layout and display real backend data.
  const inactiveUsers = data?.inactiveUsers || [];
  
  const isEmpty = !isLoading && !error && inactiveUsers.length === 0;

  return (
    <Card 
      title={
        <span className="flex items-center justify-between w-full">
          <span>Inactive Users</span>
          {inactiveUsers.length > 0 && (
            <span className="text-xs font-normal text-warning bg-warning/10 px-2 py-0.5 rounded-full">
              {inactiveUsers.length} total
            </span>
          )}
        </span>
      }
      loading={isLoading} 
      error={error} 
      empty={isEmpty}
      emptyMessage="No inactive users found. Great retention!"
      onRetry={refetch}
      className="h-full"
    >
      <div className="w-full h-full text-muted-text min-h-[300px]">
        {inactiveUsers.length > 0 && (
          <div className="w-full max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
             <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-border text-xs text-muted">
                  <th className="py-2 px-3 font-semibold">User ID</th>
                  <th className="py-2 px-3 font-semibold">Name</th>
                  <th className="py-2 px-3 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {inactiveUsers.slice(0, 50).map((user, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/5 transition-colors text-sm">
                    <td className="py-3 px-3 font-medium text-primary-text font-mono text-xs">{user.userId || 'Unknown'}</td>
                    <td className="py-3 px-3 text-muted-text">{user.name || '—'}</td>
                    <td className="py-3 px-3 text-muted-text truncate max-w-[120px]" title={user.email}>{user.email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GeoDistributionWidget;
