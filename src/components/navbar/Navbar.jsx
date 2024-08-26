import React, { useState, useEffect } from 'react';
import { User, Bell } from 'lucide-react';
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

  const fetchUserIdAndNotifications = async () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      try {
        const response = await axiosInstance.get(`/data/${email}`);
        setUserId(response.data.data._id);
        console.log('userrrr', response.data.data._id);
        // Fetch notifications after setting userId
        const notificationsResponse = await axiosInstance.get(`/notifications/${response.data.data._id}`);
        console.log(notificationsResponse.data.data);
        setNotifications(notificationsResponse.data.data.notification || []);
      } catch (error) {
        console.error('Error fetching user ID or notifications:', error);
        setNotifications([]); // Set to empty array on error
      }
    }
  };
  
  useEffect(() => {
    fetchUserIdAndNotifications();
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchUserIdAndNotifications();
    }, 10000);
    return () => clearInterval(pollInterval); 
  }, [userId]);
  

  useEffect(() => {
    console.log('Notifications updated:', notifications);
  }, [notifications]);
  

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchUserIdAndNotifications(); // Fetch notifications when the dropdown is opened
    }
  };

  const handleClearNotification = async (index) => {
    try {
      // Assuming you have a list of notifications in state
      const notificationId = notifications[index]._id; // Retrieve the notification ID
       // Replace with the actual admin ID
  
      // Make a DELETE request to the backend
      console.log(notificationId);
      const response = await axiosInstance.delete(`/notifications/${userId}/${notificationId}`);
  
      if (response.data.success) {
        // Remove the notification from the local state if the deletion is successful
        const updatedNotifications = [...notifications];
        updatedNotifications.splice(index, 1);
        setNotifications(updatedNotifications);
        console.log('Notification deleted successfully');
      } else {
        console.log('Failed to delete notification:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };



  const formattedDate = currentDateTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/');

  const formattedTime = currentDateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const formattedDateTime = `${formattedDate} - ${formattedTime}`;

  return (
    <div className="bg-gray-100 p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4 relative">
        <div className="border-2 border-purple-500 text-purple-500 px-4 py-2 rounded-lg text-sm shadow-lg">
        {formattedDateTime}
        </div>

        <User className="text-gray-600 cursor-pointer w-5 h-5" />
        <div className="relative">
          <Bell 
            className="text-gray-600 cursor-pointer w-5 h-5 hover:text-purple-500 transition-colors" 
            onClick={handleNotificationClick} 
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
          {showNotifications && (
            <div className="notification-dropdown shadow-lg bg-white rounded-lg absolute right-0 mt-2 w-[300px] max-h-[400px] overflow-hidden z-50">
              <div className="p-2 bg-purple-400 text-white font-semibold">
                Notifications
              </div>
              <div className="overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hide-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="notification-item p-4 border-b hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="text-sm font-medium">{notification.message}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {moment(notification.createdAt).fromNow()}
                          </div>
                        </div>
                        <button
                          className="text-xs text-purple-500 hover:text-purple-700 ml-2"
                          onClick={() => handleClearNotification(index)}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Navbar;