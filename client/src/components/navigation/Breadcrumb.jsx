import React from 'react';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

export default function Breadcrumb({ items, className }) {
  return (
    <nav className={clsx("flex items-center text-sm text-[var(--color-muted-text)] mb-4 flex-wrap", className)}>
      <button className="p-1 hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 rounded flex items-center">
        <Home size={16} />
      </button>
      
      {items.length > 2 && (
        <React.Fragment>
          <ChevronRight size={16} className="mx-1 sm:mx-2 shrink-0 opacity-50 block sm:hidden" />
          <MoreHorizontal size={16} className="block sm:hidden shrink-0" />
        </React.Fragment>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isHiddenOnMobile = items.length > 2 && index > 0 && !isLast;

        return (
          <React.Fragment key={index}>
            <ChevronRight 
              size={16} 
              className={clsx(
                "mx-1 sm:mx-2 shrink-0 opacity-50",
                isHiddenOnMobile && "hidden sm:block"
              )} 
            />
            <button 
              className={clsx(
                "transition-colors focus:outline-none focus:ring-2 rounded px-1 max-w-[120px] sm:max-w-xs truncate",
                isHiddenOnMobile && "hidden sm:block",
                isLast 
                  ? "text-[var(--color-text)] font-semibold pointer-events-none" 
                  : "hover:text-[var(--color-primary)]"
              )}
            >
              {item.label}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
