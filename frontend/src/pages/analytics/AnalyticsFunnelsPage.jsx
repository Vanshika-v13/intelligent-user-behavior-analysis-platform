import React from 'react';
import FunnelsSummaryWidget from '../../components/analytics/widgets/FunnelsSummaryWidget';
import FunnelDropoffWidget from '../../components/analytics/widgets/FunnelDropoffWidget';

const AnalyticsFunnelsPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <section aria-label="Funnel Summaries">
        <FunnelsSummaryWidget />
      </section>

      <section aria-label="Funnel Dropoff Analysis">
        <FunnelDropoffWidget />
      </section>
    </div>
  );
};

export default AnalyticsFunnelsPage;
