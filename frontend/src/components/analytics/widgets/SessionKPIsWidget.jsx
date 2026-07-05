import React from 'react';
import { useSessionAnalytics } from '../../../hooks/analytics/useSessionAnalytics';
import { MetricCard } from '../cards/MetricCard';


const SessionKPIsWidget = () => {
  const { data, isLoading, error, refetch } = useSessionAnalytics();
  
  // Backend returns: { averageSessionDuration (seconds), bounceRate, activeUsers, sessionDistribution }
  const avgDuration = data?.averageSessionDuration != null
    ? `${Math.floor(data.averageSessionDuration / 60)}m ${data.averageSessionDuration % 60}s`
    : '0m 0s';
  const bounceRate = data?.bounceRate != null ? `${data.bounceRate}%` : '0%';
  const activeUsers = data?.activeUsers ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard 
        title="Avg Session Duration" 
        value={avgDuration} 
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
      <MetricCard 
        title="Active Users" 
        value={activeUsers} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
    </div>
  );
};

export default SessionKPIsWidget;
