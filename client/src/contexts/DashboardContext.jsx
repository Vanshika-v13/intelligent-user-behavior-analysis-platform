import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const value = {
    selectedDateRange,
    setSelectedDateRange,
    selectedFilters,
    setSelectedFilters,
    sidebarCollapsed,
    setSidebarCollapsed,
    activeCourse,
    setActiveCourse,
    selectedUser,
    setSelectedUser
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
