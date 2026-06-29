const Footer = () => {
  return (
    <footer className="bg-footer text-warm-white py-12 md:py-20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-warm-white rounded-sm rotate-45 transform origin-center flex items-center justify-center">
              <div className="w-3 h-3 bg-footer rounded-sm -rotate-45" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-warm-white">LearnPulse</span>
          </div>
          <p className="text-secondary-text text-sm max-w-xs">
            Interactive Learning Powered by Insights. Empowering learners and building future skills.
          </p>
        </div>
        
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-heading font-medium text-lg">About</h4>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Our Story</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Careers</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Blog</a>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-heading font-medium text-lg">Courses</h4>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Technology</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Business</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Design</a>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-heading font-medium text-lg">Connect</h4>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Contact Us</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">GitHub</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-sm transition-colors">Twitter</a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-secondary-text/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-secondary-text text-xs">© 2026 LearnPulse. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-secondary-text hover:text-warm-white text-xs transition-colors">Privacy Policy</a>
          <a href="#" className="text-secondary-text hover:text-warm-white text-xs transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
