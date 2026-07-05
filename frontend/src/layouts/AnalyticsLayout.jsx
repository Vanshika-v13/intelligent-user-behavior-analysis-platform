import { Outlet } from 'react-router-dom';
import { AnalyticsProvider } from '../../context/analytics/AnalyticsContext';
import AnalyticsErrorBoundary from '../../components/analytics/feedback/AnalyticsErrorBoundary';

const AnalyticsLayout = () => {
  return (
    <AnalyticsProvider>
      <AnalyticsErrorBoundary>
        <div className="flex flex-col h-full w-full">
          {/* 
            Analytics specific global header (e.g., global date filters) 
            would be mounted here later. For now, it provides the foundation.
          */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
            <Outlet />
          </div>
        </div>
      </AnalyticsErrorBoundary>
    </AnalyticsProvider>
  );
};

export default AnalyticsLayout;
