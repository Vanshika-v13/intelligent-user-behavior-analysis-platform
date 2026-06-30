import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, CheckCircle, BarChart2 } from 'lucide-react';

const LearningJourneySection = () => {
  const steps = [
    {
      title: 'Choose a Course',
      description: 'Find the right learning path.',
      icon: Search
    },
    {
      title: 'Learn Through Lessons',
      description: 'Study interactive lessons at your own pace.',
      icon: BookOpen
    },
    {
      title: 'Practice with Quizzes',
      description: 'Reinforce your understanding.',
      icon: CheckCircle
    },
    {
      title: 'Track Progress',
      description: 'Measure your learning journey.',
      icon: BarChart2
    }
  ];

  return (
    <section id="journey" className="w-full bg-[var(--color-background)] py-16 xl:max-h-[100vh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left: Premium Illustration */}
          <div className="w-full lg:w-[45%]">
            <div className="w-full aspect-square md:aspect-auto md:h-[500px] bg-gradient-to-br from-orange-50 to-stone-50 rounded-[32px] p-8 relative flex items-center justify-center border border-stone-200/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
              
              {/* Dashboard Mockup Component 1 */}
              <div className="absolute top-[10%] left-[10%] w-[60%] bg-white rounded-2xl p-4 shadow-sm border border-stone-100 animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="w-24 h-2.5 bg-stone-200 rounded-full mb-1.5"></div>
                    <div className="w-16 h-2 bg-stone-100 rounded-full"></div>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-orange-500 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard Mockup Component 2 */}
              <div className="absolute top-[40%] right-[10%] w-[50%] bg-white rounded-2xl p-4 shadow-sm border border-stone-100 animate-[float_5s_ease-in-out_infinite_1s]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="w-20 h-2.5 bg-stone-200 rounded-full"></div>
                </div>
                <div className="flex gap-1 mt-3">
                  <div className="w-full h-8 bg-stone-50 rounded border border-stone-100"></div>
                  <div className="w-full h-8 bg-orange-50 rounded border border-orange-100"></div>
                </div>
              </div>

              {/* Dashboard Mockup Component 3 */}
              <div className="absolute bottom-[15%] left-[20%] w-[70%] bg-white rounded-2xl p-5 shadow-sm border border-stone-100 animate-[float_7s_ease-in-out_infinite_0.5s]">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="w-32 h-3 bg-stone-200 rounded-full mb-2"></div>
                    <div className="w-20 h-2 bg-stone-100 rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <BarChart2 size={20} />
                  </div>
                </div>
                <div className="flex items-end gap-2 h-12">
                  <div className="w-full h-[40%] bg-stone-100 rounded-t-sm"></div>
                  <div className="w-full h-[60%] bg-stone-100 rounded-t-sm"></div>
                  <div className="w-full h-[80%] bg-orange-200 rounded-t-sm"></div>
                  <div className="w-full h-[100%] bg-orange-500 rounded-t-sm"></div>
                  <div className="w-full h-[70%] bg-stone-100 rounded-t-sm"></div>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-stone-300/20 rounded-full blur-2xl"></div>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                }
              `}} />
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
                Your Learning Journey
              </h2>
              <p className="text-[16px] text-[var(--color-secondary-text)] max-w-[500px]">
                Follow a simple path from choosing a course to tracking your achievements.
              </p>
            </div>

            <div className="relative pl-6">
              {/* Vertical connecting line */}
              <div className="absolute left-[39px] top-4 bottom-8 w-[2px] bg-stone-100"></div>

              <div className="flex flex-col gap-8">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="relative flex items-start gap-6 group hover:-translate-y-1 transition-transform duration-[250ms]"
                  >
                    {/* Number Circle */}
                    <div className="relative z-10 w-10 h-10 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors duration-[250ms] flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    
                    <div>
                      <h3 className="text-[18px] font-semibold text-[var(--color-primary-text)] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[15px] text-[var(--color-secondary-text)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Link 
                to="/courses" 
                className="inline-flex items-center justify-center bg-[var(--color-primary-text)] text-[var(--color-background)] px-8 py-4 text-[15px] font-medium hover:bg-[#333] hover:scale-[1.02] active:scale-[0.98] transition-all duration-[250ms] shadow-sm rounded-none"
              >
                Get Started
              </Link>
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default LearningJourneySection;
