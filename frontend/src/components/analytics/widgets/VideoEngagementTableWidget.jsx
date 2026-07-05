import React from 'react';
import { useVideoAnalytics } from '../../../hooks/analytics/useVideoAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import { TableContainer, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../tables/AnalyticsTable';

const VideoEngagementTableWidget = () => {
  const { data, isLoading, error, refetch } = useVideoAnalytics();
  
  // Backend returns byVideo: [{videoId, starts, completes, completionRate, averageWatchTime, dropOffRate}]
  const tableData = data?.byVideo || [];

  const isEmpty = !isLoading && !error && tableData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Detailed Video Engagement" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty}
      emptyMessage="No detailed video data available for this period."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <TableContainer>
        <TableHeader>
          <TableHead className="w-1/3">Video Title</TableHead>
          <TableHead align="right">Views</TableHead>
          <TableHead align="right">Avg Watch Time</TableHead>
          <TableHead align="right">Completion %</TableHead>
          <TableHead align="right">Drop-off Point</TableHead>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-primary-text">{row.videoId || 'Unknown Video'}</TableCell>
              <TableCell align="right" className="text-muted-text">{row.starts?.toLocaleString() || 0}</TableCell>
              <TableCell align="right" className="text-muted-text">{row.averageWatchTime != null ? `${row.averageWatchTime}s` : '0s'}</TableCell>
              <TableCell align="right" className="text-muted-text">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${row.completionRate || 0}%` }}></div>
                  </div>
                  <span>{row.completionRate != null ? `${row.completionRate}%` : '0%'}</span>
                </div>
              </TableCell>
              <TableCell align="right" className="text-muted-text">{row.dropOffRate != null ? `${row.dropOffRate}%` : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </Card>
  );
};

export default VideoEngagementTableWidget;
