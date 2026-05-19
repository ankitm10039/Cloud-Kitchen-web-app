import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Mail, Phone, MapPin } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { setSelectedTiming } from '../../store/menuSlice';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleTimingClick = (timing: 'Breakfast' | 'Lunch' | 'Dinner') => {
    dispatch(setSelectedTiming(timing));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo footer-logo">
            <div className="logo-icon-wrapper">
              <UtensilsCrossed size={18} className="logo-icon" />
            </div>
            <span className="brand-name">Crave<span>Craft</span></span>
          </Link>
          <p className="footer-desc">
            A premium, artisan cloud kitchen delivering gourmet dishes crafted by world-class chefs. From wholesome breakfasts to indulgent late-night dinners, we satisfy every crave.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-icon social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn-icon social-btn" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn-icon social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Timings Links */}
        <div className="footer-col">
          <h4 className="footer-title">Menu Slots</h4>
          <ul className="footer-links">
            <li><button onClick={() => handleTimingClick('Breakfast')} className="footer-link-btn">Breakfast Slot</button></li>
            <li><button onClick={() => handleTimingClick('Lunch')} className="footer-link-btn">Lunch Slot</button></li>
            <li><button onClick={() => handleTimingClick('Dinner')} className="footer-link-btn">Dinner Slot</button></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-col">
          <h4 className="footer-title">Customer Care</h4>
          <ul className="footer-links">
            <li><Link to="/profile" className="footer-link">Order History</Link></li>
            <li><a href="#faq" className="footer-link">FAQs & Help</a></li>
            <li><a href="#refund" className="footer-link">Refund Policies</a></li>
            <li><a href="#about" className="footer-link">Our Story</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col contact-col">
          <h4 className="footer-title">Our Kitchen</h4>
          <ul className="contact-details">
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>Gourmet Lane, Sector 62, Noida, UP - 201301</span>
            </li>
            <li>
              <Phone size={16} className="contact-icon" />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <Mail size={16} className="contact-icon" />
              <span>chef@cravecraft.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright">&copy; {new Date().getFullYear()} CraveCraft Cloud Kitchen. All rights reserved.</p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="dot-divider"></span>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-glass);
          padding: 60px 0 20px;
          margin-top: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brand-col {
          gap: 20px;
        }

        .footer-logo {
          font-size: 1.35rem;
        }

        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
        }

        .footer-title {
          font-size: 1.05rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: var(--primary-gradient);
          border-radius: var(--radius-full);
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link, .footer-link-btn {
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: color var(--transition-fast);
          text-align: left;
        }

        .footer-link:hover, .footer-link-btn:hover {
          color: var(--primary);
        }

        .contact-details {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-details li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .contact-icon {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .footer-bottom {
          border-top: 1px solid var(--border-glass);
          padding-top: 20px;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .copyright, .legal-links a {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .legal-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .legal-links a:hover {
          color: var(--text-secondary);
        }

        .dot-divider {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--text-muted);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
