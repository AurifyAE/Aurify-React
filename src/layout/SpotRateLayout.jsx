import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import SpotRate from '../pages/SpotRate/SpotRate';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const SpotRateLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="flex-grow">
          <SpotRate />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SpotRateLayout;
