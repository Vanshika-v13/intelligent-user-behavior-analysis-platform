import React from 'react';
import BrowserDistributionWidget from '../../components/analytics/widgets/BrowserDistributionWidget';
import OsDistributionWidget from '../../components/analytics/widgets/OsDistributionWidget';
import DeviceTableWidget from '../../components/analytics/widgets/DeviceTableWidget';
import DeviceDistributionWidget from '../../components/analytics/widgets/DeviceDistributionWidget';

const AnalyticsDevicesPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Overview Distributions */}
      <section aria-label="Device distributions" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <DeviceDistributionWidget />
        </div>
        <div className="col-span-1">
          <BrowserDistributionWidget />
        </div>
        <div className="col-span-1">
          <OsDistributionWidget />
        </div>
      </section>

      {/* SECTION: Data Table */}
      <section aria-label="Detailed Device Analytics Table">
        <DeviceTableWidget />
      </section>
    </div>
  );
};

export default AnalyticsDevicesPage;
