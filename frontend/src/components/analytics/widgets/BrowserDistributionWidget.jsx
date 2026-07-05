import React from 'react';
import { useDeviceAnalytics } from '../../../hooks/analytics/useDeviceAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

// Backend contract:
// GET /api/v2/analytics/devices
// Returns: { byBrowser[{name, count}], ... }

const BrowserDistributionWidget = () => {
  const { data, isLoading, error, refetch } = useDeviceAnalytics();

  // Backend returns byBrowser: [{ name: 'Chrome', count: 250 }, { name: 'Firefox', count: 80 }, ...]
  const rawBrowsers = data?.byBrowser || [];

  const total = rawBrowsers.reduce((sum, b) => sum + (b.count || 0), 0);

  const browsers = rawBrowsers.map(b => ({
    name: b.name || 'Unknown',
    count: b.count || 0,
    percentage: total > 0 ? Math.round((b.count / total) * 1000) / 10 : 0,
  }));

  const isEmpty = !isLoading && !error && browsers.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Browser Distribution" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No browser data available."
      onRetry={refetch}
      className="h-[350px]"
    >
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 h-full pb-4">
        {browsers.map((browser, index) => (
          <div key={index} className="flex flex-col gap-1.5 group">
            <div className="flex justify-between text-sm items-center">
              <span className="font-medium text-primary-text truncate max-w-[60%]">{browser.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{browser.count.toLocaleString()}</span>
                <span className="text-primary-text font-semibold w-10 text-right">{browser.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${browser.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BrowserDistributionWidget;
