import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/navigation/Sidebar';
import Navbar from '../components/navigation/Navbar';
import { LayoutDashboard, Users, Calendar, Activity, BookOpen, BarChart } from 'lucide-react';
import clsx from 'clsx';
import { useDashboard } from '../contexts/DashboardContext';
import { ROUTES } from '../constants/routes';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: 'Sessions', icon: Activity, path: ROUTES.SESSIONS },
    { label: 'Events', icon: Calendar, path: ROUTES.EVENTS },
    { label: 'Journeys', icon: BookOpen, path: ROUTES.JOURNEYS },
    { label: 'Engagement', icon: Users, path: ROUTES.ENGAGEMENT },
    { label: 'Users', icon: Users, path: ROUTES.USERS },
    { label: 'Reports', icon: BarChart, path: ROUTES.REPORTS },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              isCollapsed={sidebarCollapsed}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            />
          ))}
        </div>
      </Sidebar>

      <div 
        className={clsx(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full",
          sidebarCollapsed ? "lg:ml-[90px]" : "lg:ml-[280px]"
        )}
      >
        <Navbar 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          breadcrumb={<span className="font-semibold text-lg text-[var(--color-primary)] hidden sm:block">Dashboard</span>}
          userMenu={<div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">U</div>}
        />
        <main className="flex-1 p-[clamp(16px,3vw,32px)] overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1920px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
