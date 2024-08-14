import React, { useState, useEffect } from 'react';
import { Search, User, Settings, Bell } from 'lucide-react';

const Navbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
      <div className="flex items-center space-x-4">
        <div className="relative shadow-lg">
          <input
            type="text"
            placeholder="Type here..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        
        <div className="border-2 border-purple-500 text-purple-500 px-4 py-2 rounded-lg text-sm shadow-lg">
          {formattedDateTime}
        </div>

        <User className="text-gray-600 cursor-pointer w-5 h-5" />
        <Settings className="text-gray-600 cursor-pointer w-5 h-5" />
        <Bell className="text-gray-600 cursor-pointer w-5 h-5" />
      </div>
    </div>
  );
};

export default Navbar;