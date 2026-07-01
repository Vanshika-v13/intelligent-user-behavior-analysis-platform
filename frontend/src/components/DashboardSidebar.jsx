import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { LayoutDashboard, BookOpen, CheckSquare, User, Settings, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'My Learning', path: ROUTES.MY_LEARNING, icon: BookOpen },
    { name: 'Quiz Results', path: ROUTES.DASHBOARD + '/quizzes', icon: CheckSquare },
    { name: 'Profile', path: ROUTES.PROFILE, icon: User },
    { name: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
    { name: 'Certificates', path: ROUTES.DASHBOARD + '/certificates', icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col shadow-[2px_0_8px_rgba(0,0,0,0.02)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-[62px] px-6 flex items-center border-b border-[#E2E8F0] shrink-0">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 bg-[#FF6B35] flex items-center justify-center rounded-[6px] shadow-sm">
                <div className="w-3 h-3 bg-white rounded-[2px] rotate-45"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A] font-heading">LearnPulse</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.placeholder ? '#' : item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#FFE8DE] text-[#FF6B35]'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  } ${item.placeholder ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    if (item.placeholder) e.preventDefault();
                    if (window.innerWidth < 1024 && !item.placeholder) onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF6B35]' : 'text-[#94A3B8] group-hover:text-[#0F172A]'}`} />
                    <span className={`text-[15px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                  </div>
                  {item.placeholder && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">Soon</span>
                  )}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Mini Profile */}
          <div className="p-4 shrink-0 border-t border-[#E2E8F0]">
            <Link to={ROUTES.PROFILE} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFE8DE] to-[#FED7AA] flex items-center justify-center text-[#FF6B35] font-bold text-lg shrink-0 shadow-sm border border-[#FF6B35]/10">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-[#0F172A] truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[#64748B] truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
