import React, { Suspense } from 'react';
import { useCourseAnalytics } from '../../../hooks/analytics/useCourseAnalytics';
import { useCourseList } from '../../../hooks/analytics/useCourseList';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ChartTooltip
} from '../charts/ChartPrimitives';

// Backend contract:
// GET /api/v2/analytics/courses
// Returns: {
//   enrollments: [{ courseId, enrollments }],
//   ...
// }

const COLORS = [
  'var(--color-primary, #3b82f6)',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#6366f1',
  '#ec4899',
];


const CourseEnrollmentTrendWidget = () => {
  const { data, isLoading, error, refetch } = useCourseAnalytics();
  const { courses: allCourses } = useCourseList();

  // FIX: Old widget used data?.enrollmentTrend (doesn't exist).
  // Correct source: data?.enrollments (array of courseId and enrollments)
  const rawEnrollments = data?.enrollments || [];

  // Create a map of course names for display
  const courseMap = allCourses.reduce((acc, c) => {
    acc[c.id] = c.title;
    return acc;
  }, {});

  // Prepare chart data and map course IDs to titles
  const chartData = rawEnrollments.slice(0, 10).map(e => ({
    courseId: e.courseId,
    title: courseMap[e.courseId] || e.courseId || 'Unknown',
    enrollments: e.enrollments || 0,
  }));

  const isEmpty = !isLoading && !error && chartData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Top Courses by Enrollment" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty} 
      emptyMessage="No enrollment data available."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <div className="w-full h-[320px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-text">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-muted)', fontSize: 11, fontWeight: 500 }} 
              />
              <YAxis 
                type="category" 
                dataKey="title" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-primary-text)', fontSize: 11 }}
                width={120}
                tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-muted)', opacity: 0.08 }} />
              <Bar dataKey="enrollments" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={true} animationDuration={1000}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
      <p className="text-xs text-muted mt-2">Top courses ranked by total number of lesson starts.</p>
    </Card>
  );
};

export default CourseEnrollmentTrendWidget;
