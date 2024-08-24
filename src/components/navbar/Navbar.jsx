import React, { useState, useEffect } from 'react';
import { Search, User, Settings, Bell } from 'lucide-react';
import axiosInstance from '../../axiosInstance';
import moment from 'moment';

const Navbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userId, setUserId] = useState(null);
  const [maxNotificationsToShow, setMaxNotificationsToShow] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        try {
          const response = await axiosInstance.get(`/data/${email}`);
          setUserId(response.data.data._id);
          console.log('userrrr', userId);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };

    fetchUserId();
  }, []);

  const fetchNotifications = async () => {
    if (userId) {
      try {
        console.log('lala ', userId);
        const response = await axiosInstance.get(`/notifications/${userId}`);
        setNotifications(response.data.data.notification);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications(); // Fetch notifications when the dropdown is opened
    }
  };

  const handleClearNotification = (index) => {
    // Add your logic to clear the notification here
    console.log(`Clearing notification at index ${index}`);
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  return (
    <div className="bg-gray-100 p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4 relative">
        <div className="relative shadow-lg">
          <input
            type="text"
            placeholder="Type here..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        <div className="border-2 border-purple-500 text-purple-500 px-4 py-2 rounded-lg text-sm shadow-lg">
          {currentDateTime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '/')}
        </div>

        <User className="text-gray-600 cursor-pointer w-5 h-5" />
        <Settings className="text-gray-600 cursor-pointer w-5 h-5" />
        <div className="relative">
          <Bell className="text-gray-600 cursor-pointer w-5 h-5" onClick={handleNotificationClick} />
          {showNotifications && (
            <div className="notification-dropdown shadow-lg bg-white p-4 rounded-lg absolute right-0 mt-2 w-[400px] max-h-[400px] overflow-y-hidden">
              {notifications.length > 0 ? (
                notifications
                  .slice(0, maxNotificationsToShow)
                  .map((notification, index) => (
                    <div key={index} className="notification-item mb-2 flex justify-between items-center">
                      <div>
                        <div>{notification.message}</div>
                        <div className="text-gray-500 text-xs">
                          {moment(notification.createdAt).format('MMM DD, YYYY')}
                        </div>
                      </div>
                      <div
                        className="text-purple-500 cursor-pointer"
                        onClick={() => handleClearNotification(index)}
                      >
                        Clear
                      </div>
                    </div>
                  ))
              ) : (
                <div>No new notifications</div>
              )}
              {notifications.length > maxNotificationsToShow && (
                <div className="text-center text-purple-500 cursor-pointer">
                  View all {notifications.length} notifications
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;