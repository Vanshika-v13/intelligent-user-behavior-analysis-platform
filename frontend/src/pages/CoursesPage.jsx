import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Clock, BookOpen, ChevronLeft, ChevronRight, Filter, AlertCircle, Inbox } from 'lucide-react';
import { courseService } from '../services/courseService';
import { ROUTES } from '../constants/routes';
import FooterSection from '../components/landing/FooterSection';
import { useAuth } from '../context/AuthContext';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CoursesPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // States for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Status states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await courseService.getCategories();
        setCategories(data || []);
      } catch (err) {
        // Fallback for demo if endpoint isn't fully ready
        if (err.response?.status === 404) {
          setCategories(['Web Development', 'Programming', 'Data Structures', 'Databases', 'Cloud', 'Career Skills']);
        }
      }
    };
    fetchCategories();
  }, []);

  // Fetch Courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: debouncedSearchTerm,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        duration: selectedDuration !== 'All' ? selectedDuration : undefined,
        sort: sortBy,
        page: currentPage,
        limit: 9
      };
      
      const data = await courseService.getAllCourses(params);
      
      if (Array.isArray(data)) {
        setCourses(data);
        setTotalPages(Math.ceil(data.length / 9) || 1);
      } else {
        setCourses(data.courses || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      if (err.response?.status === 404) {
          setCourses([]);
      } else {
        setError('Failed to load courses. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedDuration, sortBy, currentPage]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDuration('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)] items-center justify-center">
        <div className="animate-pulse w-16 h-16 bg-orange-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      
      {/* Header Section */}
      <section className="w-full pt-16 pb-8 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="text-left md:text-center max-w-[700px] md:mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
              Explore Courses
            </h1>
            <p className="text-[16px] md:text-[18px] text-[var(--color-secondary-text)] leading-relaxed">
              Discover interactive learning experiences designed to help you grow step by step.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-[600px] md:mx-auto mb-12 relative">
            <div className="relative flex items-center w-full h-[60px] bg-white rounded-full border border-stone-200 shadow-[0_4px_16px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_24px_rgba(0,0,0,0.08)] focus-within:border-orange-200 transition-all duration-[250ms] overflow-hidden px-4">
              <Search className="w-6 h-6 text-stone-400 ml-2" />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-full bg-transparent border-none outline-none px-4 text-[16px] text-[var(--color-primary-text)] placeholder-stone-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors mr-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="mb-10">
            <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-4 md:pb-0 hide-scrollbar snap-x snap-mandatory">
              <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`}} />
              
              <button
                onClick={() => { setSelectedCategory('All'); setCurrentPage(1); }}
                className={`snap-start flex-shrink-0 px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-[250ms] border ${
                  selectedCategory === 'All' 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                    : 'bg-white text-[var(--color-secondary-text)] border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                All
              </button>
              
              {categories.map((cat, index) => {
                const catName = typeof cat === 'string' ? cat : (cat.name || 'Category');
                const isSelected = selectedCategory === catName;
                return (
                  <button
                    key={index}
                    onClick={() => { setSelectedCategory(catName); setCurrentPage(1); }}
                    className={`snap-start flex-shrink-0 px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-[250ms] border ${
                      isSelected 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                        : 'bg-white text-[var(--color-secondary-text)] border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-12">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <span className="text-[14px] font-medium text-[var(--color-primary-text)]">Duration:</span>
              <select 
                value={selectedDuration}
                onChange={(e) => { setSelectedDuration(e.target.value); setCurrentPage(1); }}
                className="bg-white border border-stone-200 rounded-full px-4 py-2 text-[14px] text-[var(--color-secondary-text)] outline-none focus:border-orange-300 cursor-pointer"
              >
                <option value="All">All Durations</option>
                <option value="Short">Short (&lt; 2h)</option>
                <option value="Medium">Medium (2h - 5h)</option>
                <option value="Long">Long (&gt; 5h)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-[var(--color-primary-text)]">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="bg-white border border-stone-200 rounded-full px-4 py-2 text-[14px] text-[var(--color-secondary-text)] outline-none focus:border-orange-300 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="w-full flex-grow pb-24">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white border border-stone-100 rounded-[28px] h-[400px] shadow-sm animate-pulse flex flex-col">
                  <div className="w-full h-[180px] bg-stone-200 rounded-t-[28px]"></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="w-24 h-6 bg-stone-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-stone-200 rounded w-4/5 mb-3"></div>
                    <div className="h-4 bg-stone-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-stone-200 rounded w-2/3 mb-auto"></div>
                    <div className="h-12 bg-stone-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center p-12 bg-red-50 text-red-600 rounded-[28px] max-w-2xl mx-auto border border-red-100 text-center">
              <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
              <p className="mb-6">{error}</p>
              <button 
                onClick={fetchCourses}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <Inbox className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-primary-text)] mb-3">No courses found</h3>
              <p className="text-[16px] text-[var(--color-secondary-text)] max-w-md mx-auto mb-8">
                We couldn't find any courses matching your current filters. Try adjusting your search or categories.
              </p>
              <button 
                onClick={handleClearFilters}
                className="bg-orange-500 text-white px-8 py-3.5 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px] mb-16">
              {courses.map((course, index) => {
                const id = course.id || index;
                const title = course.title || 'Untitled Course';
                const description = course.description || 'No description available for this course.';
                const category = course.category || 'General';
                const duration = course.duration ? `${course.duration} mins` : 'Unknown';
                const lessonsCount = course.lessons ? `${course.lessons.length} lessons` : '0 lessons';
                const thumbnail = course.thumbnail || course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';

                return (
                  <div
                    key={id}
                    className="group bg-white border border-stone-200/60 rounded-[28px] h-[400px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-[250ms] flex flex-col overflow-hidden animate-[fadeIn_0.5s_ease-out]"
                  >
                    <div className="w-full h-[180px] overflow-hidden rounded-t-[28px] bg-stone-100">
                      <img
                        src={thumbnail}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-[12px] font-semibold rounded-full border border-orange-100">
                          {category}
                        </span>
                      </div>
                      
                      <h3 className="text-[18px] font-bold text-[var(--color-primary-text)] mb-2 line-clamp-2 leading-tight">
                        {title}
                      </h3>
                      
                      <p className="text-[14px] text-[var(--color-secondary-text)] mb-auto line-clamp-3">
                        {description}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-secondary-text)]">
                          <Clock className="w-4 h-4 text-stone-400" />
                          <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-secondary-text)]">
                          <BookOpen className="w-4 h-4 text-stone-400" />
                          <span>{lessonsCount}</span>
                        </div>
                      </div>

                      <Link
                        to={ROUTES.COURSE_DETAIL_PATH(id)}
                        className="mt-5 w-full block text-center bg-stone-50 text-[var(--color-primary-text)] border border-stone-200 px-4 py-3 rounded-[12px] text-[14px] font-semibold hover:bg-stone-100 hover:border-stone-300 transition-colors duration-[200ms]"
                      >
                        Start Learning
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && courses.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center md:justify-center w-full gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (totalPages > 5 && page !== 1 && page !== totalPages && Math.abs(currentPage - page) > 1) {
                    if (Math.abs(currentPage - page) === 2) return <span key={page} className="px-1 text-stone-400">...</span>;
                    return null;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors ${
                        currentPage === page 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
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

export default CoursesPage;
