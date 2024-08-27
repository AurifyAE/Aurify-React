import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/login/Login';
import DashboardLayout from '../layout/DashboardLayout';
import SpotRateLayout from '../layout/SpotRateLayout';
import MediaLayout from '../layout/MediaLayout';
import MessagesLayout from '../layout/MessagesLayout';
import NewsLayout from '../layout/NewsLayout';
import ShopLayout from '../layout/ShopLayout';
import ProfileLayout from '../layout/ProfileLayout';
import BankDetailsLayout from '../layout/BankDetailsLayout';
import UsersLayout from '../layout/UsersLayout';
import MarketClosingayout from '../layout/MarketClosingLayout';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';
import ChatLayout from '../layout/ChatLayout';
import DigitalMarketingLayout from '../layout/DigitalMarketLayout';
import ChatBotLayout from '../layout/ChatBotLayout';
import axiosInstance from '../axiosInstance';

const ProtectedFeatureRoute = ({ path, element: Element, features }) => {
  const featureName = path.split('/').pop().replace(/-/g, ' ').toLowerCase();
  const isAccessible = features.some(f => f.name.toLowerCase() === featureName);

  return isAccessible ? <Element /> : <Navigate to="*" replace />;
};

function Routers() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          const response = await axiosInstance.get('/features', {
            params: { email: userEmail },
          });
          if (response.data.success) {
            setFeatures(response.data.data);
          }
        } catch (err) {
          console.error('Failed to fetch features:', err);
        }
      }
    };

    fetchFeatures();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="dashboard" element={<DashboardLayout />} />
      <Route path="spot-rate" element={<SpotRateLayout />} />
      <Route path="media" element={<MediaLayout />} />
      <Route path="messages" element={<MessagesLayout />} />
      <Route path="news" element={<NewsLayout />} />
      <Route path="profile" element={<ProfileLayout />} />
      <Route path="bank-details" element={<BankDetailsLayout />} />
    
      <Route 
        path="/feature/shop" 
        element={<ProtectedFeatureRoute path="/feature/shop" element={ShopLayout} features={features} />} 
      />
      <Route 
        path="/feature/users" 
        element={<ProtectedFeatureRoute path="/feature/users" element={UsersLayout} features={features} />} 
      />
      <Route 
        path="/feature/market-closing" 
        element={<ProtectedFeatureRoute path="/feature/market-closing" element={MarketClosingayout} features={features} />} 
      />
      <Route 
        path="/feature/24x7-chat" 
        element={<ProtectedFeatureRoute path="/feature/24x7-chat" element={ChatLayout} features={features} />} 
      />
      <Route 
        path="/feature/digital-marketing" 
        element={<ProtectedFeatureRoute path="/feature/digital-marketing" element={DigitalMarketingLayout} features={features} />} 
      />
      <Route 
        path="/feature/chatbot" 
        element={<ProtectedFeatureRoute path="/feature/chatbot" element={ChatBotLayout} features={features} />} 
      />
      <Route path="*" element={<NotFound />} />
      <Route path="500" element={<ServerError />} />
    </Routes>
    
  );
}

export default Routers;
