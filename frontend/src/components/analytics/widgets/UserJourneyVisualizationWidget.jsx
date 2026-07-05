import React from 'react';
import { useSessionAnalytics } from '../../../hooks/analytics/useSessionAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

const UserJourneyVisualizationWidget = () => {
  const { data, isLoading, error, refetch } = useSessionAnalytics();

  const journeyData = data?.userJourney || [];
  const isEmpty = !isLoading && !error && journeyData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="User Journey Visualization" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty} 
      emptyMessage="No user journey paths generated for this period."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <div className="w-full h-full flex items-center justify-center text-muted-text bg-muted/5 rounded-lg border border-dashed border-border p-6">
        {/* If data exists, we would render a Sankey diagram here. For now, empty state handles missing data natively via Card. */}
        {journeyData.length > 0 && (
          <div>
            <p>Journey diagram would render here based on data.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserJourneyVisualizationWidget;
