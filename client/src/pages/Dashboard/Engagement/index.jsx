import React from 'react';
import { useEngagementAnalytics } from '../../../hooks/queries/useAnalytics';
import { useDashboard } from '../../../contexts/DashboardContext';
import { ChartContainer } from '../../../components/dashboard/ChartContainer';
import { DateRangeSelector } from '../../../components/dashboard/DateRangeSelector';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import { InsightPanel } from '../../../components/dashboard/InsightPanel';
import { RecommendationCard } from '../../../components/dashboard/RecommendationCard';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function EngagementAnalytics() {
  const { selectedDateRange } = useDashboard();
  const { data, isLoading, error } = useEngagementAnalytics();

  if (error) {
    return <div className="p-6 text-red-500">Failed to load engagement analytics</div>;
  }

  // Mock data
  const engagementScore = data?.score || 78;

  const levelsData = data?.levels || [
    { name: 'High', value: 45 },
    { name: 'Medium', value: 35 },
    { name: 'Low', value: 20 },
  ];

  const segmentsData = data?.segments || [
    { segment: 'Power Users', users: 1200 },
    { segment: 'Regular', users: 3400 },
    { segment: 'Occasional', users: 5600 },
    { segment: 'Inactive', users: 2100 },
  ];
  
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  const GAUGE_COLORS = ['#2563EB', '#E5E7EB'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagement Analytics</h1>
          <p className="text-gray-500 mt-1">Measure how deeply users interact with your content.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge Chart Alternative - Progress Circle */}
        <div className="lg:col-span-1">
          <ChartContainer title="Average Engagement Score" description="Overall platform score (0-100)">
            <div className="flex flex-col items-center justify-center h-full relative">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Score', value: engagementScore },
                      { name: 'Remaining', value: 100 - engagementScore }
                    ]}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={GAUGE_COLORS[0]} />
                    <Cell fill={GAUGE_COLORS[1]} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-4 text-center">
                <span className="text-5xl font-bold text-gray-900">{engagementScore}</span>
                <span className="text-gray-500 block text-sm">/ 100</span>
              </div>
            </div>
          </ChartContainer>
        </div>

        <div className="lg:col-span-1">
          <ChartContainer title="Engagement Levels" description="Distribution of user engagement">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {levelsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="lg:col-span-1 flex flex-col h-full">
           <InsightPanel title="AI Recommendations">
             <RecommendationCard text="Users spend more time on Course A than other courses." type="info" />
             <RecommendationCard text="Quiz completion is down by 12% this week." type="warning" />
             <RecommendationCard text="Video engagement has increased significantly on mobile devices." type="success" />
           </InsightPanel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartContainer title="User Segments" description="Top engaged user segments">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
