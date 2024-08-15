import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routers from './router/Routers';
import { NextUIProvider } from '@nextui-org/react';
import { CurrencyProvider } from './context/CurrencyContext';


function App() {
  return (
    <NextUIProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path={"/*"} element={<Routers />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </NextUIProvider>
  );
}

export default App;
