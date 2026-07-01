import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, CheckCircle2, PlayCircle, Clock, ArrowRight, Zap } from 'lucide-react';
import { progressService } from '../services/progressService';
import { getMyQuizAttempts } from '../services/quizService';
import { courseService } from '../services/courseService';
import { ROUTES } from '../constants/routes';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [progresses, setProgresses] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progressRes, attemptsRes, coursesRes] = await Promise.all([
          progressService.getAllProgress().catch(() => ({ progresses: [] })),
          getMyQuizAttempts().catch(() => ({ attempts: [] })),
          courseService.getAllCourses().catch(() => ({ courses: [] }))
        ]);
        
        setProgresses(progressRes.progresses || []);
        setAttempts(attemptsRes.attempts || []);
        setAllCourses(coursesRes.courses || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Compute Statistics
  const stats = useMemo(() => {
    let enrolled = progresses.length;
    let completed = progresses.filter(p => p.progressPercentage === 100 || (p.isLegacyCompleted)).length;
    let lessons = progresses.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0);
    let quizPasses = attempts.filter(a => a.isPassed).length;

    return { enrolled, completed, lessons, quizPasses };
  }, [progresses, attempts]);

  // Compute In-Progress Courses
  const inProgressCourses = useMemo(() => {
    return progresses
      .filter(p => p.progressPercentage > 0 && p.progressPercentage < 100)
      .slice(0, 3);
  }, [progresses]);

  // Compute Recommended Courses (Courses user hasn't enrolled in)
  const recommendedCourses = useMemo(() => {
    const enrolledIds = new Set(progresses.map(p => p.course?._id));
    return allCourses.filter(c => !enrolledIds.has(c._id)).slice(0, 3);
  }, [allCourses, progresses]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 animate-pulse flex flex-col gap-8 h-full">
        <div className="h-40 bg-[#F1F5F9] rounded-2xl w-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#F1F5F9] rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row h-full min-h-full">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 space-y-10 xl:border-r xl:border-[#E2E8F0] overflow-y-auto">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-3 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-[#FF6B35]">{user?.name?.split(' ')[0] || 'Learner'}</span> 👋
            </h1>
            {stats.enrolled > 0 ? (
              <p className="text-[#CBD5E1] text-lg font-medium leading-relaxed">
                You're making great progress. Continue your learning journey and keep up the momentum!
              </p>
            ) : (
              <p className="text-[#CBD5E1] text-lg font-medium leading-relaxed">
                Start your learning journey today. Explore our curated courses and begin building your skills.
              </p>
            )}
          </div>
          
          <div className="relative z-10 flex gap-4 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
             <div className="text-center px-4 border-r border-white/20">
                <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-1">Learning Hours</p>
                <p className="text-2xl font-bold text-white">{(stats.lessons * 0.5).toFixed(1)}h</p>
             </div>
             <div className="text-center px-4">
                <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-1">Current Streak</p>
                <div className="flex items-center justify-center gap-1 text-[#FF6B35]">
                  <Zap size={20} className="fill-current" />
                  <span className="text-2xl font-bold text-white">{stats.enrolled > 0 ? 3 : 0}</span>
                </div>
             </div>
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none text-[#FF6B35]">
            <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 3.5l7.5 15h-15L12 5.5z"/>
            </svg>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="Courses Enrolled" value={stats.enrolled} icon={BookOpen} color="bg-[#FFF4EE] text-[#FF6B35]" />
          <StatCard title="Courses Completed" value={stats.completed} icon={Award} color="bg-[#F0FDF4] text-[#22C55E]" />
          <StatCard title="Lessons Completed" value={stats.lessons} icon={CheckCircle2} color="bg-[#F8FAFC] text-[#0F172A]" />
          <StatCard title="Quiz Passes" value={stats.quizPasses} icon={CheckCircle2} color="bg-[#FFFBEB] text-[#F59E0B]" />
        </div>

        {/* Continue Learning */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Continue Learning</h2>
            {inProgressCourses.length > 0 && (
              <Link to={ROUTES.MY_LEARNING} className="text-sm font-semibold text-[#FF6B35] hover:text-[#E85D2C] flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((prog) => (
                <div key={prog._id} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-32 bg-[#F1F5F9] relative overflow-hidden shrink-0">
                     {prog.course?.thumbnail ? (
                        <img src={`/banner/${prog.course.thumbnail}`} alt={prog.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                           <BookOpen size={32} />
                        </div>
                     )}
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-lg text-[#0F172A] shadow-sm">
                       {prog.progressPercentage}%
                     </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-[#0F172A] mb-1 line-clamp-1">{prog.course?.title || 'Course Name'}</h3>
                    <p className="text-sm text-[#64748B] mb-4">{prog.completedLessons?.length || 0} / {prog.course?.lessons?.length || 0} Lessons</p>
                    
                    <div className="w-full bg-[#F1F5F9] rounded-full h-2 mb-5 overflow-hidden">
                      <div className="bg-[#FF6B35] h-2 rounded-full transition-all duration-1000" style={{ width: `${prog.progressPercentage}%` }}></div>
                    </div>

                    <div className="mt-auto">
                      <Link to={ROUTES.COURSE_DETAIL_PATH(prog.course?._id)} className="flex w-full items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#FF6B35] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#FF6B35] font-semibold py-2.5 rounded-xl transition-colors text-sm">
                        <PlayCircle size={18} />
                        Resume
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
                <PlayCircle className="text-[#94A3B8] w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">No active courses</h3>
              <p className="text-[#64748B] mb-6 max-w-sm mx-auto">You haven't started any new courses recently. Explore the catalog to begin learning.</p>
              <Link to={ROUTES.COURSES} className="inline-block px-6 py-2.5 bg-[#FF6B35] text-white font-semibold rounded-xl shadow-[0_4px_14px_0_rgba(255,107,53,0.39)] hover:bg-[#E85D2C] hover:shadow-[0_6px_20px_rgba(255,107,53,0.23)] hover:-translate-y-0.5 transition-all">
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map(course => (
                <Link key={course._id} to={ROUTES.COURSE_DETAIL_PATH(course._id)} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col">
                  <div className="h-32 bg-[#F1F5F9] relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={`/banner/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#94A3B8]"><BookOpen size={32} /></div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] mb-2">{course.category}</span>
                    <h3 className="font-bold text-[#0F172A] mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-[#64748B] mt-auto">
                      <span className="flex items-center gap-1"><Clock size={14}/> {course.duration} mins</span>
                      <span className="flex items-center gap-1"><BookOpen size={14}/> {course.lessons?.length || 0} lessons</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Panel (Hidden on mobile & tablet, visible on XL) */}
      <div className="hidden xl:block w-80 bg-white p-8 overflow-y-auto shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
        
        {/* User Summary */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#FFE8DE] to-[#FED7AA] flex items-center justify-center text-[#FF6B35] font-bold text-4xl shadow-sm border-4 border-white relative mb-4 ring-1 ring-[#E2E8F0]">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            <div className="absolute bottom-0 right-1 w-5 h-5 bg-[#22C55E] border-2 border-white rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">{user?.name || 'User'}</h2>
          <p className="text-sm text-[#64748B] font-medium mt-1">Student</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="text-center">
              <p className="text-xl font-bold text-[#0F172A]">{stats.enrolled}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Enrolled</p>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]"></div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#0F172A]">{stats.completed}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Completed</p>
            </div>
          </div>
        </div>

        <hr className="border-[#E2E8F0] mb-8" />

        {/* Recent Activity */}
        <h3 className="text-lg font-bold text-[#0F172A] mb-5 tracking-tight">Recent Activity</h3>
        <div className="space-y-5">
          {attempts.length > 0 || progresses.length > 0 ? (
            <>
              {attempts.slice(0, 3).map((attempt, idx) => (
                <div key={`attempt-${idx}`} className="flex gap-4">
                  <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${attempt.isPassed ? 'bg-[#F0FDF4] text-[#22C55E]' : 'bg-[#FEF2F2] text-[#EF4444]'}`}>
                    {attempt.isPassed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] leading-tight mb-1">
                      {attempt.isPassed ? 'Passed Quiz' : 'Attempted Quiz'}
                    </p>
                    <p className="text-xs text-[#64748B] line-clamp-1">{attempt.courseId?.title || 'Course'}</p>
                    <p className="text-[10px] font-medium text-[#94A3B8] mt-1">{new Date(attempt.completedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-[#64748B] text-sm py-4">No recent activity found.</p>
          )}
        </div>

        <hr className="border-[#E2E8F0] my-8" />

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-[#0F172A] mb-4 tracking-tight">Quick Actions</h3>
        <div className="space-y-3">
          <Link to={ROUTES.COURSES} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all group">
            <span className="text-sm font-semibold text-[#0F172A]">Browse Catalog</span>
            <ArrowRight size={16} className="text-[#94A3B8] group-hover:text-[#FF6B35] transition-colors" />
          </Link>
          <Link to={ROUTES.DASHBOARD + '/quizzes'} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all group">
            <span className="text-sm font-semibold text-[#0F172A]">View Quiz Results</span>
            <ArrowRight size={16} className="text-[#94A3B8] group-hover:text-[#FF6B35] transition-colors" />
          </Link>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-2 ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] line-clamp-1">{title}</p>
    </div>
  </div>
);

export default DashboardPage;
