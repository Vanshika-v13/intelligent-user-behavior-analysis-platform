import React from 'react';
import { Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { useDashboard } from '../../contexts/DashboardContext';

export function DateRangeSelector() {
  const { selectedDateRange, setSelectedDateRange } = useDashboard();
  
  // This is a placeholder for a real date range picker like react-datepicker or react-date-range
  // For now, it cycles through some predefined ranges
  const cycleRange = () => {
    if (!selectedDateRange.startDate) {
      setSelectedDateRange({ startDate: '2023-01-01', endDate: '2023-01-31' });
    } else {
      setSelectedDateRange({ startDate: null, endDate: null });
    }
  };

  return (
    <Button variant="outline" onClick={cycleRange} className="flex items-center gap-2">
      <Calendar size={16} className="text-gray-500" />
      <span className="text-sm font-medium">
        {selectedDateRange.startDate && selectedDateRange.endDate
          ? `${selectedDateRange.startDate} - ${selectedDateRange.endDate}`
          : 'All time'}
      </span>
    </Button>
  );
}
