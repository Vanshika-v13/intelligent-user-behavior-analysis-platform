import React from 'react';
import clsx from 'clsx';
import { Menu } from 'lucide-react';

export default function Navbar({ 
  breadcrumb, 
  search, 
  notifications, 
  userMenu, 
  onMenuClick,
  className 
}) {
  return (
    <nav className={clsx(
      "sticky top-0 z-40 w-full bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] h-[72px] flex items-center justify-between px-4 lg:px-8 transition-all", 
      className
    )}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-md text-[var(--color-muted-text)] hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:block flex-1 mt-4">
          {breadcrumb}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
        <div className="hidden md:block flex-1 max-w-sm">
          {search}
        </div>
        <div className="flex items-center gap-3">
          {notifications}
          {userMenu}
        </div>
      </div>
    </nav>
  );
}
