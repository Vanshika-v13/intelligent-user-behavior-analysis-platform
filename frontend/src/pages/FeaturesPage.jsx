import React from 'react';
import { CheckCircle, BarChart, Layout, PlayCircle } from 'lucide-react';
import FooterSection from '../components/landing/FooterSection';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-[32px] border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold text-[var(--color-primary-text)] mb-4">{title}</h3>
    <p className="text-[17px] text-[var(--color-secondary-text)] leading-relaxed">{description}</p>
  </div>
);

const FeaturesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-[fadeIn_0.5s_ease-out]">
      {/* Hero Section */}
      <section className="w-full bg-[#FAFAFA] border-b border-stone-200/80 pt-20 pb-24 flex flex-col justify-center items-center text-center">
        <div className="max-w-[800px] w-full mx-auto px-5 md:px-8">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[14px] font-bold rounded-full border border-orange-200 shadow-sm uppercase tracking-wider mb-6">
            Features
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-primary-text)] tracking-tight mb-6 leading-[1.1]">
            Learn Better With Interactive Education
          </h1>
          <p className="text-[19px] text-[var(--color-secondary-text)] mb-10 leading-relaxed max-w-[650px] mx-auto">
            Everything you need to build knowledge and track your learning journey.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 flex-grow">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={PlayCircle}
              title="Interactive Video Lessons"
              description="Engage with high-quality video content that puts you in the center of the learning experience, designed for retention and practical application."
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Practice Quizzes"
              description="Test your knowledge immediately after learning with interactive quizzes that reinforce key concepts and ensure true understanding."
            />
            <FeatureCard 
              icon={Layout}
              title="Structured Learning Paths"
              description="Follow expertly curated curriculum paths that guide you step-by-step from foundational concepts to advanced mastery."
            />
            <FeatureCard 
              icon={BarChart}
              title="Progress Tracking"
              description="Visualize your learning journey with comprehensive analytics. Track completed lessons, time spent, and maintain learning streaks."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-stone-900 text-white mt-auto">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-[19px] text-stone-400 mb-10 max-w-[600px]">
            Join thousands of learners building their skills on our platform today.
          </p>
          <Link to="/courses" className="bg-orange-500 text-white px-10 py-4 rounded-full text-[16px] font-bold hover:bg-orange-600 transition-all shadow-sm">
            Explore Courses
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FeaturesPage;
