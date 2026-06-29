import { motion } from 'framer-motion';
import { PlayCircle, CheckSquare, TrendingUp, Lightbulb } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <PlayCircle size={32} className="text-primary mb-4" strokeWidth={1.5} />,
      title: 'Interactive Videos',
      description: 'Engage with dynamic video content that pauses for interactions and checks your understanding in real-time.'
    },
    {
      icon: <CheckSquare size={32} className="text-primary mb-4" strokeWidth={1.5} />,
      title: 'Quizzes & Assessments',
      description: 'Test your knowledge with adaptive quizzes that tailor to your learning pace and highlight areas for improvement.'
    },
    {
      icon: <TrendingUp size={32} className="text-primary mb-4" strokeWidth={1.5} />,
      title: 'Learning Progress',
      description: 'Track your educational journey with detailed analytics and visual progress indicators across all your courses.'
    },
    {
      icon: <Lightbulb size={32} className="text-primary mb-4" strokeWidth={1.5} />,
      title: 'Smart Learning Insights',
      description: 'Receive personalized recommendations and actionable insights based on your unique learning habits and performance.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-medium text-primary-text mb-4">
          Discover a better way to learn
        </h2>
        <p className="text-secondary-text max-w-2xl text-lg">
          Our platform is designed to provide a comprehensive and engaging educational experience, tailored to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-warm-white rounded-3xl p-8 border border-border-gray/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
          >
            <div className="group-hover:scale-110 transition-transform duration-300 origin-left">
              {feature.icon}
            </div>
            <h3 className="font-heading font-semibold text-xl text-primary-text mb-3">
              {feature.title}
            </h3>
            <p className="text-secondary-text text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
