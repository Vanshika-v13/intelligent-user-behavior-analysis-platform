import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAnalyticsFilter, buildBackendParams } from '../../../context/analytics/AnalyticsFilterContext';
import { useCourseList } from '../../../hooks/analytics/useCourseList';
import { exportAnalytics } from '../../../services/analytics/analyticsExportService';

export const AnalyticsHeader = () => {
  const {
    dateRange,
    timeInterval,
    courseFilter,
    actions,
  } = useAnalyticsFilter();

  // Dynamic course list from the Learning Platform API
  const { courses, isLoading: coursesLoading } = useCourseList();

  // Export state
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null); // null | 'success' | 'error'
  const exportRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!exportOpen) return;
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportOpen]);

  // Auto-clear status toast after 3 seconds
  useEffect(() => {
    if (!exportStatus) return;
    const t = setTimeout(() => setExportStatus(null), 3000);
    return () => clearTimeout(t);
  }, [exportStatus]);

  const handleExport = useCallback(async (format) => {
    setExportOpen(false);
    setExporting(true);
    setExportStatus(null);
    try {
      // Build the same filter params sent to every other analytics endpoint
      const filters = buildBackendParams({ dateRange, timeInterval, courseFilter });
      await exportAnalytics(filters, format);
      setExportStatus('success');
    } catch (err) {
      console.error('[Analytics Export] Export failed:', err);
      setExportStatus('error');
    } finally {
      setExporting(false);
    }
  }, [dateRange, timeInterval, courseFilter]);

  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border/60 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      <div>
        <h1 className="text-xl font-heading font-semibold text-primary-text tracking-tight">Executive Overview</h1>
        <p className="text-sm text-muted/80 mt-0.5">Platform health and key performance indicators.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Filter */}
        <select
          value={dateRange}
          onChange={(e) => actions.setDateRange(e.target.value)}
          className="px-3 py-1.5 bg-background border border-border/60 rounded-soft text-sm text-primary-text font-medium hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all cursor-pointer shadow-sm"
          aria-label="Date Range"
          id="analytics-date-range"
        >
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last 90 Days</option>
          <option value="1Y">Last Year</option>
        </select>

        {/* Time Interval Filter — only backend-supported values */}
        <select
          value={timeInterval}
          onChange={(e) => actions.setTimeInterval(e.target.value)}
          className="px-3 py-1.5 bg-background border border-border/60 rounded-soft text-sm text-primary-text font-medium hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all cursor-pointer shadow-sm"
          aria-label="Time Interval"
          id="analytics-time-interval"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>

        {/* Course Filter — Dynamic from Learning Platform API */}
        <select
          value={courseFilter}
          onChange={(e) => actions.setCourseFilter(e.target.value)}
          className="px-3 py-1.5 bg-background border border-border/60 rounded-soft text-sm text-primary-text font-medium hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all cursor-pointer shadow-sm"
          aria-label="Course Filter"
          id="analytics-course-filter"
          disabled={coursesLoading}
        >
          <option value="all">{coursesLoading ? 'Loading courses…' : 'All Courses'}</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block"></div>

        {/* Refresh Button */}
        <button
          onClick={() => actions.triggerGlobalRefresh()}
          className="p-1.5 text-muted hover:text-primary-text hover:bg-muted/10 rounded-soft transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          title="Refresh Data"
          aria-label="Refresh Data"
          id="analytics-refresh-btn"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Export Button — dropdown with CSV and Excel */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => !exporting && setExportOpen((v) => !v)}
            disabled={exporting}
            className="px-4 py-1.5 bg-primary text-surface rounded-soft text-sm font-medium hover:bg-primary/90 hover:shadow-md transition-all shadow-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Export Report"
            aria-expanded={exportOpen}
            aria-haspopup="menu"
            id="analytics-export-btn"
          >
            {exporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Exporting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
                <svg className="w-3 h-3 ml-0.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {exportOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 bg-surface border border-border/60 rounded-soft shadow-premium overflow-hidden z-30 animate-in fade-in slide-in-from-top-1 duration-150"
              id="analytics-export-menu"
            >
              <button
                role="menuitem"
                onClick={() => handleExport('csv')}
                className="w-full text-left px-4 py-2.5 text-sm text-primary-text hover:bg-primary/8 flex items-center gap-2.5 transition-colors"
                id="analytics-export-csv"
              >
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <div className="h-px bg-border/40 mx-3" />
              <button
                role="menuitem"
                onClick={() => handleExport('xlsx')}
                className="w-full text-left px-4 py-2.5 text-sm text-primary-text hover:bg-primary/8 flex items-center gap-2.5 transition-colors"
                id="analytics-export-xlsx"
              >
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Export Excel
              </button>
            </div>
          )}
        </div>

        {/* Status Toast */}
        {exportStatus === 'success' && (
          <span className="text-xs text-success font-medium flex items-center gap-1 animate-in fade-in duration-200" id="analytics-export-success">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Download started
          </span>
        )}
        {exportStatus === 'error' && (
          <span className="text-xs text-error font-medium flex items-center gap-1 animate-in fade-in duration-200" id="analytics-export-error">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Export failed
          </span>
        )}
      </div>
    </header>
  );
};
