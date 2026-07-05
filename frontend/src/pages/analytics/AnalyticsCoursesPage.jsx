import React from 'react';
import CourseEnrollmentTrendWidget from '../../components/analytics/widgets/CourseEnrollmentTrendWidget';
import CourseAnalyticsTableWidget from '../../components/analytics/widgets/CourseAnalyticsTableWidget';
import QuizKPIsWidget from '../../components/analytics/widgets/QuizKPIsWidget';
import VideoKPIsWidget from '../../components/analytics/widgets/VideoKPIsWidget';

const AnalyticsCoursesPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Course KPIs */}
      <section aria-label="Course Sub-component KPIs" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="col-span-1">
            <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Quiz Performance</h2>
            <QuizKPIsWidget />
         </div>
         <div className="col-span-1">
            <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Video Performance</h2>
            <VideoKPIsWidget />
         </div>
      </section>

      {/* SECTION: Top Course Trend */}
      <section aria-label="Course Enrollment Trends">
        <CourseEnrollmentTrendWidget />
      </section>

      {/* SECTION: Course Analytics Table */}
      <section aria-label="Detailed Course Analytics">
        <CourseAnalyticsTableWidget />
      </section>
    </div>
  );
};

export default AnalyticsCoursesPage;
