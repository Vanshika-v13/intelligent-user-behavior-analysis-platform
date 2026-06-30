import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, Terminal, Database, Server, Cloud, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';

const iconMap = {
  'Web Development': Code,
  'Programming': Terminal,
  'Data Structures': Database,
  'Databases': Server,
  'Cloud': Cloud,
  'Career Skills': Briefcase,
};

const themeMap = {
  'Web Development': { bg: 'bg-[#FFF6F0]', border: 'border-orange-100/50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  'Programming': { bg: 'bg-[#FCFBF8]', border: 'border-amber-100/50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  'Data Structures': { bg: 'bg-[#F9F6F0]', border: 'border-stone-200/50', iconBg: 'bg-stone-200', iconColor: 'text-stone-700' },
  'Databases': { bg: 'bg-[#F4F4F4]', border: 'border-gray-200', iconBg: 'bg-gray-200', iconColor: 'text-gray-700' },
  'Cloud': { bg: 'bg-gradient-to-br from-orange-50 to-[#FFF6F0]', border: 'border-orange-100/50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  'Career Skills': { bg: 'bg-gradient-to-br from-gray-50 to-stone-50', border: 'border-gray-200', iconBg: 'bg-gray-200', iconColor: 'text-gray-700' },
};

const fallbackTheme = { bg: 'bg-[#F9F6F0]', border: 'border-stone-200/50', iconBg: 'bg-stone-200', iconColor: 'text-stone-700' };

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await courseService.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="categories" className="w-full bg-[var(--color-background)] py-16 xl:max-h-[75vh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="text-left md:text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
            Explore Learning Categories
          </h2>
          <p className="text-[15px] md:text-[16px] text-[var(--color-secondary-text)] md:max-w-[600px] md:mx-auto">
            Choose topics that match your interests and start learning.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-gray-50 border border-gray-100 rounded-[24px] p-6 h-[150px] shadow-sm animate-pulse flex flex-col justify-between">
                <div className="w-14 h-14 bg-gray-200 rounded-[18px]"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-[24px] mb-10 max-w-2xl mx-auto border border-red-100">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 underline font-medium hover:text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-[24px] mb-10 border border-gray-200">
            <p className="text-[var(--color-secondary-text)]">No categories available at the moment.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
            {categories.map((cat, index) => {
              const name = typeof cat === 'string' ? cat : (cat.name || 'Category');
              const slug = typeof cat === 'string' ? cat.toLowerCase().replace(/ /g, '-') : (cat.slug || name.toLowerCase().replace(/ /g, '-'));
              const id = typeof cat === 'string' ? index : (cat.id || index);
              
              const IconComponent = iconMap[name] || Code;
              const theme = themeMap[name] || fallbackTheme;
              
              return (
                <Link
                  key={id}
                  to={`/courses?category=${slug}`}
                  className={`
                    w-[260px] md:w-full flex-shrink-0 snap-center 
                    ${theme.bg} border ${theme.border}
                    rounded-[24px] p-6 h-[150px]
                    shadow-sm hover:shadow-md hover:-translate-y-[6px] hover:scale-[1.02]
                    transition-all duration-[250ms] group flex flex-col justify-between
                  `}
                >
                  <div className={`w-[56px] h-[56px] rounded-[18px] flex items-center justify-center ${theme.iconBg} group-hover:bg-[#333] group-hover:text-[var(--color-background)] transition-colors duration-[250ms]`}>
                    <IconComponent className={`w-6 h-6 ${theme.iconColor} group-hover:text-[var(--color-background)]`} strokeWidth={2} />
                  </div>
                  
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-[17px] font-semibold text-[var(--color-primary-text)] truncate pr-2">
                      {name}
                    </h3>
                    <div className="w-6 h-6 flex items-center justify-center text-[var(--color-secondary-text)] group-hover:text-[var(--color-primary-text)] transform group-hover:translate-x-1 transition-all duration-[250ms]">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link 
            to="/courses" 
            className="inline-flex items-center justify-center bg-[var(--color-primary-text)] text-[var(--color-background)] px-8 py-4 text-[15px] font-medium hover:bg-[#333] hover:scale-[1.02] active:scale-[0.98] transition-all duration-[250ms] rounded-none shadow-sm"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
