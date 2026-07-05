import React from 'react';
import QuizKPIsWidget from '../../components/analytics/widgets/QuizKPIsWidget';
import QuizScoresDistributionWidget from '../../components/analytics/widgets/QuizScoresDistributionWidget';

const AnalyticsQuizzesPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* SECTION: Quiz KPIs */}
      <section aria-label="Quiz Key Performance Indicators">
        <QuizKPIsWidget />
      </section>

      {/* SECTION: Quiz Distribution */}
      <section aria-label="Quiz Scores Distribution">
        <QuizScoresDistributionWidget />
      </section>
    </div>
  );
};

export default AnalyticsQuizzesPage;
