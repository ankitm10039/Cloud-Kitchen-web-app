import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CartDrawer from '../components/UI/CartDrawer';

const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Global Navigation Header */}
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Main Content Render Outlet */}
      <main className="main-content-wrapper">
        <Outlet />
      </main>

      {/* Global Brand Footer */}
      <Footer />

      {/* Side-sliding Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .main-content-wrapper {
          flex: 1 0 auto;
          padding-top: 80px; /* Offset fixed header */
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .main-content-wrapper {
            padding-top: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
