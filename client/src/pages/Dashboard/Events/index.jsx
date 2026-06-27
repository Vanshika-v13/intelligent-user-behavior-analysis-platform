import React from 'react';
import { useEventAnalytics } from '../../../hooks/queries/useAnalytics';
import { useDashboard } from '../../../contexts/DashboardContext';
import { KPIGrid } from '../../../components/dashboard/KPIGrid';
import { MetricCard } from '../../../components/dashboard/MetricCard';
import { ChartContainer } from '../../../components/dashboard/ChartContainer';
import { AnalyticsTable } from '../../../components/dashboard/AnalyticsTable';
import { DateRangeSelector } from '../../../components/dashboard/DateRangeSelector';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import { MousePointerClick, Activity, FileText, Search as SearchIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function EventsAnalytics() {
  const { selectedDateRange } = useDashboard();
  const { data, isLoading, error } = useEventAnalytics();

  if (error) {
    return <div className="p-6 text-red-500">Failed to load event analytics</div>;
  }

  // Mock data for charts
  const eventDistData = data?.distribution || [
    { name: 'Mon', events: 1200 },
    { name: 'Tue', events: 1800 },
    { name: 'Wed', events: 1500 },
    { name: 'Thu', events: 2100 },
    { name: 'Fri', events: 1900 },
    { name: 'Sat', events: 900 },
    { name: 'Sun', events: 1100 },
  ];

  const topPagesData = data?.topPages || [
    { page: '/home', views: 4000 },
    { page: '/courses', views: 3000 },
    { page: '/dashboard', views: 2000 },
    { page: '/profile', views: 1500 },
    { page: '/settings', views: 500 },
  ];

  const eventTypeData = data?.eventTypes || [
    { name: 'Page View', value: 5000 },
    { name: 'Click', value: 3500 },
    { name: 'Form Submit', value: 1200 },
    { name: 'Search', value: 800 },
  ];
  
  const COLORS = ['#2563EB', '#10B981', '#FB923C', '#8B5CF6'];

  const columns = [
    { key: 'timestamp', label: 'Timestamp' },
    { 
      key: 'type', 
      label: 'Event Type',
      render: (val) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">
          {val}
        </span>
      )
    },
    { key: 'page', label: 'Page' },
    { key: 'session', label: 'Session' },
    { key: 'user', label: 'User' },
    { 
      key: 'metadata', 
      label: 'Metadata',
      render: (val) => (
        <pre className="text-[10px] text-gray-500 bg-gray-50 p-1 rounded max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
          {JSON.stringify(val)}
        </pre>
      )
    },
  ];

  const tableData = data?.eventsList || [
    { id: 1, timestamp: '2023-10-01 10:23:01', type: 'page_view', page: '/home', session: 'S-1234', user: 'User-1', metadata: { ref: 'google' } },
    { id: 2, timestamp: '2023-10-01 10:25:12', type: 'click', page: '/home', session: 'S-1234', user: 'User-1', metadata: { buttonId: 'start_course' } },
    { id: 3, timestamp: '2023-10-01 11:05:00', type: 'search', page: '/courses', session: 'S-1235', user: 'User-2', metadata: { query: 'react' } },
    { id: 4, timestamp: '2023-10-01 11:06:30', type: 'page_view', page: '/courses/react', session: 'S-1235', user: 'User-2', metadata: {} },
    { id: 5, timestamp: '2023-10-01 11:45:22', type: 'form_submit', page: '/profile', session: 'S-1236', user: 'User-3', metadata: { form: 'update_profile' } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Analytics</h1>
          <p className="text-gray-500 mt-1">Track user interactions, clicks, and page views.</p>
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
          title="Total Events" 
          value={data?.kpi?.totalEvents || "45,231"} 
          trend="up" 
          trendValue="12.5%" 
          icon={Activity} 
        />
        <MetricCard 
          title="Page Views" 
          value={data?.kpi?.pageViews || "18,492"} 
          trend="up" 
          trendValue="8.2%" 
          icon={FileText} 
        />
        <MetricCard 
          title="Clicks" 
          value={data?.kpi?.clicks || "12,845"} 
          trend="up" 
          trendValue="15.3%" 
          icon={MousePointerClick} 
        />
        <MetricCard 
          title="Searches" 
          value={data?.kpi?.searches || "3,210"} 
          trend="down" 
          trendValue="4.1%" 
          icon={SearchIcon} 
        />
      </KPIGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer title="Event Distribution" description="Daily event volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventDistData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="lg:col-span-1">
          <ChartContainer title="Event Types" description="Breakdown by category">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartContainer title="Most Visited Pages" description="Top pages by view count" height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPagesData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="page" type="category" width={80} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="views" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="lg:col-span-2">
           <div className="h-full">
            <AnalyticsTable 
              columns={columns}
              data={tableData}
              isLoading={isLoading}
              emptyTitle="No events available"
              emptyDescription="No events found for the given criteria."
            />
           </div>
        </div>
      </div>
    </div>
  );
}
