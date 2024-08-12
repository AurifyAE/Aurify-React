import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Users from '../pages/Users';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const UsersLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="flex-grow">
          <Users />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UsersLayout;
