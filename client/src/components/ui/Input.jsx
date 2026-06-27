import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ className, label, error, helperText, id, ...props }, ref) => {
  const inputId = id || React.useId();
  
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-text)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text)] placeholder:text-[var(--color-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          error && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-[var(--color-danger)]" role="alert">{error}</p>}
      {!error && helperText && <p className="text-sm text-[var(--color-muted)]">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
