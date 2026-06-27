import React from 'react';
import { useOverviewAnalytics } from '../../hooks/queries/useAnalytics';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/ui/Card';
import PageLoader from '../../components/ui/PageLoader';
import ErrorFallback from '../../components/ui/ErrorFallback';
import { Users, Activity, Clock, MousePointerClick, TrendingUp, AlertCircle, PlayCircle, LogIn, Edit3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import clsx from 'clsx';

// Static Data for Charts
const sessionTrendData = [
  { date: 'Mon', sessions: 2400 },
  { date: 'Tue', sessions: 1398 },
  { date: 'Wed', sessions: 9800 },
  { date: 'Thu', sessions: 3908 },
  { date: 'Fri', sessions: 4800 },
  { date: 'Sat', sessions: 3800 },
  { date: 'Sun', sessions: 4300 },
];

const eventDistributionData = [
  { name: 'Page Views', value: 4500, color: '#2563EB' },
  { name: 'Clicks', value: 3200, color: '#10B981' },
  { name: 'Form Submits', value: 1200, color: '#FB923C' },
];

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useOverviewAnalytics();

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorFallback error={error} resetErrorBoundary={refetch} />;

  // Destructure real data, provide fallbacks if missing
  const { totalUsers = 0, activeUsers = 0, totalSessions = 0, totalEvents = 0 } = data || {};

  return (
    <div 
      className="flex flex-col animate-fade-in w-full pb-12"
      style={{
        gap: 'clamp(1rem, 2vw, 2rem)',
        padding: 'clamp(1rem, 2vw, 2rem)'
      }}
    >
      <PageHeader 
        title="Dashboard Overview" 
        description="Your high-level metrics and user behavior insights."
      />

      {/* KPI Cards (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 'clamp(1rem, 2vw, 2rem)' }}>
        <StatCard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          icon={<Users size={20} className="text-primary" />} 
          trend={{ value: 12, isPositive: true }}
          className="border border-[var(--color-border)] hover:shadow-sm"
        />
        <StatCard 
          title="Active Users" 
          value={activeUsers.toLocaleString()} 
          icon={<Activity size={20} className="text-secondary" />} 
          trend={{ value: 4, isPositive: true }}
          className="border border-[var(--color-border)] hover:shadow-sm"
        />
        <StatCard 
          title="Sessions" 
          value={totalSessions.toLocaleString()} 
          icon={<Clock size={20} className="text-accent" />} 
          trend={{ value: 2.4, isPositive: false }}
          className="border border-[var(--color-border)] hover:shadow-sm"
        />
        <StatCard 
          title="Events" 
          value={totalEvents.toLocaleString()} 
          icon={<MousePointerClick size={20} className="text-primary" />} 
          trend={{ value: 18, isPositive: true }}
          className="border border-[var(--color-border)] hover:shadow-sm"
        />
      </div>

      {/* Charts Section (Static Placeholder Data) */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'clamp(1rem, 2vw, 2rem)' }}>
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Session Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionTrendData}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ECECEC', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }} />
                <Area type="monotone" dataKey="sessions" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Event Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventDistributionData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ECECEC" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#111827', fontSize: 12, fontWeight: 500}} width={100} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ECECEC', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {eventDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Insights Section (Static) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 'clamp(1rem, 2vw, 2rem)' }}>
          {[
            { msg: 'Bounce rate increased by 12%.', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
            { msg: 'Average session duration increased.', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
            { msg: 'Most users visit Courses page.', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { msg: 'Quiz page has the highest drop-off.', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' }
          ].map((insight, i) => {
            const Icon = insight.icon;
            return (
              <Card key={i} className="p-5 flex items-start gap-4">
                <div className={clsx("p-2 rounded-lg shrink-0", insight.bg, insight.color)}>
                  <Icon size={20} />
                </div>
                <p className="text-sm font-medium text-gray-800 leading-relaxed mt-0.5">{insight.msg}</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity (Static) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
        <Card className="overflow-hidden">
          <div className="divide-y divide-[var(--color-border)]">
             {[
               { user: 'Alice Smith', action: 'completed a course', time: '2 mins ago', icon: PlayCircle },
               { user: 'Bob Johnson', action: 'logged in from new device', time: '15 mins ago', icon: LogIn },
               { user: 'Charlie Brown', action: 'started taking a quiz', time: '1 hour ago', icon: Edit3 },
               { user: 'Diana Prince', action: 'browsed Design category', time: '2 hours ago', icon: MousePointerClick },
             ].map((activity, i) => {
               const Icon = activity.icon;
               return (
                 <div key={i} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                        <Icon size={18} />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">{activity.user} <span className="font-normal text-gray-500">{activity.action}</span></p>
                       <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                     </div>
                   </div>
                   <button className="text-sm font-medium text-[var(--color-primary)] hover:underline focus:outline-none">View</button>
                 </div>
               )
             })}
          </div>
        </Card>
      </div>

    </div>
  );
}
