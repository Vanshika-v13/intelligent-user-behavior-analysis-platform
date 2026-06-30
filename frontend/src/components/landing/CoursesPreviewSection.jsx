import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, AlertCircle } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { ROUTES } from '../../constants/routes';

const CoursesPreviewSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        // Just take the first 3 or 6 courses if we want a preview, assuming backend returns all.
        setCourses(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section id="courses-preview" className="w-full bg-[var(--color-background)] py-16 xl:max-h-[90vh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        {/* Heading */}
        <div className="text-left md:text-center mb-[48px]">
          <h2 className="text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
            Start Learning Today
          </h2>
          <p className="text-[15px] md:text-[16px] text-[var(--color-secondary-text)] md:max-w-[650px] md:mx-auto">
            Explore curated learning experiences designed to help you grow step by step.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px] mb-[40px]">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-100 rounded-[28px] h-[400px] shadow-sm animate-pulse flex flex-col">
                <div className="w-full h-[180px] bg-gray-200 rounded-t-[28px]"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-20 h-6 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-auto"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50 text-red-600 rounded-[28px] mb-[40px] max-w-2xl mx-auto border border-red-100">
            <AlertCircle className="w-8 h-8 mb-3 text-red-500" />
            <p className="text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 underline font-medium hover:text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-[28px] mb-[40px] border border-gray-200">
            <p className="text-[var(--color-secondary-text)]">No courses available at the moment.</p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px] mb-[40px]">
            {courses.map((course, index) => {
              const id = course.id || index;
              const title = course.title || 'Untitled Course';
              const description = course.description || 'No description available for this course.';
              const category = course.category || 'General';
              const duration = course.duration || '2h 30m';
              const lessonsCount = course.lessonsCount || '10 lessons';
              const thumbnail = course.thumbnail || course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';

              return (
                <div
                  key={id}
                  className="group bg-white border border-stone-200/60 rounded-[28px] h-[380px] sm:h-[400px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-[300ms] flex flex-col overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="w-full h-[180px] overflow-hidden rounded-t-[28px]">
                    <img
                      src={thumbnail}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">
                        {category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-[var(--color-primary-text)] mb-2 line-clamp-2 leading-tight">
                      {title}
                    </h3>
                    
                    <p className="text-sm text-[var(--color-secondary-text)] mb-auto line-clamp-3">
                      {description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary-text)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary-text)]">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{lessonsCount}</span>
                      </div>
                    </div>

                    <Link
                      to={ROUTES.COURSE_DETAIL_PATH(id)}
                      className="mt-4 w-full block text-center bg-gray-50 text-[var(--color-primary-text)] border border-gray-200 px-4 py-2.5 rounded-[12px] text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      Start Learning
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center">
          <Link 
            to="/courses" 
            className="inline-flex items-center justify-center bg-[var(--color-primary-text)] text-[var(--color-background)] px-8 py-4 text-[15px] font-medium hover:bg-[#333] hover:scale-[1.02] active:scale-[0.98] transition-all duration-[250ms] rounded-none shadow-sm"
          >
            View All Courses
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CoursesPreviewSection;
