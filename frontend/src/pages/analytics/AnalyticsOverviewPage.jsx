import React from 'react';
import OverviewKPIsWidget from '../../components/analytics/widgets/OverviewKPIsWidget';
import SessionKPIsWidget from '../../components/analytics/widgets/SessionKPIsWidget';
import TimeSeriesWidget from '../../components/analytics/widgets/TimeSeriesWidget';
import FunnelsSummaryWidget from '../../components/analytics/widgets/FunnelsSummaryWidget';
import DeviceBreakdownWidget from '../../components/analytics/widgets/DeviceBreakdownWidget';
import AIInsightsWidget from '../../components/analytics/widgets/AIInsightsWidget';

const AnalyticsOverviewPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Executive KPI Cards */}
      <section aria-label="Executive Key Performance Indicators">
        <OverviewKPIsWidget />
      </section>

      {/* SECTION: Session KPI Cards (Density Increase) */}
      <section aria-label="Session Key Performance Indicators">
        <SessionKPIsWidget />
      </section>

      {/* SECTION: Primary Analytics Chart */}
      <section aria-label="Primary Trend Analytics">
        <TimeSeriesWidget />
      </section>

      {/* SECTION: Analytics Summary Grid */}
      <section aria-label="Detailed Analytics Summaries" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <DeviceBreakdownWidget />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <FunnelsSummaryWidget />
        </div>
        
        {/* Automated Insights / Platform Summary */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <AIInsightsWidget />
        </div>
      </section>
    </div>
  );
};

export default AnalyticsOverviewPage;
