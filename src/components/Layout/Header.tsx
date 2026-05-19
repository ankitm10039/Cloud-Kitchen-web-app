import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Clock, Sun, Moon, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useAppSelector } from '../../store';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { count } = useCart();
  const activeOrder = useAppSelector((state) => state.order.activeOrder);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  return (
    <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrapper">
            <UtensilsCrossed size={20} className="logo-icon" />
          </div>
          <span className="brand-name">Aapka Apna<span>Kitchen</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Order History</Link>
          
          {activeOrder && (
            <Link to="/track" className="nav-link-track-wrapper">
              <motion.div 
                className="nav-link-track"
                animate={{ boxShadow: ["0 0 0px rgba(239, 68, 68, 0.4)", "0 0 12px rgba(239, 68, 68, 0.8)", "0 0 0px rgba(239, 68, 68, 0.4)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Clock size={16} className="track-icon-pulse" />
                Track Order ({activeOrder.status})
              </motion.div>
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="btn-icon header-action-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile */}
          <Link to="/profile" className="btn-icon header-action-btn" aria-label="User Profile">
            <User size={20} />
          </Link>

          {/* Cart Trigger */}
          <button onClick={onCartClick} className="btn-icon header-action-btn cart-btn-relative" aria-label="View Cart">
            <ShoppingBag size={20} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span 
                  className="cart-badge-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={count}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle btn-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mobile-nav-links">
              <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/profile" className={`mobile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Order History</Link>
              
              {activeOrder && (
                <Link to="/track" className="mobile-nav-link active-order-alert" onClick={() => setMobileMenuOpen(false)}>
                  <Clock size={16} />
                  Track Live Order ({activeOrder.status})
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 50;
          border-bottom: 1px solid transparent;
          transition: all var(--transition-normal);
        }
        
        .header-container.scrolled {
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: var(--border-glass);
          box-shadow: var(--shadow-sm);
          height: 70px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .logo-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }

        .brand-name span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
          position: relative;
          padding: 8px 0;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary-gradient);
          border-radius: var(--radius-full);
        }

        .nav-link-track-wrapper {
          display: inline-block;
        }

        .nav-link-track {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent);
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: capitalize;
        }

        .track-icon-pulse {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-action-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
        }

        .cart-btn-relative {
          position: relative;
        }

        .cart-badge-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-secondary);
        }

        .mobile-menu-toggle {
          display: none;
        }

        .mobile-nav-drawer {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-glass);
          box-shadow: var(--shadow-lg);
          padding: 16px 0;
          z-index: 49;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          font-weight: 500;
          font-size: 1.1rem;
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
        }

        .mobile-nav-link.active {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        .active-order-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: flex;
          }
          .header-container.scrolled {
            height: 80px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
