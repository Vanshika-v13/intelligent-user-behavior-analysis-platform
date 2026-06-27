import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../../hooks/queries/useCourses';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { Clock, BookOpen, Users, Activity, BarChart, ArrowLeft } from 'lucide-react';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading, isError } = useCourse(id);

  if (isLoading) return <PageLoader />;
  
  if (isError || !course) {
    return (
      <div className="py-12">
        <EmptyState 
          title="Course not found" 
          description="The course you are looking for does not exist or has been removed."
          action={
            <Button onClick={() => navigate(ROUTES.COURSES)}>
              Back to Courses
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.COURSES)} className="text-[var(--color-muted-text)] hover:text-gray-900 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      {/* Course Hero */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <Badge variant="primary" className="w-fit mb-4">{course.category || 'General'}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {course.title}
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              {course.description || "Master the concepts and practical applications taught in this comprehensive module designed for continuous learning."}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{course.duration || '4h 30m'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{course.modules || 12} Modules</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 lg:h-auto bg-gray-100 hidden sm:block">
            <img 
              src={`https://placehold.co/800x600/2563EB/FFF?text=${encodeURIComponent(course.title)}`} 
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>

      {/* Analytics Preview Card */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow duration-300 border-l-4 border-l-primary">
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-sm font-medium text-[var(--color-muted-text)]">Enrolled Users</h3>
               <div className="p-2 bg-blue-50 rounded-lg text-primary">
                 <Users className="w-5 h-5" />
               </div>
             </div>
             <div className="text-3xl font-bold text-gray-900">1,248</div>
             <p className="text-sm text-green-600 mt-2 flex items-center font-medium">
               <Activity className="w-4 h-4 mr-1" /> +12% this week
             </p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow duration-300 border-l-4 border-l-secondary">
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-sm font-medium text-[var(--color-muted-text)]">Average Session Duration</h3>
               <div className="p-2 bg-green-50 rounded-lg text-secondary">
                 <Clock className="w-5 h-5" />
               </div>
             </div>
             <div className="text-3xl font-bold text-gray-900">18m 42s</div>
             <p className="text-sm text-green-600 mt-2 flex items-center font-medium">
               <Activity className="w-4 h-4 mr-1" /> +3% this week
             </p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow duration-300 border-l-4 border-l-accent">
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-sm font-medium text-[var(--color-muted-text)]">Engagement Score</h3>
               <div className="p-2 bg-orange-50 rounded-lg text-accent">
                 <BarChart className="w-5 h-5" />
               </div>
             </div>
             <div className="text-3xl font-bold text-gray-900">8.4<span className="text-lg text-gray-400 font-medium">/10</span></div>
             <p className="text-sm text-gray-500 mt-2 flex items-center">
                Consistently high engagement
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
