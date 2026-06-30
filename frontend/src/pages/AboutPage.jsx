import React from 'react';
import { Target, Lightbulb, Heart, BookOpen, Layout, BarChart } from 'lucide-react';
import FooterSection from '../components/landing/FooterSection';
import { Link } from 'react-router-dom';

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-[32px] border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-bold text-[var(--color-primary-text)] mb-4">{title}</h3>
    <p className="text-[17px] text-[var(--color-secondary-text)] leading-relaxed">{description}</p>
  </div>
);

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-[fadeIn_0.5s_ease-out]">
      {/* Hero Section */}
      <section className="w-full bg-[#FAFAFA] border-b border-stone-200/80 pt-20 pb-24 flex flex-col justify-center items-center text-center">
        <div className="max-w-[800px] w-full mx-auto px-5 md:px-8">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[14px] font-bold rounded-full border border-orange-200 shadow-sm uppercase tracking-wider mb-6">
            About Us
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-primary-text)] tracking-tight mb-6 leading-[1.1]">
            Our Mission to Transform Education
          </h1>
          <p className="text-[19px] text-[var(--color-secondary-text)] mb-10 leading-relaxed max-w-[700px] mx-auto">
            Helping learners access structured education through interactive lessons and video-based learning, making the process accessible, engaging, and premium.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full py-24">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-square bg-stone-100 rounded-[40px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Students learning" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">Platform Vision</h2>
              <p className="text-[18px] text-[var(--color-secondary-text)] leading-relaxed mb-8">
                We believe that education should not only be accessible but also beautiful and highly engaging. Our vision is to create a digital learning environment that feels like a premium editorial magazine, keeping you focused and inspired.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="text-[19px] font-bold text-[var(--color-primary-text)] mb-1">Our Mission</h4>
                    <p className="text-[16px] text-[var(--color-secondary-text)]">To empower individuals worldwide by providing structured, high-quality video lessons that drive real-world results.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h4 className="text-[19px] font-bold text-[var(--color-primary-text)] mb-1">Innovation</h4>
                    <p className="text-[16px] text-[var(--color-secondary-text)]">Continuously improving our platform with advanced analytics and tracking to optimize your learning path.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why LearnPulse */}
      <section className="w-full py-24 bg-[#FAFAFA] border-y border-stone-200/80">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">Why LearnPulse</h2>
            <p className="text-[19px] text-[var(--color-secondary-text)] max-w-[600px] mx-auto">
              We've redesigned the online learning experience from the ground up.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard 
              icon={BookOpen}
              title="Interactive Learning"
              description="Learn by doing with interactive elements woven directly into video lessons."
            />
            <ValueCard 
              icon={Layout}
              title="Structured Courses"
              description="Follow a clear, defined path from beginner to expert without getting lost."
            />
            <ValueCard 
              icon={BarChart}
              title="Progress Tracking"
              description="Monitor your growth and time spent with detailed learning analytics."
            />
            <ValueCard 
              icon={Heart}
              title="Flexible Learning"
              description="Learn at your own pace, on any device, whenever you have the time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-stone-900 text-white mt-auto">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
          <p className="text-[19px] text-stone-400 mb-10 max-w-[600px]">
            Start building your future with LearnPulse today.
          </p>
          <Link to="/register" className="bg-orange-500 text-white px-10 py-4 rounded-full text-[16px] font-bold hover:bg-orange-600 transition-all shadow-sm">
            Create an Account
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
