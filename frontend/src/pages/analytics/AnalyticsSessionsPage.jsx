import React from 'react';
import SessionKPIsWidget from '../../components/analytics/widgets/SessionKPIsWidget';
import SessionDurationHistogramWidget from '../../components/analytics/widgets/SessionDurationHistogramWidget';
import UserJourneyVisualizationWidget from '../../components/analytics/widgets/UserJourneyVisualizationWidget';

const AnalyticsSessionsPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Session KPIs */}
      <section aria-label="Session Key Performance Indicators">
        <SessionKPIsWidget />
      </section>

      {/* SECTION: Duration Histogram */}
      <section aria-label="Session Duration Distribution">
        <SessionDurationHistogramWidget />
      </section>

      {/* SECTION: User Journey */}
      <section aria-label="User Journey Flow">
        <UserJourneyVisualizationWidget />
      </section>
    </div>
  );
};

export default AnalyticsSessionsPage;
