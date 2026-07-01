import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, PlayCircle, Award, Clock } from 'lucide-react';
import { progressService } from '../services/progressService';
import { ROUTES } from '../constants/routes';

const MyLearningPage = () => {
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressService.getAllProgress();
        setProgresses(data.progresses || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load learning progress", err);
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const inProgress = useMemo(() => {
    return progresses.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100);
  }, [progresses]);

  const completed = useMemo(() => {
    return progresses.filter(p => p.progressPercentage === 100 || p.isLegacyCompleted);
  }, [progresses]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 animate-pulse space-y-8">
        <div className="h-20 bg-[#F1F5F9] rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-[#F1F5F9] rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-12 animate-[fadeIn_0.5s_ease-out] max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">My Learning</h1>
        <p className="text-[#64748B] text-lg max-w-2xl">Track your progress, resume your courses, and view your completed achievements.</p>
      </div>

      {progresses.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 shadow-sm text-center flex flex-col items-center">
          <div className="w-24 h-24 mb-6 bg-[#F8FAFC] rounded-2xl flex items-center justify-center border border-[#E2E8F0]">
            <BookOpen className="text-[#94A3B8] w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">You haven't started learning yet.</h2>
          <p className="text-[#64748B] mb-8 max-w-md">Explore our wide range of premium courses and begin your journey towards mastering new skills today.</p>
          <Link 
            to={ROUTES.COURSES}
            className="px-8 py-3.5 bg-[#FF6B35] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(255,107,53,0.39)] hover:bg-[#E85D2C] hover:shadow-[0_6px_20px_rgba(255,107,53,0.23)] hover:-translate-y-0.5 transition-all"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          {/* In Progress */}
          {inProgress.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">In Progress</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgress.map((prog) => (
                  <CourseProgressCard key={prog._id} prog={prog} />
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Completed Courses</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((prog) => (
                  <CourseProgressCard key={prog._id} prog={prog} isCompleted />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

const CourseProgressCard = ({ prog, isCompleted }) => {
  const course = prog.course;
  const lessonsCompleted = prog.completedLessons?.length || 0;
  const totalLessons = course?.lessons?.length || 0;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full hover:-translate-y-1">
      {/* Banner */}
      <div className="h-40 bg-[#F1F5F9] relative overflow-hidden shrink-0">
        {course?.thumbnail ? (
          <img src={`/banner/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
            <BookOpen size={40} />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
           <div className={`backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm ${
             isCompleted ? 'bg-[#22C55E]/90 text-white' : 'bg-white/90 text-[#0F172A]'
           }`}>
             {prog.progressPercentage}%
           </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] mb-2 block">{course?.category || 'Category'}</span>
        <h3 className="font-bold text-lg text-[#0F172A] mb-3 line-clamp-2 leading-tight">{course?.title || 'Course Name'}</h3>
        
        {/* Progress Info */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm font-medium mb-2">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <CheckCircle2 size={16} className={isCompleted ? "text-[#22C55E]" : "text-[#94A3B8]"} />
              {lessonsCompleted} / {totalLessons} Lessons
            </span>
            {prog.quizPassed && (
              <span className="text-[#22C55E] flex items-center gap-1 text-xs font-bold bg-[#F0FDF4] px-2 py-0.5 rounded-md">
                <Award size={14} />
                Quiz Passed
              </span>
            )}
          </div>
          
          <div className="w-full bg-[#F1F5F9] rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-[#22C55E]' : 'bg-[#FF6B35]'}`} 
              style={{ width: `${prog.progressPercentage}%` }}
            ></div>
          </div>

          {/* Action Button */}
          <Link 
            to={ROUTES.COURSE_DETAIL_PATH(course?._id)} 
            className={`flex w-full items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all ${
              isCompleted
                ? 'bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                : 'bg-[#FF6B35] text-white shadow-[0_4px_14px_0_rgba(255,107,53,0.3)] hover:bg-[#E85D2C] hover:shadow-[0_6px_20px_rgba(255,107,53,0.2)]'
            }`}
          >
            {isCompleted ? (
              <>
                <Award size={18} className="text-[#22C55E]" />
                Review Course
              </>
            ) : (
              <>
                <PlayCircle size={18} />
                Continue Learning
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;
