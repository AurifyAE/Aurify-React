import React, { useState, useEffect, useRef } from 'react';
import { User, Bell } from 'lucide-react';
import axiosInstance from '../../axios/axiosInstance';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const fetchAdminIdAndNotifications = async () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      try {
        const response = await axiosInstance.get(`/data/${userName}`);
        setAdminId(response.data.data._id);
        // Fetch notifications after setting adminId
        const notificationsResponse = await axiosInstance.get(`/notifications/${response.data.data._id}`);
        if (notificationsResponse.data && notificationsResponse.data.data) {
          setNotifications(notificationsResponse.data.data.notification || []);
        } else {
          setNotifications([]); // Set to empty array if no notifications
        }
      } catch (error) {
        console.error('Error fetching user ID or notifications:', error);
        setNotifications([]); // Set to empty array on error
      }
    }
  };
  
  
  useEffect(() => {
    fetchAdminIdAndNotifications();
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchAdminIdAndNotifications();
    }, 10000);
    return () => clearInterval(pollInterval); 
  }, [adminId]);
  


  

  const handleNotificationClick = async (notification) => {
    let route = '';
    if (notification.message.toLowerCase().includes('new banner')) {
      route = '/feature/digital-marketing';
    } else if (notification.message.toLowerCase().includes('new user')) {
      route = '/feature/users';
    }

    if (route) {
      try {
        // Delete the notification
        await axiosInstance.delete(`/notifications/${adminId}/${notification._id}`);
        
        // Update local state
        setNotifications(prevNotifications => 
          prevNotifications.filter(n => n._id !== notification._id)
        );

        // Navigate to the appropriate route
        navigate(route);
        setShowNotifications(false);
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchAdminIdAndNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClearNotification = async (index) => {
    try {
      // Assuming you have a list of notifications in state
      const notificationId = notifications[index]._id; // Retrieve the notification ID
       // Replace with the actual admin ID
  
      // Make a DELETE request to the backend
      const response = await axiosInstance.delete(`/notifications/${adminId}/${notificationId}`);
  
      if (response.data.success) {
        // Remove the notification from the local state if the deletion is successful
        const updatedNotifications = [...notifications];
        updatedNotifications.splice(index, 1);
        setNotifications(updatedNotifications);
      } else {
        console.log('Failed to delete notification:');
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
    <div className="w-full h-[72px] bg-white border-b border-[#ECEEF2] px-6 flex items-center justify-between">
    
      {/* RIGHT */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* DATE */}
        <div className="hidden md:flex items-center px-4 h-[42px] rounded-xl border border-[#ECEEF2] bg-[#FAFAFA]">
          <span className="text-[13px] font-medium text-[#4B5563]">
            {formattedDateTime}
          </span>
        </div>
  
        {/* NOTIFICATION */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="relative w-[42px] h-[42px] rounded-xl border border-[#ECEEF2] bg-[#FAFAFA] flex items-center justify-center hover:bg-[#F3F4F6] transition-all"
          >
            <Bell size={18} className="text-[#4B5563]" />
  
            {notifications.length > 0 && (
              <span className="absolute top-[-4px] right-[-2px] min-w-[18px] h-[18px] px-1 rounded-full bg-[#111827] text-white text-[10px] flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
  
          {/* DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 top-[52px] w-[320px] bg-white border border-[#ECEEF2] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden z-50">
              
              {/* HEADER */}
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  Notifications
                </h3>
              </div>
  
              {/* BODY */}
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      onClick={() => handleNotificationClick(notification)}
                      className="px-5 py-4 border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-[#1F2937] leading-relaxed">
                            {notification.message}
                          </p>
  
                          <p className="text-[11px] text-[#9CA3AF] mt-2">
                            {moment(notification.createdAt).fromNow()}
                          </p>
                        </div>
  
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearNotification(index);
                          }}
                          className="text-[11px] font-medium text-[#9CA3AF] hover:text-[#111827]"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-[140px] flex items-center justify-center">
                    <p className="text-[13px] text-[#9CA3AF]">
                      No notifications
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
  
        {/* PROFILE */}
        <button className="w-[42px] h-[42px] rounded-xl border border-[#ECEEF2] bg-[#FAFAFA] flex items-center justify-center hover:bg-[#F3F4F6] transition-all">
          <User size={18} className="text-[#4B5563]" />
        </button>
      </div>
    </div>
  );
};


export default Navbar;