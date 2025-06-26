import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

const Navbar = ({ isAuthenticated, userRole, toggleSidebar, userFirstName }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const {authDataState, clearAuthData} = useAuth()

  const [userName, setUserName] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (userFirstName) {
      setUserName(userFirstName);
    } else {
      setUserName('Guest');
    }
  }, [userFirstName]);

  const isAdminArea = currentPath.startsWith('/admin');

  const navItemClass = (path) =>
    `text-gray-800 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md ${
      currentPath === path ? "text-blue-600 font-medium" : ""
    }`;

  const handleLogout = () => {
   clearAuthData()
    navigate("/login");

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', () => {
      navigate("/login");
    });
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
    <nav className="bg-white shadow-md px-4 sm:px-8 py-4 flex justify-between items-center font-sans relative">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {isAdminArea && isAuthenticated && (
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
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

      {/* Desktop Menu */}
      <ul className="hidden sm:flex space-x-6 items-center text-base">
        {isAdminArea ? (
          isAuthenticated && (
            <>
              <NotificationBell />
              <li>
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 text-gray-800 hover:text-blue-600 px-3 py-2"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="font-medium">{userName}</span>
                </Link>
              </li>
            </>
          )
        ) : (
          <>
            <li><Link to="/home" className={navItemClass("/home")}>Home</Link></li>
            <li><Link to="/search" className={navItemClass("/search")}>Browse Listings</Link></li>
            <li><Link to="/ourservices" className={navItemClass("/ourservices")}>Our Services</Link></li>
            <li><Link to="/team" className={navItemClass("/team")}>Our Team</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/admin/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Dashboard</Link></li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-gray-800 hover:text-gray-600 px-3 py-2">
                    <PowerIcon className="w-5 h-5" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className={navItemClass("/login")}>Login</Link></li>
                <li><Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Signup</Link></li>
              </>
            )}
          </>
        )}
      </ul>

      {/* Mobile menu button (public only) */}
      {!isAdminArea && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden text-gray-700 hover:text-blue-600"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Mobile menu items */}
      {!isAdminArea && showMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 px-6 py-4 sm:hidden">
          <ul className="flex flex-col space-y-4">
            <li><Link to="/home" className={navItemClass("/home")}>Home</Link></li>
            <li><Link to="/search" className={navItemClass("/search")}>Browse Listings</Link></li>
            <li><Link to="/ourservices" className={navItemClass("/ourservices")}>Our Services</Link></li>
            <li><Link to="/team" className={navItemClass("/team")}>Our Team</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/admin/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Dashboard</Link></li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-gray-800 hover:text-gray-600 px-3 py-2">
                    <PowerIcon className="w-5 h-5" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className={navItemClass("/login")}>Login</Link></li>
                <li><Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Signup</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
