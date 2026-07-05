import React from 'react';
import { useEngagementAnalytics } from '../../../hooks/analytics/useEngagementAnalytics';
import { MetricCard } from '../cards/MetricCard';

// Backend contract:
// GET /api/analytics/engagement
// Returns: {
//   engagementScores: [{ userId, engagementScore }],
//   engagementLevels: [{ userId, level }]   ← level is 'High' | 'Medium' | 'Low' (capitalized!)
// }


const EngagementKPIsWidget = () => {
  const { data, isLoading, error, refetch } = useEngagementAnalytics();

  // Backend returns: { engagementScores: [{userId, engagementScore}], engagementLevels: [{userId, level}] }
  const scores = data?.engagementScores || [];
  const levels = data?.engagementLevels || [];

  // Average engagement score across all users
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + (s.engagementScore || 0), 0) / scores.length)
    : 0;

  // FIX: Backend returns capitalized levels: 'High', 'Medium', 'Low' (not lowercase)
  const highEngagement = levels.filter(l => l.level === 'High').length;
  const mediumEngagement = levels.filter(l => l.level === 'Medium').length;
  const lowEngagement = levels.filter(l => l.level === 'Low').length;

  const totalUsers = levels.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Avg Engagement Score"
        value={`${avgScore}%`}
        subtitle={`${totalUsers} users measured`}
        accent={avgScore >= 70 ? 'text-success' : avgScore >= 30 ? 'text-warning' : 'text-error'}
        loading={isLoading}
        error={error}
        refetch={refetch}
      />
      <MetricCard
        title="High Engagement"
        value={highEngagement}
        subtitle={totalUsers > 0 ? `${Math.round((highEngagement / totalUsers) * 100)}% of users` : '—'}
        accent="text-success"
        loading={isLoading}
        error={error}
        refetch={refetch}
      />
      <MetricCard
        title="Medium Engagement"
        value={mediumEngagement}
        subtitle={totalUsers > 0 ? `${Math.round((mediumEngagement / totalUsers) * 100)}% of users` : '—'}
        accent="text-warning"
        loading={isLoading}
        error={error}
        refetch={refetch}
      />
      <MetricCard
        title="Low Engagement"
        value={lowEngagement}
        subtitle={totalUsers > 0 ? `${Math.round((lowEngagement / totalUsers) * 100)}% of users` : '—'}
        accent="text-error"
        loading={isLoading}
        error={error}
        refetch={refetch}
      />
    </div>
  );
};

export default EngagementKPIsWidget;
