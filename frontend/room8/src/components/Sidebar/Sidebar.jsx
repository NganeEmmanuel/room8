import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookmarkIcon,
  BuildingLibraryIcon,
  UserIcon,
  Cog6ToothIcon,
  PowerIcon,
  ChartBarIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ${
      isActive(path) ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600" : ""
    }`;

  // Common links for all roles
  const commonLinks = [
    {
      name: "Dashboard",
      to: "/admin/dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
    },
  ];

  // Tenant-specific links
  const tenantLinks = [
    {
      name: "Saved Listings",
      to: "/admin/tenant/saved",
      icon: <HeartIcon className="w-5 h-5" />,
    },
    {
      name: "My Bids",
      to: "/admin/tenant/bids",
      icon: <BookmarkIcon className="w-5 h-5" />,
    },
    {
      name: "Recently Viewed",
      to: "/admin/tenant/recent",
      icon: <EyeIcon className="w-5 h-5" />,
    },
  ];

  // Landlord-specific links
  const landlordLinks = [
    {
      name: "My Listings",
      to: "/admin/landlord/listings",
      icon: <BuildingLibraryIcon className="w-5 h-5" />,
    },
    {
      name: "Received Bids",
      to: "/admin/landlord/bids",
      icon: <BookmarkIcon className="w-5 h-5" />,
    },
    // {
    //   name: "Analytics",
    //   to: "/admin/landlord/analytics",
    //   icon: <ChartBarIcon className="w-5 h-5" />,
    // },
  ];

  // Profile and settings links
  const bottomLinks = [
    {
      name: "Profile",
      to: "/admin/profile",
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      name: "Settings",
      to: "/admin/settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
  ];

  // Determine which links to show based on role
  const getRoleLinks = () => {
    switch (role) {
      case "tenant":
        return tenantLinks;
      case "landlord":
        return landlordLinks;
      case "tenant-landlord":
        return [
          ...tenantLinks,
          { type: "divider", name: "Landlord Section" },
          ...landlordLinks,
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleLinks();
  const allLinks = [...commonLinks, ...roleLinks];

  return (
    <aside className="h-full w-64 bg-white shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin/dashboard">
          <img src="/logo.png" alt="Room8 Logo" className="h-10" />
        </Link>
        {role && (
          <div className="mt-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
              {role === "tenant-landlord" ? "Tenant & Landlord" : role}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-2">
          {allLinks.map((link, idx) => {
            if (link.type === "divider") {
              return (
                <div key={idx} className="py-2">
                  <div className="border-t border-gray-200 my-2"></div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                    {link.name}
                  </span>
                </div>
              );
            }

            return (
              <Link key={idx} to={link.to} className={linkClass(link.to)}>
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {bottomLinks.map((link, idx) => (
          <Link key={idx} to={link.to} className={linkClass(link.to)}>
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 mt-4"
        >
          <PowerIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;