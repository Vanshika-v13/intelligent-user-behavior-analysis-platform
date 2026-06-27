import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  MousePointerClick, 
  Clock, 
  Map, 
  Zap, 
  ArrowRight,
  MonitorPlay,
  BarChart3,
  BrainCircuit,
  LayoutDashboard
} from 'lucide-react';

const mockChartData = [
  { name: 'Mon', sessions: 400 },
  { name: 'Tue', sessions: 300 },
  { name: 'Wed', sessions: 550 },
  { name: 'Thu', sessions: 480 },
  { name: 'Fri', sessions: 700 },
  { name: 'Sat', sessions: 650 },
  { name: 'Sun', sessions: 800 },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Intelligent User Behavior Analytics Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
            Gain deep insights into how users interact with your platform. Track sessions, map journeys, and optimize engagement through data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate(ROUTES.COURSES)} className="text-base">
              Explore Courses
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(ROUTES.DASHBOARD)} className="text-base">
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Hero Illustration (React/CSS built) */}
        <div className="relative hidden lg:block animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-full blur-3xl opacity-50 transform -translate-x-10 translate-y-10"></div>
          <div className="relative bg-white border border-[var(--color-border)] rounded-[24px] shadow-lg p-6 flex flex-col gap-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-sm font-semibold text-gray-500">Real-time Analytics</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Active Users</div>
                <div className="text-2xl font-bold text-primary">1,204</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Avg. Session</div>
                <div className="text-2xl font-bold text-secondary">4m 12s</div>
              </div>
            </div>

            <div className="h-40 w-full bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="sessions" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center gap-3 bg-blue-50 text-blue-700 p-3 rounded-xl text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Engagement is up 12% today!</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="w-full bg-white border-y border-[var(--color-border)] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Analytics Features</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to understand user behavior and improve your platform's experience.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Event Tracking', icon: <MousePointerClick className="w-6 h-6 text-primary" />, desc: 'Track clicks, form submissions, and custom interactions.' },
              { title: 'Session Analytics', icon: <Clock className="w-6 h-6 text-secondary" />, desc: 'Measure how long users stay and what they do.' },
              { title: 'User Journey Analysis', icon: <Map className="w-6 h-6 text-accent" />, desc: 'Visualize the paths users take through your app.' },
              { title: 'Engagement Insights', icon: <Zap className="w-6 h-6 text-yellow-500" />, desc: 'Identify your most engaging features and content.' }
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="w-full py-16 lg:py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From user action to actionable insight in four simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
             <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10"></div>
             
             {[
               { step: '1', title: 'User visits course', icon: <MonitorPlay className="w-6 h-6 text-primary" /> },
               { step: '2', title: 'Events are captured', icon: <BarChart3 className="w-6 h-6 text-secondary" /> },
               { step: '3', title: 'Engine processes data', icon: <BrainCircuit className="w-6 h-6 text-accent" /> },
               { step: '4', title: 'Dashboard generated', icon: <LayoutDashboard className="w-6 h-6 text-primary" /> }
             ].map((item, i) => (
               <div key={i} className="flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-white border-2 border-[var(--color-border)] shadow-sm flex items-center justify-center z-10 text-xl font-bold text-gray-900">
                    {item.icon}
                 </div>
                 <div>
                   <h4 className="font-semibold text-gray-900">Step {item.step}</h4>
                   <p className="text-sm text-gray-500 mt-1">{item.title}</p>
                 </div>
               </div>
             ))}
          </div>
         </div>
      </section>

      {/* 4. Analytics Preview */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Real-time pulse of your platform</h2>
            <p className="text-gray-500">Monitor your key metrics at a glance. Understand growth trends and user retention effortlessly.</p>
            <div className="space-y-4">
               {/* 3 Stat Cards */}
               <Card className="p-4 flex justify-between items-center">
                 <span className="text-gray-600 font-medium">Total Users</span>
                 <span className="font-bold text-xl text-gray-900">8,492</span>
               </Card>
               <Card className="p-4 flex justify-between items-center">
                 <span className="text-gray-600 font-medium">Active Sessions</span>
                 <span className="font-bold text-xl text-gray-900">342</span>
               </Card>
               <Card className="p-4 flex justify-between items-center">
                 <span className="text-gray-600 font-medium">Event Count</span>
                 <span className="font-bold text-xl text-gray-900">124.5k</span>
               </Card>
            </div>
          </div>
          
          <div className="lg:w-2/3 w-full">
             <Card className="p-6 h-[400px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Session Trends (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorPreview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #ECECEC', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
                    />
                    <Area type="monotone" dataKey="sessions" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPreview)" />
                  </AreaChart>
                </ResponsiveContainer>
             </Card>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="w-full bg-[var(--color-primary)] py-20 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to understand your users?</h2>
          <p className="text-blue-100 text-lg">Start exploring the analytics dashboard to uncover insights today.</p>
          <div className="pt-4">
             <Button 
                size="lg" 
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="bg-white text-[var(--color-primary)] hover:bg-gray-50 focus:ring-white"
             >
                Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
