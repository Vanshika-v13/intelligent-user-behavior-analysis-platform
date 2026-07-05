import React from 'react';
import { useFunnelsAnalytics } from '../../../hooks/analytics/useFunnelsAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';

// Backend contract:
// GET /api/v2/analytics/funnels
// Returns: {
//   steps: [{ step, eventType, users, conversionRate, dropOffRate }],
//   exitPoints: [{ fromStep, toStep, dropOffRate, usersLost }],
//   overallConversionRate
// }
// IMPORTANT: Step label is "step" field, not "name"

const FunnelDropoffWidget = () => {
  const { data, isLoading, error, refetch } = useFunnelsAnalytics();

  // Backend field: step.step (not step.name!)
  const funnelSteps = data?.steps || [];
  const exitPoints = data?.exitPoints || [];
  const isEmpty = !isLoading && !error && funnelSteps.length === 0;

  return (
    <Card
      title={<WidgetHeader title="Detailed Drop-off Analysis" />}
      loading={isLoading}
      error={error}
      empty={isEmpty}
      emptyMessage="No detailed funnel data available."
      onRetry={refetch}
      className="min-h-[300px]"
    >
      <div className="flex flex-col gap-6">
        {/* Step-by-Step Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="py-3 px-4 font-semibold">Step</th>
                <th className="py-3 px-4 font-semibold text-right">Users</th>
                <th className="py-3 px-4 font-semibold text-right">Conversion Rate</th>
                <th className="py-3 px-4 font-semibold text-right">Drop-off Rate</th>
                <th className="py-3 px-4 font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {funnelSteps.map((step, index) => {
                // FIX: backend field is "step" not "name"
                const stepName = step.step;
                const conversionRate = step.conversionRate || 0;
                const dropOffRate = step.dropOffRate || 0;

                return (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/5 transition-colors text-sm">
                    <td className="py-3 px-4 font-medium text-primary-text">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        {stepName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-muted">{(step.users || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-success font-semibold">{conversionRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {index === 0 ? (
                        <span className="text-muted text-xs">—</span>
                      ) : (
                        <span className={`font-semibold ${dropOffRate > 50 ? 'text-error' : dropOffRate > 25 ? 'text-warning' : 'text-muted'}`}>
                          {dropOffRate}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 w-24">
                      <div className="w-full bg-muted/15 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${conversionRate}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Exit Points Section */}
        {exitPoints.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Highest Drop-off Transitions</h4>
            <div className="flex flex-col gap-2">
              {exitPoints.slice(0, 3).map((ep, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-error/5 border border-error/15 rounded-soft text-sm">
                  <div className="flex items-center gap-2 text-primary-text">
                    <span className="font-medium">{ep.fromStep}</span>
                    <svg className="w-3 h-3 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium">{ep.toStep}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-error font-semibold text-xs">{ep.dropOffRate}% drop-off</span>
                    <span className="text-muted text-xs">−{(ep.usersLost || 0).toLocaleString()} users</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FunnelDropoffWidget;
