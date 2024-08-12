import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Routers from './router/Routers';
import { NextUIProvider } from '@nextui-org/react';


function App() {
  return (
    <NextUIProvider>
    <Router>
      <Routes>
        <Route path={"/*"} element={<Routers />} />
      </Routes>
    </Router>
    </NextUIProvider>
  );
}

export default App;
