import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle2, PlayCircle, AlertCircle, FileText, Lock } from 'lucide-react';
import { courseService } from '../services/courseService';
import { progressService } from '../services/progressService';
import FooterSection from '../components/landing/FooterSection';
import { useAuth } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data.course || data);

        try {
          const prog = await progressService.getProgress(id);
          if (prog && Array.isArray(prog.completedLessons)) {
            setProgress(prog.completedLessons);
            setProgressPercentage(prog.progressPercentage || 0);
          }
        } catch (progErr) {
          console.log('No progress found or error fetching progress.');
        }
      } catch (err) {
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
    window.scrollTo(0, 0);
  }, [id, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)] items-center justify-center">
        <div className="animate-pulse w-16 h-16 bg-orange-200 rounded-full"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)] items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center p-12 bg-red-50 text-red-600 rounded-[28px] max-w-2xl w-full border border-red-100 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
          <h3 className="text-2xl font-bold mb-2">Course Not Found</h3>
          <p className="mb-8 text-red-700/80">{error || "The course you're looking for doesn't exist."}</p>
          <Link to="/courses" className="bg-red-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-red-700 transition-colors shadow-sm">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.lessons ? course.lessons.length : 0;
  const completedCount = progress.length;
  
  // Create progress bar string (10 blocks total)
  const filledBlocks = Math.round((progressPercentage / 100) * 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-[fadeIn_0.5s_ease-out]">
      
      {/* Course Hero Banner */}
      <section className="w-full bg-[#FAFAFA] border-b border-stone-200/80 pt-16 pb-16 lg:py-20 flex flex-col justify-center">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="w-full md:w-[55%] flex flex-col items-start text-left">
              <div className="mb-5">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[14px] font-bold rounded-full border border-orange-200 shadow-sm uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-primary-text)] tracking-tight mb-6 leading-[1.1] max-w-[700px]">
                {course.title}
              </h1>
              
              <p className="text-[17px] md:text-[19px] text-[var(--color-secondary-text)] mb-8 line-clamp-3 leading-relaxed max-w-[650px]">
                {course.description}
              </p>
            </div>
            
            {/* Right Content */}
            <div className="w-full md:w-[45%]">
              <div className="w-full aspect-video md:aspect-[4/3] rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-stone-200/50 group bg-stone-100 flex items-center justify-center relative">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <PlayCircle size={64} className="text-stone-300" />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full py-16 lg:py-24 flex-grow bg-white">
        <div className="max-w-[900px] w-full mx-auto px-5 md:px-8">
          
          {/* Progress Section */}
          <div className="mb-12 p-8 bg-stone-50 rounded-[32px] border border-stone-200 shadow-sm">
            <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-orange-500" /> Course Progress
            </h3>
            <div className="text-[20px] tracking-[0.2em] font-mono text-orange-500 mb-2">
              {progressBar} {progressPercentage}%
            </div>
            <p className="text-[15px] font-medium text-stone-600">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>

          {/* Lessons Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">
              Lessons
            </h2>
            <div className="flex flex-col gap-4">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, idx) => {
                  const isCompleted = progress.includes(lesson._id || lesson.title);
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200 rounded-[20px] hover:border-stone-300 transition-colors shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 size={22} className="text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-stone-300"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[var(--color-primary-text)] mb-1">
                            {idx + 1}. {lesson.title}
                          </p>
                          {lesson.duration && (
                            <span className="text-[14px] text-stone-500 flex items-center gap-1.5">
                              <Clock size={14} /> {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        disabled
                        className="flex items-center justify-center gap-2 bg-stone-100 text-stone-400 border border-stone-200 px-5 py-2.5 rounded-xl text-[14px] font-semibold w-full sm:w-auto cursor-not-allowed"
                      >
                        <Lock size={16} />
                        Video Coming Soon
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-stone-500">No lessons available.</p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">
              Notes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.notes && course.notes.length > 0 ? (
                course.notes.map((note, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[20px] hover:border-orange-200 transition-colors shadow-sm cursor-pointer group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <FileText className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[var(--color-primary-text)] mb-1">
                        {note.title}
                      </h4>
                      <span className="text-[13px] text-stone-500 font-medium">Download PDF</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-stone-500">No notes available.</p>
              )}
            </div>
          </div>
          
        </div>
      </section>

      <FooterSection />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default CourseDetailPage;
