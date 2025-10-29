import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <Navbar onToggle={() => setSidebarOpen((s) => !s)} />
      <main className="pt-16 p-6 md:ml-64 my-5">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;