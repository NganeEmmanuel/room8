import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, UserCircleIcon, PowerIcon, BellIcon } from "@heroicons/react/24/outline"; // Added BellIcon
import React, { useEffect, useState } from "react";

const Navbar = ({ isAuthenticated, userRole, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // State to hold the user's name
  const [userName, setUserName] = useState('');
  // State for notification count (optional, but good for an icon)
  const [notificationCount] = useState(3); // Example count

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else if (userRole) {
      setUserName(userRole.charAt(0).toUpperCase() + userRole.slice(1).replace('-', ' & '));
    } else {
      setUserName('Guest');
    }

    // In a real app, you would fetch actual notification count here
    // For now, it's a static example
  }, [userRole]);

  const isAdminArea = currentPath.startsWith('/admin');

  const navItemClass = (path) =>
    `text-gray-800 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md ${
      currentPath === path ? "text-blue-600 font-medium" : ""
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    navigate("/login");
  };

  const getHomeLink = () => {
    if (!isAuthenticated) return "/home";

    switch (userRole) {
      case 'tenant':
      case 'landlord':
      case 'tenant-landlord':
        return "/admin/dashboard";
      default:
        return "/home";
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 sm:px-8 py-4 flex justify-between items-center font-sans">
      {/* Left side: hamburger (for admin area mobile) and conditionally logo */}
      <div className="flex items-center gap-4">
        {isAdminArea && isAuthenticated && (
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        )}
        {!isAdminArea && (
          <div className="text-2xl font-bold text-blue-600 tracking-tight">
            <Link to={getHomeLink()}>
              <img src="/logo.png" alt="Room8 Logo" className="h-12" />
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <ul className="hidden sm:flex space-x-6 items-center text-base">
        {isAdminArea ? (
          // Admin area - show notification icon and profile icon/name
          isAuthenticated && (
            <>
              {/* Notification Icon */}
              <li className="relative">
                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  <BellIcon className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </li>

              {/* Profile Icon and Name */}
              <li>
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="font-medium">{userName}</span>
                </Link>
              </li>
            </>
          )
        ) : (
          // Public area navigation
          <>
            <li>
              <Link to="/home" className={navItemClass("/home")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className={navItemClass("/search")}>
                Browse Listings
              </Link>
            </li>
            <li>
              <Link to="/services" className={navItemClass("/services")}>
                Our Services
              </Link>
            </li>
            <li>
              <Link to="/about" className={navItemClass("/about")}>
                Our Team
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors duration-200 px-3 py-2 rounded-md"
                  >
                    <PowerIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={navItemClass("/login")}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>

      {/* Mobile menu button for public area */}
      {!isAdminArea && (
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;