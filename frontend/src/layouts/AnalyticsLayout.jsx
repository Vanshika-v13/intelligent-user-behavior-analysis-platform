import { Outlet } from 'react-router-dom';
import { AnalyticsFilterProvider } from '../context/analytics/AnalyticsFilterContext';
import AnalyticsErrorBoundary from '../components/analytics/feedback/AnalyticsErrorBoundary';
import { AnalyticsSidebar } from '../components/analytics/layout/AnalyticsSidebar';
import { AnalyticsHeader } from '../components/analytics/layout/AnalyticsHeader';

const AnalyticsLayout = () => {
  return (
    <AnalyticsFilterProvider>
      <AnalyticsErrorBoundary>
        <div className="flex h-screen w-full bg-background overflow-hidden text-primary-text font-sans">
          <AnalyticsSidebar />
          
          <div className="flex-1 flex flex-col min-w-0">
            <AnalyticsHeader />
            
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </AnalyticsErrorBoundary>
    </AnalyticsFilterProvider>
  );
};

export default AnalyticsLayout;
