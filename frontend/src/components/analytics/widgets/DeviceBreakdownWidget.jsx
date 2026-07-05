import React from 'react';
import { useDeviceAnalytics } from '../../../hooks/analytics/useDeviceAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

// Backend contract:
// GET /api/v2/analytics/devices
// Returns: { byDeviceCategory[{category, count}], byOperatingSystem[{name, count}], byBrowser[{name, count}], ... }

const DeviceBreakdownWidget = () => {
  const { data, isLoading, error, refetch } = useDeviceAnalytics();

  // Backend returns byDeviceCategory: [{ category: 'Desktop', count: 120 }, ...]
  const rawCategories = data?.byDeviceCategory || [];

  const total = rawCategories.reduce((sum, d) => sum + (d.count || 0), 0);

  const devices = rawCategories.map(d => ({
    name: d.category,
    count: d.count || 0,
    percentage: total > 0 ? Math.round((d.count / total) * 1000) / 10 : 0,
  }));

  const isEmpty = !isLoading && !error && devices.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Device Breakdown" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No device data to display."
      onRetry={refetch}
      className="h-full"
    >
      <div className="flex flex-col gap-4 pt-1">
        {devices.map((device, index) => (
          <div key={index} className="flex flex-col gap-1.5 group cursor-default">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2.5">
                <span className="font-medium text-primary-text group-hover:text-primary transition-colors">{device.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted font-medium">{device.count.toLocaleString()} sessions</span>
                <span className="text-primary-text font-semibold w-10 text-right">{device.percentage}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${device.percentage}%`, opacity: 0.8 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DeviceBreakdownWidget;
