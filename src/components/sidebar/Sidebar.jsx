import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Image, MessageSquare, Newspaper, ShoppingCart, User } from 'lucide-react';
import logo from '../../assets/logo.png';

const SidenavItem = ({ icon: Icon, name, isActive }) => (
  <li className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
    isActive ? 'bg-white shadow-lg' : 'hover:bg-gray-100'
  }`}>
    <div className={`p-2 rounded-lg mr-3 ${
      isActive ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-purple-100'
    }`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-600'}`} />
    </div>
    <span className={`text-sm font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>{name}</span>
  </li>
);

const SignOutButton = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    // Add any sign out logic here (e.g., clearing local storage, etc.)
    navigate('/'); // Navigate to login page
  };
  return (
    <button
      onClick={handleSignOut}
      className="w-full mt-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center shadow-lg mb-8">
      Sign Out
    </button>
  );
};


const Sidebar = () => {
  const routes = [
    { name: "Dashboard", icon: Home, path: "dashboard" },
    { name: "Spot Rate", icon: BarChart2, path: "spot-rate" },
    { name: "Media", icon: Image, path: "media" },
    { name: "Messages", icon: MessageSquare, path: "messages" },
    { name: "News", icon: Newspaper, path: "news" },
    { name: "Shop", icon: ShoppingCart, path: "shop" },
    { name: "Users", icon: User, path: "users" },
  ];

  const accountRoutes = [
    { name: "Profile", icon: User, path: "profile" },
    { name: "Bank Details", icon: User, path: "bank-details" },
  ];

  return (
    <nav className="w-64 bg-gray-100 h-screen p-4 overflow-y-auto hide-scrollbar">
      <div className="flex items-center mb-8">
        <img src={logo} alt="Logo" className="w-14 h-14 mr-1" />
        <span className="text-xl font-bold text-gray-800">Dashboard</span>
      </div>
      
      <ul className="space-y-1">
        {routes.map((route) => (
          <NavLink 
            to={`/${route.path}`} 
            key={route.path} 
            className={({ isActive }) => (isActive ? 'text-purple-600' : 'text-gray-600')}
          >
            {({ isActive }) => (
              <SidenavItem
                name={route.name}
                icon={route.icon}
                isActive={isActive}
              />
            )}
          </NavLink>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">ACCOUNT PAGES</h3>
        <ul className="space-y-1">
          {accountRoutes.map((route) => (
            <NavLink 
              to={`/${route.path}`} 
              key={route.path} 
              className={({ isActive }) => (isActive ? 'text-purple-600' : 'text-gray-600')}
            >
              {({ isActive }) => (
                <SidenavItem
                  name={route.name}
                  icon={route.icon}
                  isActive={isActive}
                />
              )}
            </NavLink>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </nav>
  );
};

export default Sidebar;
