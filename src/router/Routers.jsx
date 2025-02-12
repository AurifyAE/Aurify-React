import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import PremiumDiscountLayout from "../layout/PremiumDiscountLayout";
import Orders from "../layout/OrdersLayout";
import ScreenSlider from "../layout/ScreenSlider";
import ProfileLayout from "../layout/ProfileLayout";
import ShopLayout from "../layout/ShopLayout";
import SpotRateLayout from "../layout/SpotRateLayout";
import UsersDBLayout from "../layout/UsersDBLayout";
import UsersLayout from "../layout/UsersLayout";
import UsersSpotRateLayout from "../layout/UsersSpotRateLayout";
import UserChatLayout from "../pages/Chat/UserChat";
import NotFound from "../pages/Error/NotFound";
import ServerError from "../pages/Error/ServerError";
import Protect from "../protectorRouter/adminProtect";
import UsersProductManagement from "../layout/UsersProductManagementLayout"
import PricingOptions from '../layout/PricingOptionsLayout'
 
function Routers() {
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        if (location.state && location.state.features) {
          setFeatures(location.state.features);
          setLoading(false);
        } else {
          fetchFeatures();
        }
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [location]);

  const fetchFeatures = async () => {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      setFeatures([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/features", {
        params: { userName: userName },
      });
      if (response.data.success) {
        setFeatures(response.data.data.features);
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
  };

  const isFeatureAccessible = (featureName) =>
    features &&
    features.some(
      (feature) => feature.name.toLowerCase() === featureName.toLowerCase()
    );

  const ProtectedRoute = ({ element: Element, path }) => {
    const featureName = path
      .split("/feature/")[1]
      .replace(/-/g, " ")
      .toLowerCase();

    if (loading) {
      return (
        <div className="fixed inset-0 h-full w-full backdrop-blur-md bg-transparent flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    return isFeatureAccessible(featureName) ? (
      <Element />
    ) : (
      <Navigate to="*" replace />
    );
  };

  const handleLoginSuccess = (fetchedFeatures) => {
    setIsLoggedIn(true);
    setFeatures(fetchedFeatures);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 h-full w-full backdrop-blur-md bg-transparent flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
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
          path="users-spotrate/:categoryId"
          element={<UsersSpotRateLayout />}
        />
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
         <Route
          path="/feature/pricing-options"
          element={
            <ProtectedRoute element={PricingOptions} path="/feature/pricing-options" />
          }
        />
        <Route
          path="/feature/premium-discount"
          element={
            <ProtectedRoute
              element={PremiumDiscountLayout}
              path="/feature/premium-discount"
            />
          }
        />
        <Route
          path="/feature/orders"
          element={
            <ProtectedRoute
              element={Orders}
              path="/feature/orders"
            />
          }
        />
        <Route
          path="/feature/screen-slider"
          element={
            <ProtectedRoute
              element={ScreenSlider}
              path="/feature/screen-slider"
            />
          }
        />
        <Route
          path="/feature/Users-DB"
          element={
            <ProtectedRoute element={UsersDBLayout} path="/feature/Users-DB" />
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="500" element={<ServerError />} />
    </Routes>
  );
}

export default Routers;
