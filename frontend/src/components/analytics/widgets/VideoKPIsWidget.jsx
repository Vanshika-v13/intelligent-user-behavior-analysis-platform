import React from 'react';
import { useVideoAnalytics } from '../../../hooks/analytics/useVideoAnalytics';
import { MetricCard } from '../cards/MetricCard';


const VideoKPIsWidget = () => {
  const { data, isLoading, error, refetch } = useVideoAnalytics();
  
  // Backend returns: { videoStarts, videoCompletes, completionRate, averageWatchTime, dropOffRate, byVideo }
  const videoStarts = data?.videoStarts ?? 0;
  const completionRate = data?.completionRate != null ? `${data.completionRate}%` : '0%';
  const avgWatchTime = data?.averageWatchTime != null ? `${data.averageWatchTime}s` : '0s';
  const dropOffRate = data?.dropOffRate != null ? `${data.dropOffRate}%` : '0%';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Total Video Starts" 
        value={videoStarts} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Avg Watch Time" 
        value={avgWatchTime} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Completion Rate" 
        value={completionRate} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Drop-off Rate" 
        value={dropOffRate}
        isPositive={false}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
    </div>
  );
};

export default VideoKPIsWidget;
