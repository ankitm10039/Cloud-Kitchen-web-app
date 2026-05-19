import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { updateOrderStatus, clearActiveOrder } from '../store/orderSlice';
import { OrderStatus } from '../types';
import { CheckCircle2, ClipboardCheck, CookingPot, Bike, PartyPopper, Clock, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracking: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeOrder = useAppSelector((state) => state.order.activeOrder);

  // Status mapping to indices
  const statusIndexMap: Record<OrderStatus, number> = {
    placed: 0,
    confirmed: 1,
    cooking: 2,
    delivering: 3,
    delivered: 4
  };

  const currentIndex = activeOrder ? statusIndexMap[activeOrder.status] : 0;

  // Status simulation: Automatically transition order statuses for demonstration
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;

    const statuses: OrderStatus[] = ['placed', 'confirmed', 'cooking', 'delivering', 'delivered'];
    const nextStatusIndex = currentIndex + 1;

    if (nextStatusIndex < statuses.length) {
      const timer = setTimeout(() => {
        dispatch(updateOrderStatus(statuses[nextStatusIndex]));
      }, 8000); // Transitions every 8 seconds

      return () => clearTimeout(timer);
    }
  }, [activeOrder, currentIndex, dispatch]);

  if (!activeOrder) {
    return (
      <div className="tracking-empty-container container text-center">
        <div className="empty-icon-glow">
          <Clock size={52} className="empty-clock-icon" />
        </div>
        <h2>No Active Orders</h2>
        <p>You don't have any food currently on the way. Let's order some delicious meals!</p>
        <Link to="/" className="btn btn-primary">Go to Menu</Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", desc: "Received at kitchen", icon: CheckCircle2 },
    { label: "Confirmed", desc: "Assigned to chef", icon: ClipboardCheck },
    { label: "Cooking", desc: "Meal is being prepared", icon: CookingPot },
    { label: "Delivering", desc: "Rider on the way", icon: Bike },
    { label: "Delivered", desc: "Enjoy your food!", icon: PartyPopper }
  ];

  // Calculate percentage of progress line
  const progressPercent = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="tracking-page-container container">
      {/* Back to Home Button */}
      <div className="tracking-back-bar">
        <Link to="/" className="btn-icon tracking-back-btn" aria-label="Go Back">
          <ShoppingBag size={18} />
        </Link>
        <span>Live Delivery Tracker</span>
      </div>

      <div className="tracking-grid">
        {/* Left Side: Order Progress Card */}
        <motion.div 
          className="tracking-progress-section glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header Info */}
          <div className="tracking-card-header">
            <div>
              <span className="order-id-label">ID: {activeOrder.id}</span>
              <h2>Estimated Delivery</h2>
              <p className="delivery-timer-display">
                {activeOrder.status === 'delivered' ? "Delivered!" : activeOrder.estimatedDeliveryTime}
              </p>
            </div>
            <div className="tracking-status-indicator">
              <span className={`status-pulse-dot ${activeOrder.status}`}></span>
              <span className="status-label-text">{activeOrder.status}</span>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="timeline-container">
            {/* Background Line */}
            <div className="timeline-line-bg">
              <motion.div 
                className="timeline-line-progress"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Steps Row */}
            <div className="timeline-steps">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentIndex;
                const isActive = idx === currentIndex;

                let stepClass = 'pending';
                if (isCompleted) stepClass = 'completed';
                if (isActive) stepClass = 'active';

                return (
                  <div key={idx} className={`timeline-step-node ${stepClass}`}>
                    <div className="node-icon-glow-wrapper">
                      <motion.div 
                        className="node-icon-circle"
                        animate={isActive ? { scale: [1, 1.12, 1] } : {}}
                        transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
                      >
                        <Icon size={18} />
                      </motion.div>
                    </div>
                    <div className="node-text">
                      <h4>{step.label}</h4>
                      <span>{step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert banner on delivery success */}
          {activeOrder.status === 'delivered' && (
            <motion.div 
              className="delivery-success-banner"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              <h3>🎉 Your food has arrived!</h3>
              <p>We hope you enjoy your CraveCraft meals. Rate your experience or start a new order.</p>
              <button 
                onClick={() => dispatch(clearActiveOrder())} 
                className="btn btn-secondary clear-tracking-btn"
              >
                Done
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Side: Order Summary / Delivery Details */}
        <motion.div 
          className="tracking-details-section glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Rider details simulation */}
          <div className="rider-card-sim">
            <h3>Delivery Executive</h3>
            <div className="rider-flex">
              <div className="rider-avatar">🛵</div>
              <div>
                <h4>Rahul Dev</h4>
                <span>⭐ 4.9 • Super-Fast Rider</span>
              </div>
            </div>
          </div>

          <div className="delivery-destination">
            <h3>Delivery Destination</h3>
            <div className="detail-item-row">
              <MapPin size={16} className="detail-icon" />
              <div>
                <h4>{activeOrder.shippingAddress.fullName}</h4>
                <p>{activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}</p>
                <p>Phone: {activeOrder.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          <div className="delivery-payment">
            <h3>Payment Details</h3>
            <div className="detail-item-row">
              <CreditCard size={16} className="detail-icon" />
              <div>
                <h4>Method: {activeOrder.paymentMethod}</h4>
                <p>Total Charged: ₹{activeOrder.total}</p>
              </div>
            </div>
          </div>

          <div className="tracking-summary-items">
            <h3>Items Ordered</h3>
            <div className="items-mini-list">
              {activeOrder.items.map((item) => (
                <div key={item.id} className="mini-item-row">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .tracking-page-container {
          padding-top: 40px;
          padding-bottom: 80px;
        }

        .tracking-back-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .tracking-back-btn {
          width: 36px;
          height: 36px;
        }

        .tracking-back-bar span {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .tracking-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 32px;
          align-items: start;
        }

        /* Empty State */
        .tracking-empty-container {
          padding: 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .empty-clock-icon {
          color: var(--text-muted);
        }

        /* Progress Card Section */
        .tracking-progress-section {
          padding: 40px;
          text-align: left;
        }

        .tracking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }

        .order-id-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }

        .tracking-card-header h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .delivery-timer-display {
          font-size: 1rem;
          color: var(--success);
          font-weight: 600;
        }

        .tracking-status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
        }

        .status-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--warning);
        }

        .status-pulse-dot.placed { background: var(--info); animation: pulseAlert 1.5s infinite; }
        .status-pulse-dot.confirmed { background: var(--info); animation: pulseAlert 1.5s infinite; }
        .status-pulse-dot.cooking { background: var(--warning); animation: pulseAlert 1.5s infinite; }
        .status-pulse-dot.delivering { background: var(--primary); animation: pulseAlert 1.5s infinite; }
        .status-pulse-dot.delivered { background: var(--success); }

        @keyframes pulseAlert {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        .status-label-text {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }

        /* Timeline Graphics */
        .timeline-container {
          position: relative;
          padding-left: 32px;
          margin-bottom: 32px;
        }

        .timeline-line-bg {
          position: absolute;
          left: 49px;
          top: 15px;
          bottom: 15px;
          width: 4px;
          background: var(--bg-tertiary);
          z-index: 1;
        }

        .timeline-line-progress {
          width: 100%;
          height: 0%;
          background: var(--primary-gradient);
        }

        .timeline-steps {
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
          z-index: 2;
        }

        .timeline-step-node {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .node-icon-glow-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }

        .node-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-glass);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-normal);
        }

        .timeline-step-node.completed .node-icon-circle {
          background: var(--success);
          border-color: var(--success);
          color: white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }

        .timeline-step-node.active .node-icon-circle {
          background: var(--primary-gradient);
          border-color: transparent;
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .node-text h4 {
          font-size: 0.95rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }

        .timeline-step-node.active .node-text h4, 
        .timeline-step-node.completed .node-text h4 {
          color: var(--text-primary);
        }

        .node-text span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .delivery-success-banner {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-md);
          padding: 24px;
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .delivery-success-banner h3 {
          color: var(--success);
          font-size: 1.15rem;
        }

        .delivery-success-banner p {
          font-size: 0.875rem;
        }

        .clear-tracking-btn {
          align-self: flex-start;
          padding: 8px 16px;
          font-size: 0.85rem;
          background: var(--success);
          border: none;
          color: white;
        }

        .clear-tracking-btn:hover {
          background: #059669;
          color: white;
        }

        /* Right side card details styling */
        .tracking-details-section {
          padding: 32px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tracking-details-section h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 12px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 8px;
        }

        .rider-card-sim {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .rider-card-sim h3 {
          border: none;
          padding-bottom: 0;
          margin-bottom: 8px;
        }

        .rider-flex {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .rider-avatar {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rider-flex h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .rider-flex span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .detail-item-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .detail-icon {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .detail-item-row h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .detail-item-row p {
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .items-mini-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mini-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        @media (max-width: 992px) {
          .tracking-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .tracking-progress-section {
            padding: 20px;
          }
          .timeline-container {
            padding-left: 8px;
          }
          .timeline-line-bg {
            left: 25px;
          }
          .timeline-step-node {
            gap: 12px;
          }
          .tracking-details-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;
