import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-[62px] bg-white border-b border-[#E2E8F0] flex items-center px-4 shrink-0 shadow-sm sticky top-0 z-20">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-[#0F172A]">Dashboard</span>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
