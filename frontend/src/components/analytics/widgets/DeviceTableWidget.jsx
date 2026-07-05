import React from 'react';
import { useDeviceAnalytics } from '../../../hooks/analytics/useDeviceAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import { TableContainer, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../tables/AnalyticsTable';

// Backend contract:
// GET /api/v2/analytics/devices
// Returns: {
//   byDeviceCategory[{category, count}],
//   byOperatingSystem[{name, count}],
//   byBrowser[{name, count}],
//   byScreenResolution[{name, count}],
// }
// NOTE: The backend does NOT return per-device sessions, avgDuration, or bounceRate.
// The table is built from byDeviceCategory which has category + count only.

const DeviceTableWidget = () => {
  const { data, isLoading, error, refetch } = useDeviceAnalytics();

  // Combine device categories with counts
  const rawCategories = data?.byDeviceCategory || [];
  const totalSessions = rawCategories.reduce((sum, d) => sum + (d.count || 0), 0);

  const tableData = rawCategories.map(d => ({
    device: d.category || 'Unknown',
    sessions: d.count || 0,
    share: totalSessions > 0 ? Math.round((d.count / totalSessions) * 1000) / 10 : 0,
  }));

  const isEmpty = !isLoading && !error && tableData.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Device Analytics Summary" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No device data available."
      onRetry={refetch}
      className="min-h-[300px]"
    >
      <div className="w-full">
        <TableContainer>
          <TableHeader>
            <TableHead className="w-1/3">Device Category</TableHead>
            <TableHead align="right">Sessions</TableHead>
            <TableHead align="right">Share</TableHead>
            <TableHead>Distribution</TableHead>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-primary-text">{row.device}</TableCell>
                <TableCell align="right" className="text-muted">{row.sessions.toLocaleString()}</TableCell>
                <TableCell align="right" className="text-primary-text font-semibold">{row.share}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-700"
                        style={{ width: `${row.share}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        {/* Backend limitation note: per-device avgDuration and bounceRate are not available from /api/v2/analytics/devices */}
        <p className="text-xs text-muted/60 mt-3 px-4 pb-4">Sessions grouped by device category.</p>
      </div>
    </Card>
  );
};

export default DeviceTableWidget;
