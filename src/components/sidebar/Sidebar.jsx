import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Image, MessageSquare, Newspaper, ShoppingCart, User } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import logo from '../../assets/logo.png';
import axiosInstance from '../../axiosInstance';

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
    navigate('/');
  };
  return (
    <button
      onClick={handleSignOut}
      className="w-full mt-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center shadow-lg mb-8">
      Sign Out
    </button>
  );
};

const FeatureDropdown = ({ features }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <h3
        className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        FEATURES
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </h3>
      {isOpen && (
        <ul className="space-y-1">
          {features.map((feature, index) => (
            <NavLink 
              to={`/feature/${feature.name.toLowerCase().replace(/\s+/g, '-')}`}
              key={index}
              className={({ isActive }) => (isActive ? 'text-purple-600' : 'text-gray-600')}
            >
              {({ isActive }) => (
                <SidenavItem
                  name={feature.name}
                  icon={User} // You might want to use a different icon or create a mapping for feature icons
                  isActive={isActive}
                />
              )}
            </NavLink>
          ))}
        </ul>
      )}
    </div>
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

  const [features, setFeatures] = useState([]);
  const [error, setError] = useState(null);
  
  const fetchFeatures = async () => {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      setError('Admin not logged in');
      return;
    }
  
    try {
      const response = await axiosInstance.get('/features', {
        params: { email: userEmail },
      });
      
      if (response.data.success) {
        setFeatures(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch features');
      }
    } catch (err) {
      setError('Failed to fetch admin features: ' + err.message);
    }
  };
  
  useEffect(() => {
    fetchFeatures();
  }, []);

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

      {features.length > 0 && <FeatureDropdown features={features} />}
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="mt-8">
        <SignOutButton />
      </div>
    </nav>
  );
};

export default Sidebar;