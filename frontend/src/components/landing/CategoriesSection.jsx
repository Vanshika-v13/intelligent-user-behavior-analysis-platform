import React from 'react';
import { ArrowRight, Code, Terminal, Database, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Database',
    slug: 'database',
    icon: Database,
    theme: { bg: 'bg-stone-50', border: 'border-stone-200/50', iconBg: 'bg-stone-200', iconColor: 'text-stone-700' }
  },
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    icon: Wrench,
    theme: { bg: 'bg-orange-50/50', border: 'border-orange-100/50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
  },
  {
    name: 'Programming',
    slug: 'programming',
    icon: Terminal,
    theme: { bg: 'bg-[#FCFBF8]', border: 'border-amber-100/50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' }
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    icon: Code,
    theme: { bg: 'bg-[#FFF6F0]', border: 'border-orange-100/50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
  }
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="w-full bg-[var(--color-background)] py-12 md:py-16 lg:py-20 flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="text-left md:text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
            Explore Learning Categories
          </h2>
          <p className="text-[15px] md:text-[16px] text-[var(--color-secondary-text)] md:max-w-[600px] md:mx-auto">
            Choose topics that match your interests and start learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            const theme = cat.theme;
            
            return (
              <Link
                key={index}
                to={`/courses?category=${cat.slug}`}
                className={`
                  w-full flex-shrink-0 
                  ${theme.bg} border ${theme.border}
                  rounded-[24px] p-6 h-[150px]
                  shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-white/90
                  transition-all duration-[300ms] group flex flex-col justify-between
                  relative overflow-hidden
                `}
              >
                {/* Subtle gradient background for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 w-[56px] h-[56px] rounded-[18px] flex items-center justify-center ${theme.iconBg} group-hover:bg-[var(--color-primary-text)] transition-colors duration-[300ms]">
                  <IconComponent className={`w-6 h-6 ${theme.iconColor} group-hover:text-[var(--color-background)]`} strokeWidth={2} />
                </div>
                
                <div className="relative z-10 flex items-center justify-between w-full">
                  <h3 className="text-[17px] font-semibold text-[var(--color-primary-text)] truncate pr-2">
                    {cat.name}
                  </h3>
                  <div className="w-6 h-6 flex items-center justify-center text-[var(--color-secondary-text)] group-hover:text-[var(--color-primary-text)] transform group-hover:translate-x-2 transition-all duration-[300ms]">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/courses" 
            className="inline-flex items-center justify-center bg-[var(--color-primary-text)] text-[var(--color-background)] px-8 py-4 text-[15px] font-medium hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-[250ms] rounded-none shadow-sm hover:shadow-md"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
