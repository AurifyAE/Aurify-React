import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routers from './router/Routers';
import { NextUIProvider } from '@nextui-org/react';
import { CurrencyProvider } from './context/CurrencyContext';
import { MarketDataProvider } from './context/MarketDataContext';


function App() {
  return (
    <NextUIProvider>
      <CurrencyProvider>
      <MarketDataProvider>
        <Router>
          <Routes>
            <Route path={"/*"} element={<Routers />} />
          </Routes>
        </Router>
        </MarketDataProvider>
      </CurrencyProvider>
    </NextUIProvider>
  );
}

export default App;