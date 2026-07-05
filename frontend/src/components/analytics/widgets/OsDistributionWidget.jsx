import React from 'react';
import { useDeviceAnalytics } from '../../../hooks/analytics/useDeviceAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

// Backend contract:
// GET /api/v2/analytics/devices
// Returns: { byOperatingSystem[{name, count}], ... }

const OsDistributionWidget = () => {
  const { data, isLoading, error, refetch } = useDeviceAnalytics();

  // Backend returns byOperatingSystem: [{ name: 'Windows', count: 300 }, ...]
  const rawOS = data?.byOperatingSystem || [];

  const total = rawOS.reduce((sum, os) => sum + (os.count || 0), 0);

  const osData = rawOS.map(os => ({
    name: os.name || 'Unknown',
    count: os.count || 0,
    percentage: total > 0 ? Math.round((os.count / total) * 1000) / 10 : 0,
  }));

  const isEmpty = !isLoading && !error && osData.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Operating Systems" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No OS data available."
      onRetry={refetch}
      className="h-[350px]"
    >
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 h-full pb-4">
        {osData.map((os, index) => (
          <div key={index} className="flex flex-col gap-1.5 group">
            <div className="flex justify-between text-sm items-center">
              <span className="font-medium text-primary-text truncate max-w-[60%]">{os.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{os.count.toLocaleString()}</span>
                <span className="text-primary-text font-semibold w-10 text-right">{os.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${os.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OsDistributionWidget;
