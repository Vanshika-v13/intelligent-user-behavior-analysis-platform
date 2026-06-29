import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-[var(--color-background)] border-b border-[var(--color-border-gray)] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[62px] flex items-center justify-between">
        {/* LEFT: Logo + Text */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0">
          <div className="w-8 h-8 bg-[var(--color-primary-text)] flex items-center justify-center rounded-sm">
            {/* Logo placeholder - a simple geometric shape */}
            <div className="w-4 h-4 bg-[var(--color-background)] rotate-45"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-[var(--color-primary-text)] font-heading">LearnPulse</span>
        </div>

        {/* CENTER: Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <a href="#" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">Home</a>
          <a href="#" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">Courses</a>
          <a href="#" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">About</a>
        </nav>

        {/* RIGHT: Buttons (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a href="#" className="text-sm font-medium text-[var(--color-primary-text)] hover:text-[var(--color-primary)] transition-colors px-3 py-2">
            Login
          </a>
          <a href="#" className="text-sm font-medium border border-[var(--color-border-gray)] bg-transparent text-[var(--color-primary-text)] px-6 py-2.5 rounded-sm hover:bg-[var(--color-light-gray)] transition-colors">
            Join Now ↗
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-[var(--color-primary-text)]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-[62px] left-0 w-full bg-[var(--color-background)] border-b border-[var(--color-border-gray)] py-4 px-6 flex flex-col gap-4 shadow-xl z-50">
          <a href="#" className="text-base font-medium text-[var(--color-secondary-text)]">Home</a>
          <a href="#" className="text-base font-medium text-[var(--color-secondary-text)]">Courses</a>
          <a href="#" className="text-base font-medium text-[var(--color-secondary-text)]">Features</a>
          <a href="#" className="text-base font-medium text-[var(--color-secondary-text)]">About</a>
          <hr className="border-[var(--color-border-gray)]" />
          <a href="#" className="text-base font-medium text-[var(--color-primary-text)]">Login</a>
          <a href="#" className="text-base font-medium border border-[var(--color-border-gray)] text-[var(--color-primary-text)] px-5 py-3 rounded-sm text-center">Join Now ↗</a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
