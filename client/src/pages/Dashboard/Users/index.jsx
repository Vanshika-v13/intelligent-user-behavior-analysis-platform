import React from 'react';
import { useUsersAnalytics } from '../../../hooks/queries/useAnalytics';
import { useDashboard } from '../../../contexts/DashboardContext';
import { KPIGrid } from '../../../components/dashboard/KPIGrid';
import { MetricCard } from '../../../components/dashboard/MetricCard';
import { ChartContainer } from '../../../components/dashboard/ChartContainer';
import { AnalyticsTable } from '../../../components/dashboard/AnalyticsTable';
import { DateRangeSelector } from '../../../components/dashboard/DateRangeSelector';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import { Users, UserPlus, UserCheck, Clock } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function UsersAnalytics() {
  const { selectedDateRange } = useDashboard();
  const { data, isLoading, error } = useUsersAnalytics();

  if (error) {
    return <div className="p-6 text-red-500">Failed to load user analytics</div>;
  }

  // Mock data for charts
  const activityData = [
    { date: 'Mon', active: 1200, new: 150 },
    { date: 'Tue', active: 1400, new: 180 },
    { date: 'Wed', active: 1100, new: 120 },
    { date: 'Thu', active: 1600, new: 210 },
    { date: 'Fri', active: 1800, new: 250 },
    { date: 'Sat', active: 900, new: 90 },
    { date: 'Sun', active: 1000, new: 110 },
  ];

  const distributionData = [
    { group: '18-24', users: 2400 },
    { group: '25-34', users: 4500 },
    { group: '35-44', users: 3200 },
    { group: '45-54', users: 1500 },
    { group: '55+', users: 800 },
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'events', label: 'Events' },
    { 
      key: 'engagementScore', 
      label: 'Engagement Score',
      render: (val) => (
        <div className="flex items-center gap-2">
          <span>{val}</span>
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${val >= 80 ? 'bg-green-500' : val >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${val}%` }} />
          </div>
        </div>
      )
    },
    { key: 'lastActive', label: 'Last Active' },
  ];

  const tableData = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', sessions: 45, events: 1205, engagementScore: 92, lastActive: '2 mins ago' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', sessions: 12, events: 340, engagementScore: 45, lastActive: '1 hour ago' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', sessions: 89, events: 4500, engagementScore: 98, lastActive: 'Just now' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', sessions: 2, events: 15, engagementScore: 12, lastActive: '2 days ago' },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', sessions: 34, events: 890, engagementScore: 76, lastActive: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-500 mt-1">Analyze user acquisition, activity, and demographics.</p>
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
          title="Total Users" 
          value="24,592" 
          trend="up" 
          trendValue="12.5%" 
          icon={Users} 
        />
        <MetricCard 
          title="Active Users" 
          value="8,401" 
          trend="up" 
          trendValue="8.2%" 
          icon={UserCheck} 
        />
        <MetricCard 
          title="New Users" 
          value="1,245" 
          trend="up" 
          trendValue="15.3%" 
          icon={UserPlus} 
        />
        <MetricCard 
          title="Avg. Time to Return" 
          value="2.4 days" 
          trend="down" 
          trendValue="1.1 days" 
          icon={Clock} 
        />
      </KPIGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer title="User Activity" description="Daily active and new users">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" name="Active Users" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="new" name="New Users" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="lg:col-span-1">
          <ChartContainer title="Age Distribution" description="Users by age group">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="group" type="category" width={50} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="users" fill="#FB923C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="h-full">
          <AnalyticsTable 
            columns={columns}
            data={tableData}
            isLoading={isLoading}
            emptyTitle="No users found"
            emptyDescription="There are no users matching your criteria."
          />
        </div>
      </div>
    </div>
  );
}
