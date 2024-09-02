import React, { useState, useEffect, useCallback } from 'react';
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
import MarketClosingLayout from '../layout/MarketClosingLayout';
import NotFound from '../pages/Error/NotFound';
import ServerError from '../pages/Error/ServerError';
import ChatLayout from '../layout/ChatLayout';
import DigitalMarketingLayout from '../layout/DigitalMarketLayout';
import ChatBotLayout from '../layout/ChatBotLayout';
import axiosInstance from '../axios/axiosInstance';
import Protect from '../protectorRouter/adminProtect';
import UserChatLayout from '../pages/Chat/UserChat';

function Routers() {
  const [features, setFeatures] = useState(null);

  const fetchFeatures = useCallback(async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setFeatures([]); // Set empty array if no user email
      return;
    }

    try {
      const response = await axiosInstance.get('/features', {
        params: { email: userEmail },
      });
      if (response.data.success) {
        setFeatures(response.data.data);
      } else {
        console.error('Failed to fetch features: Unexpected response format');
        setFeatures([]); // Set empty array on failure
      }
    } catch (err) {
      console.error('Failed to fetch features:', err);
      setFeatures([]); // Set empty array on error
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const isFeatureAccessible = useCallback((featureName) => {
    return features && features.some(
      (feature) => feature.name.toLowerCase() === featureName.toLowerCase()
    );
  }, [features]);

  const ProtectedRoute = ({ element: Element, path }) => {
    const featureName = path
      .split('/feature/')[1]
      .replace(/-/g, ' ')
      .toLowerCase();

    if (features === null) {
      return null; // Don't render anything until features are fetched
    }

    return isFeatureAccessible(featureName) ? (
      <Element />
    ) : (
      <Navigate to="*" replace />
    );
  };

  if (features === null) {
    return null; // Don't render routes until features are fetched
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Protect />}>
        <Route path="dashboard" element={<DashboardLayout />} />
        <Route path="spot-rate" element={<SpotRateLayout />} />
        <Route path="media" element={<MediaLayout />} />
        <Route path="support" element={<MessagesLayout />} />
        <Route path="news" element={<NewsLayout />} />
        <Route path="profile" element={<ProfileLayout />} />
        <Route path="bank-details" element={<BankDetailsLayout />} />
        <Route path="userchat" element={<UserChatLayout />} />

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