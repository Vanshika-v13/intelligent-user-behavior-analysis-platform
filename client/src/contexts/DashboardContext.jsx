import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const value = {
    selectedDateRange,
    setSelectedDateRange,
    selectedCourse,
    setSelectedCourse,
    selectedUser,
    setSelectedUser,
    selectedSession,
    setSelectedSession,
    selectedEventType,
    setSelectedEventType,
    sidebarCollapsed,
    setSidebarCollapsed
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
