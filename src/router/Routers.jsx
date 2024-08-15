import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';


function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="dashboard" element={<DashboardLayout />} />
      <Route path="spot-rate" element={<SpotRateLayout />} />
      <Route path="media" element={<MediaLayout />} />
      <Route path="messages" element={<MessagesLayout />} />
      <Route path="news" element={<NewsLayout />} />
      <Route path="shop" element={<ShopLayout />} />
      <Route path="users" element={<UsersLayout />} />
      <Route path="profile" element={<ProfileLayout />} />
      <Route path="bank-details" element={<BankDetailsLayout />} />
      <Route path="*" element={<NotFound />} />
      <Route path="500" element={<ServerError />} />
    </Routes>
  );
}

export default Routers;
