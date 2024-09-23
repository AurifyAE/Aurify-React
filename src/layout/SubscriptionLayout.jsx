import React from "react";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Subscription from "../pages/Subscription/Subscription";

const SubscriptionLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="flex-grow">
          <Subscription />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SubscriptionLayout;
