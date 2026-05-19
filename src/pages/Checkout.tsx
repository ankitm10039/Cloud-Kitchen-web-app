import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAppDispatch } from '../store';
import { placeOrder } from '../store/orderSlice';
import { ActiveOrder, OrderStatus } from '../types';
import { ShoppingBag, CreditCard, Banknote, ShieldCheck, ArrowLeft, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, subtotal, tax, deliveryFee, total, clear } = useCart();

  // Form Fields State
  const [fullName, setFullName] = useState('Ankit Meena');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('ankit.meena@aapkaapnakitchen.com');
  const [street, setStreet] = useState('Flat 402, Sunshine Towers, Sector 62');
  const [city, setCity] = useState('Noida');
  const [pincode, setPincode] = useState('201301');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Stop if cart is empty
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="checkout-empty-container container text-center">
        <div className="empty-bag-glow">
          <ShoppingBag size={52} className="empty-icon" />
        </div>
        <h2>Cart is Empty</h2>
        <p>You cannot checkout with an empty stomach. Add meals to get started!</p>
        <Link to="/" className="btn btn-primary">Browse Menu</Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!fullName || !phone || !email || !street || !city || !pincode) {
      setFormError('Please fill out all address and contact fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate Network Request
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestamp = new Date().toISOString();

      const newOrder: ActiveOrder = {
        id: orderId,
        items: [...items],
        subtotal,
        tax,
        deliveryFee,
        total,
        status: 'placed',
        estimatedDeliveryTime: `${items.reduce((max, item) => Math.max(max, item.deliveryTime), 0) + 10} mins`,
        shippingAddress: {
          fullName,
          street,
          city,
          phone,
        },
        paymentMethod,
        createdAt: timestamp,
        statusLogs: [
          { status: 'placed' as OrderStatus, timestamp }
        ]
      };

      // 1. Dispatch active order to Redux
      dispatch(placeOrder(newOrder));
      
      // 2. Clear the cart
      clear();
      
      // 3. Stop loading & Route to tracking page
      setIsSubmitting(false);
      navigate('/track');
    }, 1500);
  };

  return (
    <div className="checkout-page container">
      {/* Back Button */}
      <div className="checkout-back-bar">
        <Link to="/" className="btn-icon checkout-back-btn" aria-label="Go Back">
          <ArrowLeft size={18} />
        </Link>
        <span>Checkout Details</span>
      </div>

      <div className="checkout-grid">
        {/* Left Side: Checkout Form */}
        <motion.div 
          className="checkout-form-section glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Delivery Address</h2>
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address / Landmark</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">City / State</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="payment-options-container">
              <h2>Select Payment Method</h2>
              <div className="payment-grid">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`payment-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                >
                  <Landmark size={24} className="pay-icon" />
                  <div className="pay-text">
                    <h4>UPI Apps</h4>
                    <span>GPay, PhonePe, Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`payment-card ${paymentMethod === 'Card' ? 'active' : ''}`}
                >
                  <CreditCard size={24} className="pay-icon" />
                  <div className="pay-text">
                    <h4>Credit / Debit</h4>
                    <span>Visa, MasterCard, RuPay</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`payment-card ${paymentMethod === 'COD' ? 'active' : ''}`}
                >
                  <Banknote size={24} className="pay-icon" />
                  <div className="pay-text">
                    <h4>Pay on Delivery</h4>
                    <span>Cash or Card at door</span>
                  </div>
                </button>
              </div>
            </div>

            {formError && <div className="checkout-error">{formError}</div>}

            <button 
              type="submit" 
              className="btn btn-primary place-order-action-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Securing payment..." : `Place Order • ₹${total}`}
            </button>

            <p className="security-note">
              <ShieldCheck size={14} className="shield-icon" />
              Secure 256-bit SSL encrypted connection.
            </p>
          </form>
        </motion.div>

        {/* Right Side: Order Summary Panel */}
        <motion.div 
          className="checkout-summary-section glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2>Order Summary</h2>
          <div className="checkout-items-summary">
            {items.map((item) => (
              <div key={item.id} className="checkout-item-tile">
                <img src={item.image} alt={item.name} />
                <div className="tile-details">
                  <div className="tile-top">
                    <h4>{item.name}</h4>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                  <div className="tile-bottom">
                    <span>Qty: {item.quantity}</span>
                    {item.customNotes && (
                      <span className="tile-notes">Note: {item.customNotes}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary-receipt">
            <div className="receipt-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="receipt-row">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="receipt-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? <span className="free-fee">FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            <div className="receipt-row total-receipt-row">
              <span>Total Payable</span>
              <span>₹{total}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .checkout-page {
          padding-top: 40px;
          padding-bottom: 80px;
        }

        .checkout-back-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .checkout-back-btn {
          width: 36px;
          height: 36px;
        }

        .checkout-back-bar span {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 32px;
          align-items: start;
        }

        /* Empty State */
        .checkout-empty-container {
          padding: 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .empty-bag-glow {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(245, 158, 11, 0.1);
        }

        .empty-icon {
          color: var(--text-muted);
        }

        /* Form styling */
        .checkout-form-section {
          padding: 32px;
          text-align: left;
        }

        .checkout-form-section h2 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .payment-options-container {
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .payment-card {
          padding: 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          transition: all var(--transition-fast);
        }

        .payment-card:hover {
          border-color: var(--border-glass-hover);
          background: var(--bg-secondary);
        }

        .payment-card.active {
          border-color: var(--primary);
          background: rgba(245, 158, 11, 0.06);
        }

        .pay-icon {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }

        .payment-card.active .pay-icon {
          color: var(--primary);
        }

        .pay-text h4 {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 2px;
        }

        .pay-text span {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .checkout-error {
          padding: 12px 16px;
          background: var(--danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--accent);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-top: 12px;
          font-weight: 500;
        }

        .place-order-action-btn {
          width: 100%;
          height: 52px;
          margin-top: 24px;
        }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 16px;
        }

        .shield-icon {
          color: var(--success);
        }

        /* Right Summary card styling */
        .checkout-summary-section {
          padding: 32px;
          text-align: left;
        }

        .checkout-summary-section h2 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .checkout-items-summary {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 320px;
          overflow-y: auto;
          margin-bottom: 24px;
          padding-right: 4px;
        }

        .checkout-item-tile {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .checkout-item-tile img {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--bg-tertiary);
        }

        .tile-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tile-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .tile-top h4 {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 700;
          line-height: 1.2;
        }

        .tile-top span {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .tile-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .tile-notes {
          color: var(--primary);
          font-style: italic;
        }

        .checkout-summary-receipt {
          border-top: 1px dashed var(--border-glass);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .free-fee {
          color: var(--success);
          font-weight: 700;
        }

        .total-receipt-row {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          border-top: 1px solid var(--border-glass);
          padding-top: 12px;
          margin-top: 4px;
        }

        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .payment-grid {
            grid-template-columns: 1fr;
          }
          .checkout-form-section {
            padding: 20px;
          }
          .checkout-summary-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
