import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <motion.div 
        className="bg-primary rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8 leading-tight">
            Ready to Start Your Learning Journey?
          </h2>
          <a 
            href="/register" 
            className="inline-block bg-white text-primary font-semibold text-lg px-10 py-4 rounded-full hover:bg-warm-white transition-colors hover:scale-105 transform duration-300 shadow-lg shadow-black/10"
          >
            Get Started
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
