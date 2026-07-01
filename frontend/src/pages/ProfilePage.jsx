import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';
import { getMyQuizAttempts } from '../services/quizService';
import { BookOpen, Award, CheckCircle2, Clock, Mail, Shield, User, Lock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [progresses, setProgresses] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [progressRes, attemptsRes] = await Promise.all([
          progressService.getAllProgress().catch(() => ({ progresses: [] })),
          getMyQuizAttempts().catch(() => ({ attempts: [] }))
        ]);
        setProgresses(progressRes.progresses || []);
        setAttempts(attemptsRes.attempts || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const stats = useMemo(() => {
    let enrolled = progresses.length;
    let completed = progresses.filter(p => p.progressPercentage === 100 || p.isLegacyCompleted).length;
    let lessons = progresses.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0);
    let quizPasses = attempts.filter(a => a.isPassed).length;

    return { enrolled, completed, lessons, quizPasses };
  }, [progresses, attempts]);

  if (loading) {
    return (
      <div className="p-6 md:p-10 animate-pulse max-w-5xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
        <div className="h-40 bg-white rounded-3xl w-full border border-[#E2E8F0]"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-white border border-[#E2E8F0] rounded-2xl"></div>)}
        </div>
        <div className="h-64 bg-white rounded-3xl w-full border border-[#E2E8F0]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 animate-[fadeIn_0.5s_ease-out] max-w-5xl mx-auto space-y-8 min-h-screen bg-[#F8FAFC]">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2E8F0] p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFE8DE] to-[#FED7AA] flex items-center justify-center text-[#FF6B35] font-bold text-4xl shadow-sm ring-4 ring-[#FFE8DE]">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2 mt-2">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{user?.name || 'User'}</h1>
          <p className="text-[#64748B] flex justify-center md:justify-start items-center gap-1.5 font-medium">
            <Mail size={16} /> {user?.email}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F5F9] text-[#0F172A] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#E2E8F0]">
              <Shield size={14} /> Student
            </span>
          </div>
        </div>
        <div className="shrink-0 mt-4 md:mt-0">
          <button 
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="px-6 py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] font-bold rounded-xl hover:bg-[#F8FAFC] shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Settings size={18} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Enrolled" value={stats.enrolled} icon={BookOpen} color="bg-[#FFF4EE] text-[#FF6B35]" />
        <StatCard title="Completed" value={stats.completed} icon={Award} color="bg-[#F0FDF4] text-[#22C55E]" />
        <StatCard title="Lessons" value={stats.lessons} icon={CheckCircle2} color="bg-[#F8FAFC] text-[#0F172A]" />
        <StatCard title="Quiz Passes" value={stats.quizPasses} icon={CheckCircle2} color="bg-[#FFFBEB] text-[#F59E0B]" />
        <StatCard title="Hours" value={`${(stats.lessons * 0.5).toFixed(1)}h`} icon={Clock} color="bg-[#F1F5F9] text-[#64748B]" />
      </div>

      {/* Profile Details Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#E2E8F0] bg-[#F1F5F9]/50">
          <h2 className="text-xl font-bold text-[#0F172A]">Profile Details</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#64748B]">Full Name</label>
              <div className="flex items-center px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-xl text-[#0F172A] font-medium">
                {user?.name || 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#64748B]">Email Address</label>
              <div className="flex items-center px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-xl text-[#0F172A] font-medium">
                {user?.email || 'N/A'}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#64748B]">Password</label>
              <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-xl">
                <span className="text-[#0F172A] font-medium tracking-widest">••••••••</span>
                <button 
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  className="text-sm font-bold text-[#FF6B35] hover:text-[#E85D2C] flex items-center gap-1.5 transition-colors"
                >
                  <Lock size={16} /> Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center gap-2 hover:shadow-md transition-shadow group text-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={24} className="group-hover:scale-110 transition-transform" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-[#0F172A] leading-tight">{value || 0}</p>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">{title}</p>
    </div>
  </div>
);

export default ProfilePage;
