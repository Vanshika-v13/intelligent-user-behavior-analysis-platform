import React from 'react';
import { useUserAnalytics } from '../../../hooks/analytics/useUserAnalytics';
import { MetricCard } from '../cards/MetricCard';

const UserKPIsWidget = () => {
  const { data, isLoading, error, refetch } = useUserAnalytics();
  
  // Backend returns: { mostActiveUsers, inactiveUsers, averageSessionCount, averageEvents, averageEngagement, returningUsers, firstTimeUsers }
  const metrics = data || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Returning Users" 
        value={metrics.returningUsers ?? 0} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="First-Time Users" 
        value={metrics.firstTimeUsers ?? 0} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Avg Events / User" 
        value={metrics.averageEvents ?? 0} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Avg Engagement Score" 
        value={`${metrics.averageEngagement ?? 0}%`} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
    </div>
  );
};

export default UserKPIsWidget;
