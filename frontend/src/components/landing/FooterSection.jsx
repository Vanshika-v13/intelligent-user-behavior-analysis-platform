import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FBFBFB] border-t border-stone-200/80 pt-20 pb-8 mt-auto">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-[12px] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-[250ms]">
                <BookOpen className="w-5 h-5 text-[var(--color-background)]" />
              </div>
              <span className="text-[22px] font-bold text-[var(--color-primary-text)] tracking-tight">
                LearnPulse
              </span>
            </Link>
            <p className="text-[15px] text-[var(--color-secondary-text)] max-w-[280px] leading-relaxed">
              Helping learners grow through interactive education.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col lg:pl-10">
            <h3 className="text-[16px] font-bold text-[var(--color-primary-text)] mb-6 tracking-wide uppercase opacity-80">
              Platform
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/courses" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  Courses
                </Link>
              </li>
              <li>
                <a href="#features" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  Features
                </a>
              </li>
              <li>
                <Link to="/about" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col lg:pl-10">
            <h3 className="text-[16px] font-bold text-[var(--color-primary-text)] mb-6 tracking-wide uppercase opacity-80">
              Resources
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="#faq" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div className="flex flex-col lg:pl-10">
            <h3 className="text-[16px] font-bold text-[var(--color-primary-text)] mb-6 tracking-wide uppercase opacity-80">
              Account
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/login" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[15px] text-[var(--color-secondary-text)] hover:text-orange-600 transition-colors duration-[200ms] inline-flex">
                  Register
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-stone-200/80 gap-4">
          <p className="text-[14px] text-[var(--color-secondary-text)]">
            &copy; {currentYear} LearnPulse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-[13px] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[13px] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
