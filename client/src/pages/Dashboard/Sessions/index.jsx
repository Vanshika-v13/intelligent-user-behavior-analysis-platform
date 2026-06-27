import React from 'react';
import { useSessionAnalytics } from '../../../hooks/queries/useAnalytics';
import { useDashboard } from '../../../contexts/DashboardContext';
import { KPIGrid } from '../../../components/dashboard/KPIGrid';
import { MetricCard } from '../../../components/dashboard/MetricCard';
import { ChartContainer } from '../../../components/dashboard/ChartContainer';
import { AnalyticsTable } from '../../../components/dashboard/AnalyticsTable';
import { DateRangeSelector } from '../../../components/dashboard/DateRangeSelector';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import { Clock, Users, Zap, Calendar } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export default function SessionsAnalytics() {
  const { selectedDateRange } = useDashboard();
  const { data, isLoading, error } = useSessionAnalytics();

  if (error) {
    return <div className="p-6 text-red-500">Failed to load session analytics</div>;
  }

  // Mock data for charts if API data is missing structure
  const trendData = data?.trend || [
    { date: 'Mon', duration: 120, sessions: 400 },
    { date: 'Tue', duration: 132, sessions: 300 },
    { date: 'Wed', duration: 101, sessions: 550 },
    { date: 'Thu', duration: 143, sessions: 450 },
    { date: 'Fri', duration: 190, sessions: 600 },
    { date: 'Sat', duration: 150, sessions: 350 },
    { date: 'Sun', duration: 110, sessions: 410 },
  ];

  const browserData = data?.browserDistribution || [
    { name: 'Chrome', value: 400 },
    { name: 'Safari', value: 300 },
    { name: 'Firefox', value: 300 },
    { name: 'Edge', value: 200 },
  ];
  
  const COLORS = ['#2563EB', '#10B981', '#FB923C', '#8B5CF6'];

  const columns = [
    { key: 'id', label: 'Session ID' },
    { key: 'user', label: 'User' },
    { key: 'duration', label: 'Duration' },
    { key: 'browser', label: 'Browser' },
    { key: 'os', label: 'OS' },
    { key: 'device', label: 'Device' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {val}
        </span>
      )
    },
  ];

  const tableData = data?.sessionsList || [
    { id: 'S-1234', user: 'John Doe', duration: '5m 12s', browser: 'Chrome', os: 'Windows', device: 'Desktop', status: 'Active' },
    { id: 'S-1235', user: 'Jane Smith', duration: '12m 45s', browser: 'Safari', os: 'macOS', device: 'Desktop', status: 'Completed' },
    { id: 'S-1236', user: 'Mike Ross', duration: '1m 20s', browser: 'Safari', os: 'iOS', device: 'Mobile', status: 'Completed' },
    { id: 'S-1237', user: 'Rachel Zane', duration: '45m 10s', browser: 'Firefox', os: 'Linux', device: 'Desktop', status: 'Active' },
    { id: 'S-1238', user: 'Harvey Specter', duration: '0m 30s', browser: 'Edge', os: 'Windows', device: 'Desktop', status: 'Bounced' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Session Analytics</h1>
          <p className="text-gray-500 mt-1">Analyze user sessions, duration, and platforms.</p>
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
          title="Average Session Duration" 
          value={data?.kpi?.avgDuration || "4m 32s"} 
          trend="up" 
          trendValue="12%" 
          icon={Clock} 
        />
        <MetricCard 
          title="Active Users" 
          value={data?.kpi?.activeUsers || "1,204"} 
          trend="up" 
          trendValue="5.4%" 
          icon={Users} 
        />
        <MetricCard 
          title="Bounce Rate" 
          value={data?.kpi?.bounceRate || "42.3%"} 
          trend="down" 
          trendValue="2.1%" 
          icon={Zap} 
        />
        <MetricCard 
          title="Total Sessions" 
          value={data?.kpi?.totalSessions || "12,450"} 
          trend="up" 
          trendValue="8.4%" 
          icon={Calendar} 
        />
      </KPIGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Session Duration Trend" description="Average session length over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="duration" stroke="#2563EB" fillOpacity={1} fill="url(#colorDuration)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Sessions Volume Trend" description="Number of sessions per day">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartContainer title="Browser Distribution" description="Sessions by browser">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={browserData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {browserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="lg:col-span-2">
           <div className="h-full">
            <AnalyticsTable 
              columns={columns}
              data={tableData}
              isLoading={isLoading}
              emptyTitle="No sessions found"
              emptyDescription="There are no sessions recorded for the selected time period."
            />
           </div>
        </div>
      </div>
    </div>
  );
}
