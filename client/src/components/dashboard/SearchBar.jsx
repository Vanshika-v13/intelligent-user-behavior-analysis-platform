import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

export default function SearchBar({ placeholder = 'Search...', className, onSearch, debounceMs = 300, ...props }) {
  const [value, setValue] = useState(props.value || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearch) onSearch(value);
    }, debounceMs);

    return () => clearTimeout(debounceRef.current);
  }, [value, onSearch, debounceMs]);

  return (
    <div className={clsx("relative w-full max-w-md group", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-muted-text)] group-focus-within:text-[var(--color-primary)] transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-11 pr-10 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all disabled:opacity-50 disabled:bg-gray-50"
        {...props}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-muted-text)] hover:text-[var(--color-text)] transition-colors focus:outline-none"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
