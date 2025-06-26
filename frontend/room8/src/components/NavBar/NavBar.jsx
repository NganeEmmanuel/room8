import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon, UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = ({ isAuthenticated, userRole, toggleSidebar, userFirstName }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { clearAuthData } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminArea = currentPath.startsWith("/admin");

  const userName = userFirstName || "Guest";

  const handleLogout = () => {
    clearAuthData();
    navigate("/login", { replace: true });
  };

  const navItemClass = (path) =>
    `text-gray-800 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md ${
      currentPath === path ? "text-blue-600 font-medium" : ""
    }`;

  const handleHamburgerClick = () => {
    if (isAdminArea && toggleSidebar) {
      toggleSidebar();
    } else {
      setMobileMenuOpen((prev) => !prev);
    }
  };

  const getHomeLink = () => {
    if (!isAuthenticated) return "/home";
    switch (userRole) {
      case "tenant":
      case "landlord":
      case "tenant-landlord":
        return "/admin/dashboard";
      default:
        return "/home";
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 sm:px-8 py-4 flex justify-between items-center font-sans z-50 relative">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleHamburgerClick}
            className="sm:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <Link to={getHomeLink()}>
            <img
              src={import.meta.env.PROD ? "/room8/logo.png" : "logo.png"}
              alt="Room8 Logo"
              className="h-10"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex space-x-6 items-center text-base">
          {isAdminArea ? (
            isAuthenticated && (
              <>
                <NotificationBell />
                <li>
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md"
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
                  <li>
                    <Link to="/admin/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-800 hover:text-gray-600">
                      <PowerIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className={navItemClass("/login")}>Login</Link></li>
                  <li>
                    <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Nav Drawer (Public only) */}
      {!isAdminArea && mobileMenuOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 sm:hidden transition duration-300">
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <ul className="flex flex-col space-y-4 p-4">
            <li><Link to="/home" className={navItemClass("/home")} onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/search" className={navItemClass("/search")} onClick={() => setMobileMenuOpen(false)}>Browse Listings</Link></li>
            <li><Link to="/ourservices" className={navItemClass("/ourservices")} onClick={() => setMobileMenuOpen(false)}>Our Services</Link></li>
            <li><Link to="/team" className={navItemClass("/team")} onClick={() => setMobileMenuOpen(false)}>Our Team</Link></li>
            {!isAuthenticated ? (
              <>
                <li><Link to="/signup" className={navItemClass("/signup")} onClick={() => setMobileMenuOpen(false)}>Signup</Link></li>
                <li><Link to="/login" className={navItemClass("/login")} onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/admin/dashboard" className={navItemClass("/admin/dashboard")} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link></li>
                <li><button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
