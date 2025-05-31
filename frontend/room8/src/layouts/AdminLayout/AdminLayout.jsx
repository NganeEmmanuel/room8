import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const AdminLayout = ({ isAuthenticated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem("userRole");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden sm:flex sm:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar role={userRole} />
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <div className="sm:hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar role={userRole} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <div className="flex-shrink-0">
          <Navbar
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;