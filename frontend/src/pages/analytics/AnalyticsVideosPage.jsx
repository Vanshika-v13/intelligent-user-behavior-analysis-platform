import React from 'react';
import VideoKPIsWidget from '../../components/analytics/widgets/VideoKPIsWidget';
import VideoEngagementTableWidget from '../../components/analytics/widgets/VideoEngagementTableWidget';

const AnalyticsVideosPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Video KPIs */}
      <section aria-label="Video Key Performance Indicators">
        <VideoKPIsWidget />
      </section>

      {/* SECTION: Video Data Table */}
      <section aria-label="Detailed Video Engagement Table">
        <VideoEngagementTableWidget />
      </section>
    </div>
  );
};

export default AnalyticsVideosPage;
