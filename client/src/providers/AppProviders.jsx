import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import QueryProvider from './QueryProvider';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DashboardProvider } from '../contexts/DashboardContext';
import ErrorFallback from '../components/ui/ErrorFallback';

export default function AppProviders({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <DashboardProvider>
          <QueryProvider>
            <BrowserRouter>
              {children}
              <Toaster position="top-right" />
            </BrowserRouter>
          </QueryProvider>
        </DashboardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
