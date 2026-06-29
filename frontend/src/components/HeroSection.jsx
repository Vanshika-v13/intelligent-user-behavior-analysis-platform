import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-full bg-[var(--color-background)] overflow-hidden flex flex-col">
      {/* Container - very wide, minimal padding to push content up */}
      <div className="max-w-[1880px] w-full mx-auto px-3 md:px-6 xl:px-10 pt-0 pb-4 md:pb-6 xl:pb-6 flex-grow flex flex-col h-full">
        
        {/* Main Grid - Responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-[repeat(24,minmax(0,1fr))] gap-6 md:gap-4 xl:gap-0 items-stretch h-full xl:grid-rows-[minmax(calc((100vh-62px)*0.45),1fr)_auto]">
          
          {/* ==================== TOP ROW ==================== */}
          
          {/* 1. TOP-TEXT (9/24) */}
          <div className="order-1 md:col-span-3 xl:col-[span_9/span_9] flex flex-col justify-center text-left py-4 md:py-6 xl:py-6 pr-0 md:pr-8 xl:pr-12 bg-[var(--color-background)] h-full w-full xl:max-w-[95%]">
            <h1 className="-mt-[10px] text-[3rem] md:text-[3.6rem] xl:text-[4.25rem] font-medium leading-[1.05] text-[var(--color-primary-text)] tracking-tighter mb-4 md:mb-6">
              Master Skills<br />Achieve<br />Goals
            </h1>
            <p className="text-[15px] xl:text-[16px] text-[var(--color-secondary-text)] leading-[1.6] max-w-[400px] mb-6 font-sans">
              Explore curated technology courses, interactive videos, and hands-on quizzes designed to help you learn and grow.
            </p>
            <div className="mb-6 md:mb-8">
              <button className="bg-[var(--color-primary-text)] text-[var(--color-background)] px-8 py-4 md:px-10 md:py-5 text-[15px] font-medium hover:bg-[#333] transition-colors duration-300 inline-flex items-center justify-center rounded-none">
                Start Learning Today
              </button>
            </div>
          </div>

          {/* 2. TOP-ORANGE (4/24) */}
          <div className="order-3 md:order-3 xl:order-2 md:col-span-1 xl:col-[span_4/span_4] flex items-end justify-start bg-[var(--color-background)] h-full pt-0 xl:pt-10">
            {/* Aspect square ensures it stays a compact box at the bottom on desktop, stretch on mobile/tablet */}
            <div className="bg-[var(--color-primary)] p-6 xl:p-8 flex flex-col justify-end text-[var(--color-background)] w-full aspect-auto md:h-full xl:h-auto xl:aspect-square relative overflow-hidden">
              <div className="z-10 relative mt-auto">
                <h3 className="text-4xl md:text-[2.5rem] xl:text-5xl font-bold mb-1 xl:mb-2 tracking-tight">20+</h3>
                <p className="text-[14px] xl:text-[15px] font-medium leading-tight mb-4 xl:mb-6">Interactive Lessons</p>
                <p className="text-[12px] xl:text-[13px] opacity-90 leading-snug font-sans">Hands-on learning experiences designed for skill development.</p>
              </div>
              
              {/* Geometric decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 flex flex-col opacity-20">
                <div className="h-1/2 w-full bg-white transform origin-bottom-right -skew-y-[30deg]"></div>
                <div className="h-1/2 w-full bg-white transform origin-top-right skew-y-[30deg]"></div>
              </div>
            </div>
          </div>

          {/* 3. TOP-PORTRAIT (6/24) */}
          <div className="order-2 md:order-2 xl:order-3 md:col-span-3 xl:col-[span_6/span_6] bg-[var(--color-light-gray)] min-h-[300px] md:min-h-[400px] xl:min-h-0 h-full pt-0 overflow-hidden">
            <img 
              src="/topRight.png" 
              alt="Portrait" 
              className="w-full h-full object-cover object-center rounded-none" 
            />
          </div>

          {/* 4. TOP-INFO / STATS (5/24) */}
          <div className="hidden xl:flex order-4 xl:col-[span_5/span_5] flex-col justify-between py-10 xl:py-12 px-4 xl:px-6 bg-[var(--color-background)] h-full">
            <div className="pt-4 xl:pt-0">
              <p className="text-[14px] xl:text-[15px] font-medium text-[var(--color-secondary-text)] max-w-[120px] leading-[1.4]">
                learners from<br/>around the<br/>world.
              </p>
            </div>
            <div className="mt-auto pb-4 xl:pb-0 flex flex-col gap-6">
              <div>
                <h3 className="text-3xl xl:text-[34px] font-bold text-[var(--color-primary-text)] tracking-tight">12+</h3>
                <p className="text-[11px] xl:text-[12px] font-bold text-[var(--color-primary-text)] mt-1 font-sans">Learning Modules</p>
                <p className="text-[11px] text-[var(--color-secondary-text)] mt-1 font-sans leading-tight">Curated learning paths.</p>
              </div>
              <div>
                <h3 className="text-3xl xl:text-[34px] font-bold text-[var(--color-primary-text)] tracking-tight">6+</h3>
                <p className="text-[11px] xl:text-[12px] font-bold text-[var(--color-primary-text)] mt-1 font-sans">Technology Tracks</p>
                <p className="text-[11px] text-[var(--color-secondary-text)] mt-1 font-sans leading-tight">Web, AI, Data, Cloud and more.</p>
              </div>
            </div>
          </div>

          {/* ==================== BOTTOM ROW ==================== */}

          {/* 5. BOTTOM-LEFT (9/24) */}
          <div className="hidden xl:block order-5 xl:col-[span_9/span_9] h-[210px] xl:h-[calc(23vh+35px)]">
            <img 
              src="/bottomLeft.png" 
              alt="Graduation" 
              className="w-full h-full object-cover object-center rounded-none"
            />
          </div>

          {/* 6. MISSION CARD (9/24) */}
          <div className="order-4 md:order-4 xl:order-6 md:col-span-1 xl:col-[span_9/span_9] flex flex-col justify-center px-8 md:px-8 xl:px-16 py-10 md:py-10 xl:py-0 bg-[var(--color-background)] h-auto md:h-full xl:h-[calc(23vh+35px)]">
            <h2 className="text-[16px] md:text-[18px] xl:text-[20px] font-bold tracking-tight text-[var(--color-primary-text)] mb-4 md:mb-6 uppercase leading-[1.3] max-w-[320px]">
              EMPOWERING LEARNERS,<br />BUILDING FUTURE SKILLS
            </h2>
            <p className="text-[13px] md:text-[14px] xl:text-[15px] text-[var(--color-secondary-text)] leading-[1.6] max-w-[400px] font-sans">
              LearnPulse helps learners explore interactive courses, practice through quizzes, and build real-world skills through engaging learning experiences.
            </p>
          </div>

          {/* 7. BOTTOM-RIGHT DECORATIVE (6/24) */}
          <div className="order-5 md:order-5 xl:order-7 md:col-span-1 xl:col-[span_6/span_6] bg-[var(--color-light-gray)] flex items-center justify-center relative overflow-hidden h-auto py-12 md:py-0 md:h-full xl:h-[calc(23vh+35px)]">
            <div className="flex flex-col items-center text-center z-10 px-4 w-full">
              <h3 className="text-xl xl:text-2xl font-bold text-[var(--color-primary-text)] mb-3">Ready to Start?</h3>
              <button className="bg-[var(--color-primary-text)] text-[var(--color-background)] px-6 py-3 text-sm font-medium hover:bg-[#333] transition-colors rounded-none">
                Join Now
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
