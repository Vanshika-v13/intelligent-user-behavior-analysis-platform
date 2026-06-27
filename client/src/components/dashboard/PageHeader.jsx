import React from 'react';
import clsx from 'clsx';

export default function PageHeader({ title, description, action, className }) {
  return (
    <div className={clsx("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-[var(--font-size-h2)] font-bold text-[var(--color-text)] mb-2">{title}</h1>
        {description && <p className="text-[var(--color-muted-text)]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
