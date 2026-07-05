import React, { useMemo } from 'react';
import { useCourseAnalytics } from '../../../hooks/analytics/useCourseAnalytics';
import { useCourseList } from '../../../hooks/analytics/useCourseList';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import { TableContainer, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../tables/AnalyticsTable';


// Backend contract:
// GET /api/v2/analytics/courses
// Returns: {
//   enrollments: [{ courseId, enrollments }],
//   completionRates: [{ courseId, totalUsers, completedUsers, completionRate, averageProgress }],
//   ...
// }

const CourseAnalyticsTableWidget = () => {
  const { data, isLoading, error, refetch } = useCourseAnalytics();
  const { courses: allCourses } = useCourseList();

  // We have completionRates and enrollments. Let's merge them by courseId.
  const completionRates = data?.completionRates || [];
  const enrollments = data?.enrollments || [];

  // Create a map of course names for display
  const courseMap = useMemo(() => {
    return allCourses.reduce((acc, c) => {
      acc[c.id] = c.title;
      return acc;
    }, {});
  }, [allCourses]);

  // Merge data
  const tableData = useMemo(() => {
    return completionRates.map(cr => {
      const enrollmentData = enrollments.find(e => e.courseId === cr.courseId);
      return {
        courseId: cr.courseId,
        title: courseMap[cr.courseId] || cr.courseId || 'Unknown Course',
        totalUsers: cr.totalUsers || 0,
        completedUsers: cr.completedUsers || 0,
        completionRate: cr.completionRate || 0,
        averageProgress: cr.averageProgress || 0,
        enrollments: enrollmentData ? enrollmentData.enrollments : 0,
      };
    }).sort((a, b) => b.enrollments - a.enrollments); // Sort by enrollments descending
  }, [completionRates, enrollments, courseMap]);

  const isEmpty = !isLoading && !error && tableData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Course Performance Analytics" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty}
      emptyMessage="No course performance data available."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <TableContainer>
        <TableHeader>
          <TableHead>Course Title</TableHead>
          <TableHead align="right">Enrollments</TableHead>
          <TableHead align="right">Active Users</TableHead>
          <TableHead align="right">Completions</TableHead>
          <TableHead align="right">Completion %</TableHead>
          <TableHead className="w-1/4">Avg Progress</TableHead>
        </TableHeader>
        <TableBody>
          {tableData.map((course, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-primary-text">{course.title}</TableCell>
              <TableCell align="right" className="text-muted-text">{course.enrollments.toLocaleString()}</TableCell>
              <TableCell align="right" className="text-muted-text">{course.totalUsers.toLocaleString()}</TableCell>
              <TableCell align="right" className="text-muted-text">{course.completedUsers.toLocaleString()}</TableCell>
              <TableCell align="right">
                <span className={`font-semibold ${course.completionRate > 75 ? 'text-success' : course.completionRate > 40 ? 'text-warning' : 'text-error'}`}>
                  {course.completionRate}%
                </span>
              </TableCell>
              <TableCell className="w-1/4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${course.averageProgress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted font-medium w-8 text-right">{course.averageProgress || 0}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </Card>
  );
};

export default CourseAnalyticsTableWidget;
