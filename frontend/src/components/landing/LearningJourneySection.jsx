import React from 'react';
import { Search, BookOpen, PlayCircle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Choose a Domain',
    description: 'Explore our curated categories and find the right path for your career goals.',
    icon: Search,
    color: 'orange'
  },
  {
    title: 'Pick a Course',
    description: 'Select from high-quality, comprehensive courses designed by industry experts.',
    icon: BookOpen,
    color: 'amber'
  },
  {
    title: 'Watch & Learn',
    description: 'Dive into interactive lessons, practical exercises, and real-world projects.',
    icon: PlayCircle,
    color: 'orange'
  },
  {
    title: 'Track Progress',
    description: 'Monitor your learning journey and celebrate milestones as you master new skills.',
    icon: BarChart2,
    color: 'stone'
  }
];

const LearningJourneySection = () => {
  return (
    <section id="journey" className="w-full bg-[var(--color-background)] py-12 md:py-16 lg:py-20 flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="text-left md:text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
            Your Learning Journey
          </h2>
          <p className="text-[15px] md:text-[16px] text-[var(--color-secondary-text)] md:max-w-[600px] md:mx-auto">
            Follow a simple path from discovering a course to mastering new skills.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <div 
                  key={index}
                  className="group bg-white border border-stone-200/50 rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-[300ms] flex flex-col relative overflow-hidden h-full"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-colors duration-[300ms]">
                      <IconComponent size={24} strokeWidth={1.5} />
                    </div>
                    
                    <div className="text-4xl font-bold text-stone-100 group-hover:text-orange-100 transition-colors duration-[300ms]">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-[19px] font-semibold text-[var(--color-primary-text)] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[var(--color-secondary-text)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default LearningJourneySection;
