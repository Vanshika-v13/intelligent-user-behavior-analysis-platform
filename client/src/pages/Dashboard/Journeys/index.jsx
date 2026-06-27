import React from 'react';
import { useJourneyAnalytics } from '../../../hooks/queries/useAnalytics';
import { useDashboard } from '../../../contexts/DashboardContext';
import { KPIGrid } from '../../../components/dashboard/KPIGrid';
import { MetricCard } from '../../../components/dashboard/MetricCard';
import { ChartContainer } from '../../../components/dashboard/ChartContainer';
import { AnalyticsTable } from '../../../components/dashboard/AnalyticsTable';
import { DateRangeSelector } from '../../../components/dashboard/DateRangeSelector';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import { Route, TrendingDown, Target, ArrowRight } from 'lucide-react';

export default function JourneysAnalytics() {
  const { selectedDateRange } = useDashboard();
  const { data, isLoading, error } = useJourneyAnalytics();

  if (error) {
    return <div className="p-6 text-red-500">Failed to load journey analytics</div>;
  }

  // Funnel Data mock
  const funnelData = data?.funnel || [
    { step: 'Landing', count: 10000, percentage: 100 },
    { step: 'Course', count: 6500, percentage: 65 },
    { step: 'Video', count: 4200, percentage: 42 },
    { step: 'Quiz', count: 2100, percentage: 21 },
    { step: 'Completion', count: 1800, percentage: 18 },
  ];

  const transitionColumns = [
    { key: 'source', label: 'Source Page' },
    { key: 'destination', label: 'Destination Page' },
    { key: 'count', label: 'Transition Count' },
    { 
      key: 'percentage', 
      label: 'Percentage',
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="w-12">{val}%</span>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${val}%` }} />
          </div>
        </div>
      )
    },
  ];

  const transitionData = data?.transitions || [
    { id: 1, source: '/home', destination: '/courses', count: 3200, percentage: 45 },
    { id: 2, source: '/courses', destination: '/course/1', count: 2100, percentage: 35 },
    { id: 3, source: '/course/1', destination: '/quiz/1', count: 1500, percentage: 22 },
    { id: 4, source: '/home', destination: '/login', count: 800, percentage: 12 },
    { id: 5, source: '/login', destination: '/dashboard', count: 750, percentage: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Journeys</h1>
          <p className="text-gray-500 mt-1">Analyze how users navigate through your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector />
          <ExportButton 
            onExportCsv={() => console.log('Export CSV')} 
            onExportJson={() => console.log('Export JSON')} 
            onPrint={() => window.print()}
          />
        </div>
      </div>

      <KPIGrid>
        <MetricCard 
          title="Completion Rate" 
          value={data?.kpi?.completionRate || "18.2%"} 
          trend="up" 
          trendValue="2.1%" 
          icon={Target} 
        />
        <MetricCard 
          title="Avg. Journey Length" 
          value={data?.kpi?.avgJourneyLength || "4.5 steps"} 
          trend="up" 
          trendValue="0.5" 
          icon={Route} 
        />
        <MetricCard 
          title="Drop-Off Rate" 
          value={data?.kpi?.dropOffRate || "65.4%"} 
          trend="down" 
          trendValue="3.2%" 
          icon={TrendingDown} 
        />
        <MetricCard 
          title="Returning Users" 
          value={data?.kpi?.returningUsers || "42.1%"} 
          trend="up" 
          trendValue="5.8%" 
          icon={ArrowRight} 
        />
      </KPIGrid>

      {/* Funnel Section */}
      <div className="bg-white rounded-[24px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Journey Funnel</h3>
        <div className="flex items-center justify-between min-w-[800px] gap-4">
          {funnelData.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center text-center">
                  <div className="text-sm font-medium text-gray-500 mb-1">{step.step}</div>
                  <div className="text-2xl font-bold text-gray-900">{step.count.toLocaleString()}</div>
                  <div className="text-sm font-semibold text-blue-600 mt-2">{step.percentage}%</div>
                </div>
              </div>
              {idx < funnelData.length - 1 && (
                <div className="flex-shrink-0 text-gray-300">
                  <ArrowRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartContainer title="Page Transitions" description="Flow between major pages" height={400}>
           <AnalyticsTable 
              columns={transitionColumns}
              data={transitionData}
              isLoading={isLoading}
              emptyTitle="No transitions available"
              emptyDescription="No page transition data for this period."
            />
        </ChartContainer>
      </div>
    </div>
  );
}
