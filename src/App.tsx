import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import DishDetail from './pages/DishDetail';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Main Landing / Dashboard Menu */}
          <Route index element={<Home />} />
          
          {/* Dish Detail Customizations Route */}
          <Route path="menu/:id" element={<DishDetail />} />
          
          {/* Checkout & Bill Summary Route */}
          <Route path="checkout" element={<Checkout />} />
          
          {/* Live Progress Timeline Simulator */}
          <Route path="track" element={<OrderTracking />} />
          
          {/* Historical Orders & User Settings Route */}
          <Route path="profile" element={<Profile />} />

          {/* Catch-all Redirect to Home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
