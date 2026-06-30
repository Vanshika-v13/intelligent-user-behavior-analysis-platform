import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I start learning?',
    answer: 'Browse our extensive course catalog, select a topic that interests you, and click "Start Learning". You can begin your first lesson immediately.'
  },
  {
    question: 'Are the courses free?',
    answer: 'We offer a mix of free preview lessons and premium comprehensive courses. You can start exploring without any initial commitment.'
  },
  {
    question: 'Can I track my progress?',
    answer: 'Yes! Our platform provides a detailed learning dashboard where you can track completed lessons, quiz scores, and overall course progress.'
  },
  {
    question: 'Do I need an account?',
    answer: 'While you can browse the catalog without an account, you will need to create a free account to track your progress and save your learning history.'
  }
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div 
      className={`border transition-colors duration-[250ms] rounded-[24px] overflow-hidden mb-4 ${isOpen ? 'bg-orange-50/50 border-orange-200' : 'bg-[#FAFAFA] border-stone-200 hover:border-stone-300'}`}
    >
      <button 
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-[17px] font-semibold text-[var(--color-primary-text)] pr-4">
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border border-stone-200 shadow-sm transition-transform duration-[250ms] flex-shrink-0 ${isOpen ? 'rotate-180 bg-orange-100 border-orange-200 text-orange-600' : 'text-stone-500'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div 
        className="transition-[height] duration-[250ms] ease-in-out overflow-hidden" 
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="px-6 pb-6 pt-0">
          <p className="text-[15px] text-[var(--color-secondary-text)] leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="w-full bg-[var(--color-background)] py-12 md:py-16 lg:py-20 flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Heading & Description */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center lg:pt-8 text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-[16px] lg:text-[18px] text-[var(--color-secondary-text)] mb-10 max-w-[500px]">
              Everything you need to know before starting your learning journey.
            </p>
            
            <div className="hidden lg:block p-8 bg-[#F9F6F0] rounded-[24px] border border-stone-200/60 max-w-[360px]">
              <h3 className="text-[18px] font-semibold text-[var(--color-primary-text)] mb-2">
                Still have questions?
              </h3>
              <p className="text-[15px] text-[var(--color-secondary-text)] mb-6">
                Our support team is here to help you get the most out of your learning experience.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center bg-white border border-stone-300 text-[var(--color-primary-text)] px-6 py-3 text-[15px] font-medium hover:bg-stone-50 hover:border-stone-400 transition-all duration-[250ms] rounded-none shadow-sm w-full"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="w-full lg:w-[60%] flex flex-col">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
            
            <div className="mt-8 lg:hidden p-6 bg-[#F9F6F0] rounded-[24px] border border-stone-200/60 text-center">
              <h3 className="text-[17px] font-semibold text-[var(--color-primary-text)] mb-2">
                Still have questions?
              </h3>
              <Link 
                to="/contact" 
                className="inline-block mt-4 bg-white border border-stone-300 text-[var(--color-primary-text)] px-6 py-3 text-[15px] font-medium hover:bg-stone-50 transition-all duration-[250ms] rounded-none shadow-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FAQSection;
