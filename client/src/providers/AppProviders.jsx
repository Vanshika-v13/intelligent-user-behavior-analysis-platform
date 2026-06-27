import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import QueryProvider from './QueryProvider';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DashboardProvider } from '../contexts/DashboardContext';
import { AnalyticsProvider } from '../contexts/AnalyticsContext';
import ErrorFallback from '../components/ui/ErrorFallback';

// Tracking Components
import AnalyticsInitializer from '../components/tracking/AnalyticsInitializer';
import SessionTracker from '../components/tracking/SessionTracker';
import PageTracker from '../components/tracking/PageTracker';
import EventTracker from '../components/tracking/EventTracker';
import IdleTracker from '../components/tracking/IdleTracker';

export default function AppProviders({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <DashboardProvider>
          <AnalyticsProvider>
            <QueryProvider>
              <BrowserRouter>
                <AnalyticsInitializer />
                <SessionTracker />
                <PageTracker />
                <EventTracker />
                <IdleTracker />
                {children}
                <Toaster position="top-right" />
              </BrowserRouter>
            </QueryProvider>
          </AnalyticsProvider>
        </DashboardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
