import React from 'react';
import clsx from 'clsx';
import { Filter, X } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import Button from '../ui/Button';

export default function FilterBar({ 
  filters, 
  activeFilter, 
  onChange, 
  dateRange, 
  onDateChange, 
  onReset, 
  className 
}) {
  return (
    <div className={clsx("flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-md)]", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        <div className="flex items-center gap-2 text-[var(--color-muted-text)] shrink-0 text-sm font-medium">
          <Filter size={16} />
          <span>Filters:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {filters && filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onChange(filter.value)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                activeFilter === filter.value
                  ? "bg-[var(--color-primary)] text-white focus:ring-[var(--color-primary)]"
                  : "bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 focus:ring-gray-200"
              )}
            >
              {filter.label}
            </button>
          ))}
          
          <div className="w-px h-6 bg-[var(--color-border)] mx-2 hidden sm:block" />
          
          <DateRangePicker 
            startDate={dateRange?.startDate} 
            endDate={dateRange?.endDate} 
            onChange={onDateChange} 
          />
        </div>
      </div>
      
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} className="shrink-0 text-[var(--color-muted-text)] hover:text-[var(--color-text)]">
          <X size={16} className="mr-1" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
