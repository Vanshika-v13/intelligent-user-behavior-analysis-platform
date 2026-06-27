import React from 'react';
import clsx from 'clsx';
import { FolderSearch } from 'lucide-react';

export default function EmptyState({ title, description, action, icon: Icon = FolderSearch, className }) {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg)] border-2 border-dashed border-gray-200 bg-gray-50/50", className)}>
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[var(--color-muted-text)]">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-[var(--color-muted-text)] text-sm max-w-md mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
