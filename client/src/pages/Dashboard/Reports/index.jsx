import React from 'react';
import { useOverviewAnalytics } from '../../../hooks/queries/useAnalytics';
import { useDashboard } from '../../../contexts/DashboardContext';
import { DateRangeSelector } from '../../../components/dashboard/DateRangeSelector';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import { Card } from '../../../components/ui/Card';
import { FileText, Download, Printer } from 'lucide-react';

export default function ReportsAnalytics() {
  const { selectedDateRange } = useDashboard();
  const { data, isLoading } = useOverviewAnalytics();

  const handleExport = (type, format) => {
    console.log(`Exporting ${type} as ${format}`);
    alert(`Generating ${format} report for ${type}...`);
  };

  const handlePrint = (type) => {
    console.log(`Printing ${type} report`);
    window.print();
  };

  const ReportCard = ({ title, description, type }) => (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <FileText size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => handleExport(type, 'CSV')}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download size={16} />
              CSV
            </button>
            <button 
              onClick={() => handleExport(type, 'JSON')}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download size={16} />
              JSON
            </button>
            <button 
              onClick={() => handlePrint(type)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and download detailed analytics reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard 
          title="Analytics Summary" 
          description="A comprehensive overview of all platform metrics, including top-level KPIs for sessions, events, and engagement."
          type="overview"
        />
        <ReportCard 
          title="Session Report" 
          description="Detailed log of all user sessions, including duration, browser, platform, and session status."
          type="sessions"
        />
        <ReportCard 
          title="Event Report" 
          description="Raw event data capturing every user interaction, page view, and custom event triggered."
          type="events"
        />
        <ReportCard 
          title="Engagement Report" 
          description="Aggregated engagement metrics, user segments, and interaction scores across the platform."
          type="engagement"
        />
      </div>
    </div>
  );
}
