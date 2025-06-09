import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationItem = ({ title, time, details, read = false }) => (
  <a href="#" className={`block px-4 py-3 hover:bg-gray-100 ${!read ? 'bg-blue-50' : ''}`}>
    <div className="flex items-center">
      <div className="flex-1">
        <p className={`text-sm font-medium ${!read ? 'text-blue-700' : 'text-gray-800'}`}>{title}</p>
        <p className="text-sm text-gray-600">{details}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  </a>
);

const NotificationBell = () => {
  // Mock data - in a real app, this would come from an API
  const [notifications] = useState([
    { title: "New Bid Received", details: "You received a $750 bid on 'Cozy Downtown Room'.", time: "5 minutes ago", read: false },
    { title: "Listing Expiring Soon", details: "'Sunny Loft Apartment' will expire in 3 days.", time: "2 hours ago", read: false },
    { title: "Welcome to Room8!", details: "Complete your profile to get started.", time: "1 day ago", read: true },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const notificationCount = notifications.filter(n => !n.read).length;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <li className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        <BellIcon className="w-6 h-6" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-20 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <p className="text-sm text-gray-500">You have {notificationCount} unread messages.</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((item, index) => (
              <NotificationItem key={index} {...item} />
            ))}
          </div>
           <div className="px-4 py-3 border-t border-gray-200 text-center">
             <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
               View all notifications
             </a>
          </div>
        </div>
      )}
    </li>
  );
};

export default NotificationBell;