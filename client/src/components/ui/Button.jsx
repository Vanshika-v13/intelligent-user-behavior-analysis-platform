import React from 'react';
import clsx from 'clsx';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className, 
  disabled, 
  loading,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-colors duration-200 rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-gray-50 focus:ring-gray-200",
    outline: "bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-[var(--color-danger)] text-white hover:bg-red-600 focus:ring-red-500",
    ghost: "bg-transparent text-[var(--color-text)] hover:bg-gray-100 focus:ring-gray-200 border-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button 
      disabled={disabled || loading} 
      className={clsx(baseStyle, variants[variant], sizes[size], className)} 
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
