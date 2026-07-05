import React from 'react';
import { useQuizAnalytics } from '../../../hooks/analytics/useQuizAnalytics';
import { MetricCard } from '../cards/MetricCard';


const QuizKPIsWidget = () => {
  const { data, isLoading, error, refetch } = useQuizAnalytics();
  
  // Backend returns: { quizStarts, quizSubmissions, passRate, failRate, averageScore, ... }
  const quizStarts = data?.quizStarts ?? 0;
  const passRate = data?.passRate != null ? `${data.passRate}%` : '0%';
  const avgScore = data?.averageScore != null ? `${data.averageScore}%` : '0%';
  const failRate = data?.failRate != null ? `${data.failRate}%` : '0%';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Total Quiz Starts" 
        value={quizStarts} 
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Avg Score" 
        value={avgScore} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Pass Rate" 
        value={passRate} 
        isPositive={true}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
      <MetricCard 
        title="Fail Rate" 
        value={failRate}
        isPositive={false}
        loading={isLoading} 
        error={error} 
        refetch={refetch} 
      />
    </div>
  );
};

export default QuizKPIsWidget;
