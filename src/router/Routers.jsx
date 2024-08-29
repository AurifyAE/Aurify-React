import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Login from '../components/login/Login';
import BankDetailsLayout from '../layout/BankDetailsLayout';
import ChatBotLayout from '../layout/ChatBotLayout';
import ChatLayout from '../layout/ChatLayout';
import DashboardLayout from '../layout/DashboardLayout';
import DigitalMarketingLayout from '../layout/DigitalMarketLayout';
import MarketClosingLayout from '../layout/MarketClosingLayout';
import MediaLayout from '../layout/MediaLayout';
import MessagesLayout from '../layout/MessagesLayout';
import NewsLayout from '../layout/NewsLayout';
import ProfileLayout from '../layout/ProfileLayout';
import ShopLayout from '../layout/ShopLayout';
import SpotRateLayout from '../layout/SpotRateLayout';
import UsersLayout from '../layout/UsersLayout';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';
import Protect from '../protectorRouter/adminProtect';


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

  const isFeatureAccessible = useCallback((featureName) => {
    // Log the features and featureName to debug
    console.log("Feature Name:", featureName);
    console.log("Features List:", features.map(f => f.name.toLowerCase()));

    return features.some(feature => feature.name.toLowerCase() === featureName.toLowerCase());
  }, [features]);

  const ProtectedRoute = ({ element: Element, path }) => {
    const featureName = path
    .split('/feature/')[1]
    .replace(/-/g, ' ')
    .toLowerCase();
    return isFeatureAccessible(featureName) ? <Element /> : <Navigate to="*" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Protect/>}>
      <Route path="dashboard" element={<DashboardLayout />} />
      <Route path="spot-rate" element={<SpotRateLayout />} />
      <Route path="media" element={<MediaLayout />} />
      <Route path="support" element={<MessagesLayout />} />
      <Route path="news" element={<NewsLayout />} />
      <Route path="profile" element={<ProfileLayout />} />
      <Route path="bank-details" element={<BankDetailsLayout />} />

      <Route
        path="/feature/shop"
        element={<ProtectedRoute element={ShopLayout} path="/feature/shop" />}
      />
      <Route
        path="/feature/users"
        element={<ProtectedRoute element={UsersLayout} path="/feature/users" />}
      />
      <Route
        path="/feature/market-closing"
        element={<ProtectedRoute element={MarketClosingLayout} path="/feature/market-closing" />}
      />
      <Route
        path="/feature/24x7-chat"
        element={<ProtectedRoute element={ChatLayout} path="/feature/24x7-chat" />}
      />
      <Route
        path="/feature/digital-marketing"
        element={<ProtectedRoute element={DigitalMarketingLayout} path="/feature/digital-marketing" />}
      />
      <Route
        path="/feature/chatbot"
        element={<ProtectedRoute element={ChatBotLayout} path="/feature/chatbot" />}
      />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="500" element={<ServerError />} />
    </Routes>
  );
}

export default Routers;
