import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline"; // Added BellIcon
import React, { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell.jsx";

const Navbar = ({ isAuthenticated, userRole, toggleSidebar, userFirstName }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // State to hold the user's name
  const [userName, setUserName] = useState('');
  // State for notification count (optional, but good for an icon)// Example count

  useEffect(() => {
    if (userFirstName) {
      setUserName(userFirstName);
    } else {
      setUserName('Guest');
      // navigate('/home')
       
    }

    // In a real app, you would fetch actual notification count here
    // For now, it's a static example
  }, [userFirstName]);

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
              <img src={import.meta.env.PROD ? '/room8/logo.png' : '/logo.png'} alt="Room8 Logo" className="h-12" />
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
              <NotificationBell/>

              {/* Profile Icon and Name */}
              <li>
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="font-medium">{userFirstName}</span>
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
              <Link to="/ourservices" className={navItemClass("/ourservices")}>
                Our Services
              </Link>
            </li>
            <li>
              <Link to="/team" className={navItemClass("/team")}>
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
