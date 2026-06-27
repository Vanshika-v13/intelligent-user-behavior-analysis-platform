import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export default function Sidebar({ children, className, isCollapsed = false, isMobileOpen = false, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 h-full bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-sm flex flex-col transition-all duration-300",
          /* Mobile: drawer behavior */
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          /* Desktop & Tablet widths */
          isCollapsed ? "lg:w-[90px]" : "lg:w-[280px]",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-bold text-lg text-[var(--color-text)]">Menu</span>
          <button onClick={onMobileClose} className="p-2 rounded-md text-[var(--color-muted-text)] hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-4 hide-scrollbar">
          {children}
        </div>
      </aside>
    </>
  );
}

export function SidebarItem({ icon: Icon, label, isActive, isCollapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={clsx(
        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50",
        isActive 
          ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20" 
          : "text-[var(--color-muted-text)] hover:bg-gray-100 hover:text-[var(--color-text)]"
      )}
    >
      <Icon size={22} className={clsx("shrink-0", isCollapsed && "mx-auto")} />
      {!isCollapsed && <span className="font-semibold text-sm whitespace-nowrap">{label}</span>}
    </button>
  );
}
Sidebar.Item = SidebarItem;
