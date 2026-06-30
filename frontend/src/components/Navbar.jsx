import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Courses', path: ROUTES.COURSES },
    { name: 'Features', path: ROUTES.FEATURES },
    { name: 'About', path: ROUTES.ABOUT }
  ];

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-sm transition-colors py-1 ${
      isActive 
        ? 'text-[var(--color-primary-text)] font-semibold border-b-2 border-[var(--color-primary-text)]' 
        : 'text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] font-medium'
    }`;
  };

  const getMobileLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-base font-medium px-4 py-2 rounded-md transition-colors ${
      isActive
        ? 'text-orange-600 bg-orange-50'
        : 'text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-stone-50'
    }`;
  };

  return (
    <header className="w-full bg-[var(--color-background)]/95 backdrop-blur-md border-b border-[var(--color-border-gray)] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[62px] flex items-center justify-between">
        {/* LEFT: Logo + Text */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3 cursor-pointer shrink-0">
          <div className="w-8 h-8 bg-orange-600 flex items-center justify-center rounded-lg shadow-sm">
            {/* Logo placeholder - a simple geometric shape */}
            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-[var(--color-primary-text)] font-heading">LearnPulse</span>
        </Link>

        {/* CENTER: Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={getLinkClass(link.path)}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Buttons (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-[var(--color-primary-text)] hover:text-orange-600 transition-colors px-3 py-2">
                Dashboard
              </Link>
              <Link to={ROUTES.PROFILE} className="text-sm font-medium text-[var(--color-primary-text)] hover:text-orange-600 transition-colors px-3 py-2">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium border border-stone-200 bg-white shadow-sm text-[var(--color-primary-text)] px-6 py-2.5 rounded-md hover:bg-stone-50 hover:shadow-md hover:-translate-y-0.5 transition-all">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-[var(--color-primary-text)] hover:text-orange-600 transition-colors px-3 py-2">
                Login
              </Link>
              <Link to={ROUTES.REGISTER} className="text-sm font-medium border border-[var(--color-primary-text)] bg-[var(--color-primary-text)] text-white shadow-sm px-6 py-2.5 rounded-md hover:bg-stone-800 hover:border-stone-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-[var(--color-primary-text)] hover:bg-stone-100 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-[62px] left-0 w-full bg-white border-b border-[var(--color-border-gray)] py-4 px-6 flex flex-col gap-2 shadow-xl z-50">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsOpen(false)} 
              className={getMobileLinkClass(link.path)}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-stone-100 my-2" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link to={ROUTES.DASHBOARD} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-primary-text)] px-4 py-2 hover:bg-stone-50 rounded-lg">Dashboard</Link>
              <Link to={ROUTES.PROFILE} onClick={() => setIsOpen(false)} className="text-base font-medium text-[var(--color-primary-text)] px-4 py-2 hover:bg-stone-50 rounded-lg">Profile</Link>
              <button onClick={handleLogout} className="text-base font-medium border border-stone-200 bg-white text-[var(--color-primary-text)] px-5 py-3 rounded-xl text-center shadow-sm mt-2">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)} className="text-base font-medium text-center text-[var(--color-primary-text)] px-4 py-3 hover:bg-stone-50 rounded-xl">Login</Link>
              <Link to={ROUTES.REGISTER} onClick={() => setIsOpen(false)} className="text-base font-medium bg-[var(--color-primary-text)] text-white px-5 py-3 rounded-xl text-center shadow-sm hover:shadow-md">Join Now</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
