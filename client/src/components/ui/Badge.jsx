import React from 'react';
import clsx from 'clsx';

export default function Badge({ children, variant = 'neutral', className }) {
  const variants = {
    primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
    neutral: "bg-gray-100 text-[var(--color-muted-text)]",
    outline: "border border-[var(--color-border)] text-[var(--color-text)] bg-transparent",
  };

  return (
    <span className={clsx(
      "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
      variants[variant] || variants.neutral,
      className
    )}>
      {children}
    </span>
  );
}
