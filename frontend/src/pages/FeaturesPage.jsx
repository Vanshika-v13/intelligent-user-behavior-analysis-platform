import React from 'react';
import { PlayCircle, CheckCircle, Layout, BarChart, ArrowRight, BookOpen, Clock, FileText, Users, Award, TrendingUp, Globe } from 'lucide-react';
import FooterSection from '../components/landing/FooterSection';
import { Link } from 'react-router-dom';

const DecorativeBlob = ({ className }) => (
  <div className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse ${className}`}></div>
);

const FeaturesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-[fadeIn_0.5s_ease-out] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full pt-[48px] md:pt-[64px] lg:pt-[80px] pb-[48px] md:pb-[64px] lg:pb-[80px] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent -z-10" />
        <DecorativeBlob className="bg-orange-300 w-96 h-96 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
        <DecorativeBlob className="bg-rose-300 w-96 h-96 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animation-delay-2000" />
        
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md text-orange-600 text-sm font-bold rounded-full border border-orange-100 shadow-sm uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Premium Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-primary-text)] tracking-tight mb-6 leading-[1.15]">
                Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Learn Better</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[var(--color-secondary-text)] mb-10 leading-relaxed max-w-[600px]">
                Build skills through interactive lessons, videos, notes, and progress tracking. A handcrafted experience designed for your success.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link to="/register" className="bg-stone-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-stone-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-stone-200">
                  Get Started Free
                </Link>
                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                  <CheckCircle size={16} className="text-orange-500" /> No credit card required
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-orange-900/5 border border-stone-100 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Learning Experience" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -left-8 md:-left-12 top-10 bg-white p-4 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 z-20 animate-[bounce_4s_infinite_ease-in-out]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">Top Rated</p>
                    <p className="text-xs text-stone-500">Learning Platform</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 md:-right-8 bottom-10 bg-white p-4 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 z-20 animate-[bounce_5s_infinite_ease-in-out_reverse]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">95% Success</p>
                    <p className="text-xs text-stone-500">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] relative z-10 bg-white">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-text)] mb-4">Core Features</h2>
            <p className="text-lg text-[var(--color-secondary-text)] max-w-2xl mx-auto">Everything carefully crafted to optimize your learning flow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: PlayCircle, title: "Interactive Lessons", desc: "Engage with dynamic video content and immediate hands-on practice directly in your browser." },
              { icon: CheckCircle, title: "Practice Quizzes", desc: "Test your understanding with beautifully designed quizzes that reinforce key concepts." },
              { icon: Layout, title: "Structured Learning Paths", desc: "Follow expertly curated roadmaps that guide you seamlessly from beginner to advanced." },
              { icon: BarChart, title: "Progress Tracking", desc: "Visualize your journey with detailed analytics, learning streaks, and milestone achievements." }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-stone-50 p-8 md:p-10 rounded-[32px] overflow-hidden hover:shadow-xl hover:shadow-orange-900/5 hover:-translate-y-1 transition-all duration-300 border border-stone-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white shadow-sm border border-stone-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-50 transition-all duration-300">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-primary-text)] mb-4">{feature.title}</h3>
                  <p className="text-[17px] text-[var(--color-secondary-text)] leading-relaxed mb-8">{feature.desc}</p>
                  
                  <Link to="/courses" className="inline-flex items-center gap-2 text-orange-600 font-semibold group/link">
                    Explore Feature 
                    <ArrowRight size={18} className="transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] bg-stone-50 border-y border-stone-100">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-text)] mb-4">Why LearnPulse?</h2>
            <p className="text-lg text-[var(--color-secondary-text)] max-w-2xl mx-auto">Designed to help you focus, understand, and retain knowledge better.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Learn at your own pace", desc: "No strict deadlines. Learn whenever and wherever you want." },
              { icon: Layout, title: "Structured experience", desc: "A clean, distraction-free interface to keep you in the flow." },
              { icon: TrendingUp, title: "Progress tracking", desc: "Watch your skills grow with beautiful visual analytics." },
              { icon: FileText, title: "Curated resources", desc: "Access high-quality notes and materials for every lesson." }
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-8 rounded-[24px] border border-stone-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-stone-900 mb-3">{benefit.title}</h4>
                <p className="text-stone-500 leading-relaxed text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative w-full py-[48px] md:py-[64px] lg:py-[80px] overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 bg-stone-900" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-900/90"></div>
        
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, stat: "20+", label: "Expert Lessons" },
              { icon: Globe, stat: "6+", label: "Learning Domains" },
              { icon: Users, stat: "1,000s", label: "Learning Sessions" },
              { icon: TrendingUp, stat: "98%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[24px] text-center hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 mx-auto bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl font-extrabold text-white mb-2">{stat.stat}</div>
                <div className="text-stone-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-[48px] md:py-[64px] lg:py-[80px] bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-50/50 to-transparent"></div>
        <div className="max-w-[800px] w-full mx-auto px-5 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">Ready to elevate your skills?</h2>
          <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto">
            Join thousands of learners building their future on our premium platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto bg-orange-500 text-white px-10 py-4 rounded-full text-[16px] font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5">
              Start Learning Now
            </Link>
            <Link to="/courses" className="w-full sm:w-auto bg-white text-stone-700 border border-stone-200 px-10 py-4 rounded-full text-[16px] font-bold hover:bg-stone-50 transition-all">
              View Curriculum
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FeaturesPage;
