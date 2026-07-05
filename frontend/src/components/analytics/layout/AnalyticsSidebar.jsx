import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const AnalyticsSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/analytics', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Users', path: '/analytics/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Devices', path: '/analytics/devices', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Sessions', path: '/analytics/sessions', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Courses', path: '/analytics/courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Videos', path: '/analytics/videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { label: 'Quizzes', path: '/analytics/quizzes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: 'Funnels', path: '/analytics/funnels', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
    { label: 'Engagement', path: '/analytics/engagement', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  return (
    <div 
      className={`bg-surface border-r border-border/60 transition-all duration-300 flex flex-col hidden md:flex ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-border/60">
        {!isCollapsed && <span className="font-heading font-bold text-[1.1rem] text-primary-text tracking-tight truncate">Analytics</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-soft hover:bg-muted/10 text-muted hover:text-primary-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ml-auto"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/analytics'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-soft transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isActive 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-muted/80 hover:bg-muted/10 hover:text-primary-text font-normal'
              }`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <div className={`flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
              <svg className={`w-5 h-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : 'mr-3'} group-hover:text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            {!isCollapsed && <span className="truncate text-[0.9rem] leading-none">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
