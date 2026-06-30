import React from 'react';
import { Link } from 'react-router-dom';

const CTABannerSection = () => {
  return (
    <section id="cta-banner" className="w-full bg-[var(--color-background)] py-12 lg:py-16 xl:max-h-[50vh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="relative w-full rounded-[32px] overflow-hidden bg-stone-900 border border-stone-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] px-8 py-16 md:py-24 text-center z-0 flex flex-col items-center justify-center">
          
          {/* Decorative Blurred Shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 -translate-x-1/2 -translate-y-1/2 z-[-1]"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 translate-x-1/3 translate-y-1/3 z-[-1]"></div>
          <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-gradient-to-br from-stone-900/40 to-transparent z-[-1] -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Ready to Start Learning?
            </h2>
            
            <p className="text-[17px] md:text-[19px] text-stone-300 mb-10 max-w-[600px] leading-relaxed">
              Join thousands of learners and begin your journey to mastering new skills today.
            </p>
            
            <Link 
              to="/courses" 
              className="inline-flex items-center justify-center bg-orange-500 text-white px-10 py-5 text-[16px] md:text-[17px] font-semibold hover:bg-orange-600 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] active:scale-[0.98] transition-all duration-[300ms] rounded-none"
            >
              Explore Courses
            </Link>
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default CTABannerSection;
