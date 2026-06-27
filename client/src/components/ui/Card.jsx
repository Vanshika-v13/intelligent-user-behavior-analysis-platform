import React from 'react';
import clsx from 'clsx';

export default function Card({ title, description, children, footer, className, ...props }) {
  return (
    <div
      className={clsx(
        "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-base)] flex flex-col",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex flex-col gap-1">
          {title && <h3 className="text-lg font-semibold text-[var(--color-text)] m-0">{title}</h3>}
          {description && <p className="text-sm text-[var(--color-muted-text)] m-0">{description}</p>}
        </div>
      )}
      
      <div className="p-6 flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-[var(--color-border)] bg-gray-50/50 rounded-b-[var(--radius-lg)]">
          {footer}
        </div>
      )}
    </div>
  );
}
