import React from 'react';
import UserKPIsWidget from '../../components/analytics/widgets/UserKPIsWidget';
import UserGrowthTrendWidget from '../../components/analytics/widgets/UserGrowthTrendWidget';
import UserDistributionWidget from '../../components/analytics/widgets/UserDistributionWidget';
import GeoDistributionWidget from '../../components/analytics/widgets/GeoDistributionWidget';

const AnalyticsUsersPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: User KPIs */}
      <section aria-label="User Key Performance Indicators">
        <UserKPIsWidget />
      </section>

      {/* SECTION: Trend */}
      <section aria-label="User Growth Trend">
        <UserGrowthTrendWidget />
      </section>

      {/* SECTION: Distributions */}
      <section aria-label="User Distributions" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <UserDistributionWidget />
        </div>
        <div className="col-span-1">
          <GeoDistributionWidget />
        </div>
      </section>
    </div>
  );
};

export default AnalyticsUsersPage;
