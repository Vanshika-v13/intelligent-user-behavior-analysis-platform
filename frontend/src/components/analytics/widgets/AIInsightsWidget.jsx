import React from 'react';
import { useOverviewAnalytics } from '../../../hooks/analytics/useOverviewAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

const AIInsightsWidget = () => {
  const { data, isLoading, error, refetch } = useOverviewAnalytics();

  // FIX: Backend doesn't return "insights" array. 
  // We will generate contextual insights on the frontend based on the overview data to maintain the UI design.
  
  const generateInsights = (metrics) => {
    if (!metrics) return [];
    
    const insights = [];
    
    // Insight 1: User Engagement based on Bounce Rate
    const bounceRate = metrics.bounceRate || 0;
    if (bounceRate > 60) {
      insights.push({
        title: 'High Bounce Rate Detected',
        description: `Your platform bounce rate is currently at ${bounceRate}%. Consider reviewing landing page content or course onboarding to improve initial retention.`,
        type: 'warning',
        tags: ['Retention', 'Onboarding']
      });
    } else if (bounceRate < 40 && bounceRate > 0) {
      insights.push({
        title: 'Strong User Retention',
        description: `Excellent engagement! Your bounce rate of ${bounceRate}% indicates users are actively exploring multiple pages per session.`,
        type: 'success',
        tags: ['Engagement', 'Healthy']
      });
    }

    // Insight 2: Activity Ratio
    const active = metrics.activeUsers || 0;
    const total = metrics.totalUsers || 0;
    if (total > 0) {
      const activeRatio = Math.round((active / total) * 100);
      insights.push({
        title: 'Active User Ratio',
        description: `Currently, ${activeRatio}% of your total user base (${active} out of ${total}) has been active in this period.`,
        type: 'info',
        tags: ['Users', 'Activity']
      });
    }

    // Insight 3: Session Depth
    const events = metrics.totalEvents || 0;
    const sessions = metrics.totalSessions || 0;
    if (sessions > 0) {
      const eventsPerSession = Math.round((events / sessions) * 10) / 10;
      insights.push({
        title: 'Session Depth Analysis',
        description: `Users trigger an average of ${eventsPerSession} events per session, indicating ${eventsPerSession > 5 ? 'deep' : 'light'} interaction with course materials.`,
        type: 'info',
        tags: ['Sessions', 'Events']
      });
    }
    
    // Fallback if no specific triggers hit but we have data
    if (insights.length === 0 && (metrics.totalEvents > 0 || metrics.totalSessions > 0)) {
       insights.push({
         title: 'Platform Activity Normal',
         description: `Recorded ${metrics.totalSessions} sessions and ${metrics.totalEvents} events in this period. Traffic patterns appear stable.`,
         type: 'success',
         tags: ['General', 'Stable']
       });
    }

    return insights;
  };

  const insights = generateInsights(data);
  const isEmpty = !isLoading && !error && insights.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Automated Insights" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty}
      emptyMessage="Not enough data to generate automated insights for this period."
      onRetry={refetch}
      className="h-full"
    >
      <div className="flex flex-col gap-4 h-full">
        {insights.map((insight, idx) => (
          <div key={idx} className={`flex flex-col gap-2 p-4 rounded-lg border ${
            insight.type === 'warning' ? 'bg-warning/5 border-warning/20' :
            insight.type === 'success' ? 'bg-success/5 border-success/20' :
            'bg-primary/5 border-primary/20'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                insight.type === 'warning' ? 'bg-warning/10 text-warning' :
                insight.type === 'success' ? 'bg-success/10 text-success' :
                'bg-primary/10 text-primary'
              }`}>
                {insight.type === 'warning' ? (
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
              </div>
              <h4 className="font-medium text-sm text-primary-text">{insight.title}</h4>
            </div>
            <p className="text-sm text-muted-text italic">
              "{insight.description}"
            </p>
            {insight.tags && (
              <div className="flex gap-2 mt-2">
                {insight.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className={`text-xs px-2 py-1 rounded-md font-medium ${
                     insight.type === 'warning' ? 'bg-warning/10 text-warning' :
                     insight.type === 'success' ? 'bg-success/10 text-success' :
                     'bg-primary/10 text-primary'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIInsightsWidget;
