import React from "react";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import UsersSpotRate from "../pages/User/UsersSpotRate";

const UsersSpotRateLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="flex-grow">
          <UsersSpotRate />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UsersSpotRateLayout;
