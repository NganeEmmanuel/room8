import React, { useState, useEffect, useRef, useContext } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { fetchNotifications, markNotificationAsRead } from '../../services/notificationService/notificationService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // adjust if path differs
import { getReadableTime } from '../../utils/dateUtils'; // optional util to prettify time
import { useAuthService } from '../../services/authService/AuthService';

const NotificationItem = ({ notification, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${
      notification.status === "UNREAD" ? 'bg-blue-50' : ''
    }`}
  >
    <div>
      <p className={`text-sm font-medium ${notification.status === "UNREAD" ? 'text-blue-700' : 'text-gray-800'}`}>
        {notification.title}
      </p>
      <p className="text-sm text-gray-600">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-1">{getReadableTime(notification.dateCreated)}</p>
    </div>
  </button>
);

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { authDataState } = useAuth(); // assumes userInfo has id
  const { userInfo } = authDataState; 
  const { refreshToken } = useAuthService()

  const fetchAndSetNotifications = async () => {
    if (userInfo?.id) {
      console.log("calling fetch notification for userId: "+userInfo?.id)
      const data = await fetchNotifications(userInfo.id, refreshToken);
      setNotifications(data || []);
    }
  };

  // Periodically poll notifications
  useEffect(() => {
    fetchAndSetNotifications();
    const interval = setInterval(fetchAndSetNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, [userInfo]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;

  const handleNotificationClick = async (notif) => {
    if (notif.status === "UNREAD") {
      await markNotificationAsRead(notif.bidId, userInfo.id, refreshToken);
      setNotifications((prev) =>
        prev.map((n) => (n.bidId === notif.bidId ? { ...n, status: "READ" } : n))
      );
    }

    if (notif.title === "New Bid Received") {
      navigate("/admin/landlord/bids");
    }
  };

  return (
    <li className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-20 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <p className="text-sm text-gray-500">You have {unreadCount} unread message(s).</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-6">You don’t have any notifications at this time.</p>
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={`${notif.userId}-${notif.title}-${new Date(notif.dateCreated).getTime()}`}
                  notification={notif}
                  onClick={() => handleNotificationClick(notif)}
                />
              ))
            )}
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
