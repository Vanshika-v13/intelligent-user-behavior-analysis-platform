import React from 'react';
import { BookOpen, FileQuestion, Route, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Interactive Lessons',
    description: 'Hands-on learning experiences designed for skill development.',
    icon: BookOpen,
    bgClass: 'bg-orange-50/60',
    borderClass: 'border-orange-100/50',
    iconBgClass: 'bg-orange-100',
    iconColorClass: 'text-orange-600'
  },
  {
    title: 'Practice Quizzes',
    description: 'Test your knowledge with bite-sized, interactive assessments.',
    icon: FileQuestion,
    bgClass: 'bg-amber-50/40',
    borderClass: 'border-amber-100/50',
    iconBgClass: 'bg-amber-100',
    iconColorClass: 'text-amber-600'
  },
  {
    title: 'Structured Learning Paths',
    description: 'Follow curated modules to master new technologies.',
    icon: Route,
    bgClass: 'bg-stone-50/60',
    borderClass: 'border-stone-100/50',
    iconBgClass: 'bg-stone-200',
    iconColorClass: 'text-stone-700'
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your achievements and track your learning journey.',
    icon: Target,
    bgClass: 'bg-[var(--color-light-gray)]',
    borderClass: 'border-gray-200/60',
    iconBgClass: 'bg-gray-200',
    iconColorClass: 'text-gray-700'
  },
];

const FeaturesSection = () => {
  return (
    <section 
      id="features" 
      className="w-full bg-[var(--color-background)] py-12 md:py-16 lg:py-20 flex flex-col justify-center xl:min-h-[100vh] xl:max-h-[100vh]"
    >
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 flex flex-col justify-center">
        
        <div className="text-center mb-[32px]">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-[12px]">
            Everything You Need to Learn Better
          </h2>
          <p className="text-[15px] md:text-[16px] text-[var(--color-secondary-text)] max-w-2xl mx-auto">
            Build skills through interactive lessons, quizzes, and progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] max-w-[900px] mx-auto w-full">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`
                ${feature.bgClass} border ${feature.borderClass}
                rounded-[20px] p-[24px] h-[180px] lg:h-[190px] flex flex-col justify-between
                shadow-sm hover:shadow-lg hover:-translate-y-[6px] hover:border-opacity-100
                transition-all duration-[250ms]
              `}
            >
              <div className={`w-[48px] h-[48px] rounded-[16px] flex items-center justify-center ${feature.iconBgClass}`}>
                <feature.icon className={`w-[24px] h-[24px] ${feature.iconColorClass}`} strokeWidth={2} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-primary-text)] mb-1">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[var(--color-secondary-text)] leading-relaxed line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-[32px]">
          <Link 
            to="/features" 
            className="inline-flex items-center justify-center bg-[var(--color-primary-text)] text-[var(--color-background)] px-8 py-4 text-[15px] font-medium hover:bg-[#333] hover:scale-[1.02] active:scale-[0.98] transition-all duration-[250ms] rounded-none shadow-sm"
          >
            Explore Features
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
