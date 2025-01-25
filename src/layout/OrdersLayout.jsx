import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Order from '../pages/Orders/Order';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const OrdersLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="flex-grow">
          <Order/>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OrdersLayout;
