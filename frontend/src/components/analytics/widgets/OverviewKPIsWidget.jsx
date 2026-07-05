import React from 'react';
import { useOverviewAnalytics } from '../../../hooks/analytics/useOverviewAnalytics';
import { MetricCard } from '../cards/MetricCard';

const OverviewKPIsWidget = () => {
  const { data, isLoading, error, refetch } = useOverviewAnalytics();

  // Backend returns: { totalUsers, totalSessions, totalEvents, averageSessionDuration, bounceRate, activeUsers }
  const totalUsers = data?.totalUsers ?? 0;
  const activeUsers = data?.activeUsers ?? 0;
  const avgSessionDuration = data?.averageSessionDuration != null
    ? `${Math.floor(data.averageSessionDuration / 60)}m ${data.averageSessionDuration % 60}s`
    : '0m 0s';
  const bounceRate = data?.bounceRate != null ? `${data.bounceRate}%` : '0%';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <MetricCard 
        title="Total Users" 
        value={totalUsers} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Active Users" 
        value={activeUsers} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Avg Session Duration" 
        value={avgSessionDuration} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Bounce Rate" 
        value={bounceRate}
        isPositive={false}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
    </div>
  );
};

export default OverviewKPIsWidget;
