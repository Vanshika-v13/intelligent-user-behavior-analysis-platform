import React from 'react';
import { Target, Lightbulb, Compass, BarChart, BookOpen, Heart, Activity, Globe } from 'lucide-react';
import FooterSection from '../components/landing/FooterSection';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-[fadeIn_0.5s_ease-out] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full pt-[48px] md:pt-[64px] lg:pt-[80px] pb-[48px] md:pb-[64px] lg:pb-[80px] bg-white border-b border-stone-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent opacity-70"></div>
        
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-left">
              <span className="inline-block px-4 py-1.5 bg-stone-100 text-stone-600 text-[13px] font-bold rounded-full border border-stone-200 mb-6 uppercase tracking-widest">
                Our Story
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight mb-6 leading-[1.1]">
                Transforming the Way <span className="text-orange-500">You Learn</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-500 mb-10 leading-relaxed max-w-[550px]">
                We believe education should be beautiful, structured, and engaging. A premium experience designed for the modern learner.
              </p>
              <Link to="/courses" className="inline-flex items-center justify-center bg-stone-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-stone-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-stone-200">
                Explore Our Platform
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl shadow-orange-900/10 border border-stone-100 relative group">
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Students learning collaboratively" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] relative">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <div className="relative bg-white p-10 md:p-12 rounded-[32px] border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-bold text-stone-900 mb-4">Our Mission</h3>
              <p className="text-lg text-stone-500 leading-relaxed">
                To empower individuals worldwide by providing highly structured, beautifully designed, and deeply engaging educational content that drives real-world mastery.
              </p>
            </div>

            {/* Vision Card */}
            <div className="relative bg-white p-10 md:p-12 rounded-[32px] border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-8">
                <Lightbulb size={32} />
              </div>
              <h3 className="text-3xl font-bold text-stone-900 mb-4">Our Vision</h3>
              <p className="text-lg text-stone-500 leading-relaxed">
                To become the standard for digital learning—where education feels less like a chore and more like an inspiring, premium editorial experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why LearnPulse Section */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] bg-stone-50 border-y border-stone-100">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Why LearnPulse</h2>
            <p className="text-lg text-stone-500 max-w-2xl">A meticulous approach to online education.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Curated Learning", desc: "Handpicked resources and precisely structured paths to prevent overwhelm." },
              { icon: Activity, title: "Practical Focus", desc: "Emphasis on doing over just watching, with integrated interactive exercises." },
              { icon: BarChart, title: "Detailed Progress", desc: "Granular analytics so you always know exactly where you stand." },
              { icon: Globe, title: "Accessible Education", desc: "Premium quality content available anytime, beautifully responsive on all devices." }
            ].map((feature, i) => (
              <div key={i} className="h-full bg-white p-8 rounded-[24px] border border-stone-200 shadow-sm hover:border-orange-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-900/5 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-50/50 text-orange-600 border border-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h4>
                <p className="text-stone-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Philosophy Timeline */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] bg-white">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Our Learning Philosophy</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">A proven framework designed to maximize retention.</p>
          </div>

          <div className="relative">
            {/* Horizontal connecting line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-stone-100 z-0"></div>
            
            {/* Vertical connecting line (Mobile only) */}
            <div className="md:hidden absolute top-0 bottom-0 left-6 w-0.5 bg-stone-100 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
              {[
                { num: "01", title: "Discover", desc: "Identify your goals and find the perfect learning path." },
                { num: "02", title: "Learn", desc: "Engage with bite-sized, high-quality video content." },
                { num: "03", title: "Practice", desc: "Apply concepts immediately through interactive quizzes." },
                { num: "04", title: "Track", desc: "Review your progress and maintain your streak." }
              ].map((step, i) => (
                <div key={i} className="flex md:flex-col items-start md:items-center relative pl-16 md:pl-0">
                  <div className="absolute left-0 md:relative md:left-auto w-12 h-12 md:w-24 md:h-24 bg-white border-4 border-stone-50 rounded-full shadow-md flex items-center justify-center mb-6 z-10 text-orange-500 font-bold text-lg md:text-2xl">
                    {step.num}
                  </div>
                  <div className="md:text-center pt-2 md:pt-0">
                    <h4 className="text-xl font-bold text-stone-900 mb-2">{step.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
        <div className="max-w-[800px] w-full mx-auto px-5 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to join us?</h2>
          <p className="text-lg text-stone-400 mb-10 max-w-xl mx-auto">
            Experience the difference of a thoughtfully designed learning platform.
          </p>
          <Link to="/register" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full text-[16px] font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5">
            Create Free Account
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
