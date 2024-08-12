import React from 'react';
import { Search, User, Settings, Bell } from 'lucide-react';

const Navbar = () => {
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
          8/7/2024 - 2:06:18 PM
        </div>

        <User className="text-gray-600 cursor-pointer w-5 h-5" />
        <Settings className="text-gray-600 cursor-pointer w-5 h-5" />
        <Bell className="text-gray-600 cursor-pointer w-5 h-5" />
      </div>
    </div>
  );
};

export default Navbar;