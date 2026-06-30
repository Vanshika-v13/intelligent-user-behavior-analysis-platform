import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-[var(--color-background)] border-b border-[var(--color-border-gray)] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[62px] flex items-center justify-between">
        {/* LEFT: Logo + Text */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3 cursor-pointer shrink-0">
          <div className="w-8 h-8 bg-[var(--color-primary-text)] flex items-center justify-center rounded-sm">
            {/* Logo placeholder - a simple geometric shape */}
            <div className="w-4 h-4 bg-[var(--color-background)] rotate-45"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-[var(--color-primary-text)] font-heading">LearnPulse</span>
        </Link>

        {/* CENTER: Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link to={ROUTES.HOME} className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">Home</Link>
          <Link to={ROUTES.COURSES} className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">Courses</Link>
          <Link to={ROUTES.FEATURES} className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">Features</Link>
          <Link to={ROUTES.ABOUT} className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">About</Link>
        </nav>

        {/* RIGHT: Buttons (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-[var(--color-primary-text)] hover:text-[var(--color-primary)] transition-colors px-3 py-2">
                Dashboard
              </Link>
              <Link to={ROUTES.PROFILE} className="text-sm font-medium text-[var(--color-primary-text)] hover:text-[var(--color-primary)] transition-colors px-3 py-2">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium border border-[var(--color-border-gray)] bg-transparent text-[var(--color-primary-text)] px-6 py-2.5 rounded-sm hover:bg-[var(--color-light-gray)] transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-[var(--color-primary-text)] hover:text-[var(--color-primary)] transition-colors px-3 py-2">
                Login
              </Link>
              <Link to={ROUTES.REGISTER} className="text-sm font-medium border border-[var(--color-border-gray)] bg-transparent text-[var(--color-primary-text)] px-6 py-2.5 rounded-sm hover:bg-[var(--color-light-gray)] transition-colors">
                Join Now ↗
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-[var(--color-primary-text)]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-[62px] left-0 w-full bg-[var(--color-background)] border-b border-[var(--color-border-gray)] py-4 px-6 flex flex-col gap-4 shadow-xl z-50">
          <Link to={ROUTES.HOME} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-secondary-text)]">Home</Link>
          <Link to={ROUTES.COURSES} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-secondary-text)]">Courses</Link>
          <Link to={ROUTES.FEATURES} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-secondary-text)]">Features</Link>
          <Link to={ROUTES.ABOUT} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-secondary-text)]">About</Link>
          <hr className="border-[var(--color-border-gray)]" />
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-primary-text)]">Dashboard</Link>
              <Link to={ROUTES.PROFILE} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-primary-text)]">Profile</Link>
              <button onClick={handleLogout} className="text-base font-medium border border-[var(--color-border-gray)] text-[var(--color-primary-text)] px-5 py-3 rounded-sm text-center">Logout</button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-primary-text)]">Login</Link>
              <Link to={ROUTES.REGISTER} onClick={() => setIsOpen(false)} className="text-base font-medium border border-[var(--color-border-gray)] text-[var(--color-primary-text)] px-5 py-3 rounded-sm text-center">Join Now ↗</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
