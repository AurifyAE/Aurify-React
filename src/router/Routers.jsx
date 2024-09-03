import { Spinner } from "@nextui-org/react";

import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import Login from "../components/login/Login";
import BankDetailsLayout from "../layout/BankDetailsLayout";
import ChatBotLayout from "../layout/ChatBotLayout";
import ChatLayout from "../layout/ChatLayout";
import DashboardLayout from "../layout/DashboardLayout";
import DigitalMarketingLayout from "../layout/DigitalMarketLayout";
import MarketClosingLayout from "../layout/MarketClosingLayout";
import MediaLayout from "../layout/MediaLayout";
import MessagesLayout from "../layout/MessagesLayout";
import NewsLayout from "../layout/NewsLayout";
import ProfileLayout from "../layout/ProfileLayout";
import ShopLayout from "../layout/ShopLayout";
import SpotRateLayout from "../layout/SpotRateLayout";
import UsersLayout from "../layout/UsersLayout";
import UserChatLayout from "../pages/Chat/UserChat";
import NotFound from "../pages/Error/NotFound";
import ServerError from "../pages/Error/ServerError";
import Protect from "../protectorRouter/adminProtect";

function Routers() {
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = useCallback(async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setFeatures([]); // Set empty array if no user email
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/features", {
        params: { email: userEmail },
      });
      if (response.data.success) {
        setFeatures(response.data.data);
      } else {
        console.error("Failed to fetch features: Unexpected response format");
        setFeatures([]);
      }
    } catch (err) {
      console.error("Failed to fetch features:", err);
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures(); // Fetch features after login
  }, [fetchFeatures]);

  const isFeatureAccessible = useCallback(
    (featureName) =>
      features &&
      features.some(
        (feature) => feature.name.toLowerCase() === featureName.toLowerCase()
      ),
    [features]
  );

  const ProtectedRoute = ({ element: Element, path }) => {
    const featureName = path
      .split("/feature/")[1]
      .replace(/-/g, " ")
      .toLowerCase();

    if (loading)
      return (
        <div className="fixed inset-0 h-full w-full backdrop-blur-md bg-transparent flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ); // Show loading while fetching

    return isFeatureAccessible(featureName) ? (
      <Element />
    ) : (
      <Navigate to="*" replace />
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 h-full w-full backdrop-blur-md bg-transparent flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    ); // Global loading state
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

        {/* Protected Routes */}
        <Route
          path="/feature/shop"
          element={<ProtectedRoute element={ShopLayout} path="/feature/shop" />}
        />
        <Route
          path="/feature/users"
          element={
            <ProtectedRoute element={UsersLayout} path="/feature/users" />
          }
        />
        <Route
          path="/feature/market-closing"
          element={
            <ProtectedRoute
              element={MarketClosingLayout}
              path="/feature/market-closing"
            />
          }
        />
        <Route
          path="/feature/24x7-chat"
          element={
            <ProtectedRoute element={ChatLayout} path="/feature/24x7-chat" />
          }
        />
        <Route
          path="/feature/digital-marketing"
          element={
            <ProtectedRoute
              element={DigitalMarketingLayout}
              path="/feature/digital-marketing"
            />
          }
        />
        <Route
          path="/feature/chatbot"
          element={
            <ProtectedRoute element={ChatBotLayout} path="/feature/chatbot" />
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="500" element={<ServerError />} />
    </Routes>
  );
}

export default Routers;
