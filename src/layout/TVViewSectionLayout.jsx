import React from "react";
import { SpotRateProvider } from "../context/SpotRateContext";
import TVViewSection from "../pages/TVView/TVViewSection";

const TVViewSectionLayout = () => {
  return (
    <SpotRateProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <TVViewSection />
        </main>
      </div>
    </SpotRateProvider>
  );
};

export default TVViewSectionLayout;
