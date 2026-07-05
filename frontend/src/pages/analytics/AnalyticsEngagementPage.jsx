import React from 'react';
import EngagementKPIsWidget from '../../components/analytics/widgets/EngagementKPIsWidget';
import ActivityHeatmapWidget from '../../components/analytics/widgets/ActivityHeatmapWidget';
import UserJourneyVisualizationWidget from '../../components/analytics/widgets/UserJourneyVisualizationWidget';

const AnalyticsEngagementPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Engagement KPIs */}
      <section aria-label="Engagement Key Performance Indicators">
        <EngagementKPIsWidget />
      </section>

      {/* SECTION: Layout Grid for Charts */}
      <section aria-label="Engagement Visualizations" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Distribution (repurposed from heatmap) */}
        <div className="col-span-1">
          <ActivityHeatmapWidget />
        </div>
        
        {/* User Journey Map */}
        <div className="col-span-1 lg:col-span-2">
          <UserJourneyVisualizationWidget />
        </div>
      </section>
    </div>
  );
};

export default AnalyticsEngagementPage;
