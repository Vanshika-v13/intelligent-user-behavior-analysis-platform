import React, { Suspense } from 'react';
import { useQuizAnalytics } from '../../../hooks/analytics/useQuizAnalytics';
import { Card } from '../cards/Card';
import { WidgetHeader } from '../shared/WidgetHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  commonXAxisProps, commonYAxisProps, commonGridProps
} from '../charts/ChartPrimitives';


// Backend contract:
// GET /api/v2/analytics/quizzes
// Returns: {
//   byQuiz: [{ quizId, averageScore, attempts, passRate, failRate }],
//   ...
// }

const COLORS = [
  'var(--color-primary, #3b82f6)',
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-border/60 rounded-soft shadow-premium p-3 text-sm">
        <p className="font-semibold text-primary-text mb-1 text-xs truncate max-w-[200px]">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted text-xs">Avg Score:</span>
            <span className="font-semibold text-primary-text text-xs">{payload[0]?.value}%</span>
          </div>
          {payload[0]?.payload?.attempts && (
             <div className="text-xs text-muted mt-1 ml-4">
               {payload[0].payload.attempts} attempts
             </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const QuizScoresDistributionWidget = () => {
  const { data, isLoading, error, refetch } = useQuizAnalytics();
  
  // FIX: Old widget used data?.scoresDistribution (doesn't exist)
  // Correct source: data?.byQuiz
  const rawQuizzes = data?.byQuiz || [];

  const chartData = rawQuizzes.slice(0, 8).map((q, index) => ({
    quizId: q.quizId || `Quiz ${index + 1}`,
    averageScore: q.averageScore || 0,
    attempts: q.attempts || 0,
  }));

  const isEmpty = !isLoading && !error && chartData.length === 0;

  return (
    <Card 
      title={<WidgetHeader title="Average Scores by Quiz" />} 
      loading={isLoading} 
      error={error} 
      empty={isEmpty}
      emptyMessage="No quiz score data available for this period."
      onRetry={refetch}
      className="min-h-[400px]"
    >
      <div className="w-full h-[320px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted">Loading Chart...</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid {...commonGridProps} />
              <XAxis 
                dataKey="quizId" 
                {...commonXAxisProps}
                angle={-45}
                textAnchor="end"
                tickFormatter={(v) => v.length > 12 ? v.substring(0, 12) + '...' : v}
              />
              <YAxis 
                {...commonYAxisProps}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)', opacity: 0.08 }} />
              <Bar dataKey="averageScore" radius={[4, 4, 0, 0]} barSize={35} isAnimationActive={true} animationDuration={1000}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Suspense>
      </div>
      <p className="text-xs text-center text-muted mt-4">Average score achieved for the top most attempted quizzes.</p>
    </Card>
  );
};

export default QuizScoresDistributionWidget;
