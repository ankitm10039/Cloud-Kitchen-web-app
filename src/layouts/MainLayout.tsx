import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CartDrawer from '../components/UI/CartDrawer';
import ParticleBackground from '../components/UI/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Background blobs for premium glassmorphism */}
      <div className="bg-glow-blobs">
        <motion.div 
          className="glow-blob blob-orange"
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 50, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="glow-blob blob-amber"
          animate={{
            x: [0, -100, 70, 0],
            y: [0, 80, -90, 0],
            scale: [1, 0.85, 1.15, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="glow-blob blob-red"
          animate={{
            x: [0, 60, -70, 0],
            y: [0, 90, 40, 0],
            scale: [1, 1.1, 0.8, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Constellation particle network background */}
      <ParticleBackground />

      {/* Global Navigation Header */}
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Main Content Render Outlet with Page Transitions */}
      <main className="main-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
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

        /* Ambient Background Blobs Styling */
        .bg-glow-blobs {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }

        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.14;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .blob-orange {
          top: 10%;
          left: 5%;
          width: 450px;
          height: 450px;
          background: #FF8A00;
        }

        .blob-amber {
          bottom: 10%;
          right: 5%;
          width: 500px;
          height: 500px;
          background: #FFB300;
        }

        .blob-red {
          top: 45%;
          left: 40%;
          width: 380px;
          height: 380px;
          background: #FF3D00;
        }

        .light-theme .glow-blob {
          opacity: 0.05;
          mix-blend-mode: multiply;
          filter: blur(120px);
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
