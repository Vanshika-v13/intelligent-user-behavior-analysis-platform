import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CategoriesSection from '../components/landing/CategoriesSection';
import LearningJourneySection from '../components/landing/LearningJourneySection';
import StatisticsSection from '../components/landing/StatisticsSection';
import FAQSection from '../components/landing/FAQSection';
import CTABannerSection from '../components/landing/CTABannerSection';
import FooterSection from '../components/landing/FooterSection';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <LearningJourneySection />
      <StatisticsSection />
      <FAQSection />
      <CTABannerSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
