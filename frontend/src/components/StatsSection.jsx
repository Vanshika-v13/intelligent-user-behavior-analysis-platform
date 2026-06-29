import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    { number: '200+', label: 'Courses' },
    { number: '15K+', label: 'Resources' },
    { number: '50K+', label: 'Learners' },
    { number: '10K+', label: 'Community' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 border-y border-border-gray/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center justify-center text-center p-6 group cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <span className="text-4xl md:text-5xl font-heading font-bold text-primary-text mb-2 group-hover:text-primary transition-colors">
              {stat.number}
            </span>
            <span className="text-secondary-text font-medium text-sm md:text-base">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
