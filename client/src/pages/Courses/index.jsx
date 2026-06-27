import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/queries/useCourses';
import { ROUTES } from '../../constants/routes';
import PageHeader from '../../components/dashboard/PageHeader';
import SearchBar from '../../components/dashboard/SearchBar';
import FilterBar from '../../components/dashboard/FilterBar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorFallback from '../../components/ui/ErrorFallback';
import PageLoader from '../../components/ui/PageLoader';
import Badge from '../../components/ui/Badge';
import { BookOpen, Clock, Users } from 'lucide-react';

const COURSE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'development' },
  { label: 'Business', value: 'business' },
];

export default function Courses() {
  const navigate = useNavigate();
  const { data: courses, isLoading, isError, error, refetch } = useCourses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || course.category?.toLowerCase() === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [courses, searchTerm, activeFilter]);

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorFallback error={error} resetErrorBoundary={refetch} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <PageHeader 
        title="Courses" 
        description="Browse all available courses and track engagement metrics."
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <SearchBar 
          placeholder="Search courses by title or description..." 
          onSearch={setSearchTerm} 
          className="max-w-md w-full"
        />
      </div>

      <FilterBar 
        filters={COURSE_FILTERS}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
        onReset={() => {
          setActiveFilter('all');
          setSearchTerm('');
        }}
      />

      {!filteredCourses?.length ? (
        <EmptyState 
          title="No courses found" 
          description="Try adjusting your search or filter to find what you're looking for."
          action={
            <Button variant="outline" onClick={() => { setActiveFilter('all'); setSearchTerm(''); }}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Thumbnail */}
              <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                <img 
                  src={`https://placehold.co/600x400/2563EB/FFF?text=${encodeURIComponent(course.title)}`} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                   <h3 className="text-lg font-bold text-gray-900 line-clamp-2" title={course.title}>
                    {course.title}
                   </h3>
                   <Badge variant="primary" className="shrink-0">{course.category || 'General'}</Badge>
                </div>
                
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">
                  {course.description || "Learn the fundamentals and advanced concepts in this comprehensive course."}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                   <div className="flex items-center gap-1.5 border border-gray-100 bg-gray-50 px-2 py-1 rounded-md">
                     <Clock className="w-4 h-4 text-gray-400" />
                     <span>{course.duration || '4h 30m'}</span>
                   </div>
                   <div className="flex items-center gap-1.5 border border-gray-100 bg-gray-50 px-2 py-1 rounded-md">
                     <BookOpen className="w-4 h-4 text-gray-400" />
                     <span>{course.modules || 12} Mod</span>
                   </div>
                   <div className="flex items-center gap-1.5 border border-gray-100 bg-gray-50 px-2 py-1 rounded-md">
                     <Users className="w-4 h-4 text-gray-400" />
                     <span>{course.students || 0}</span>
                   </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => navigate(ROUTES.COURSE_DETAILS.replace(':id', course.id))}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
