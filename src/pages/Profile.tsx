import React, { useState } from 'react';
import { useAppSelector } from '../store';
import { useCart } from '../hooks/useCart';
import { Calendar, Clock, CheckCircle, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const { orders } = useAppSelector((state) => state.order);
  const { add } = useCart();
  
  // Profile Editable Details State
  const [name, setName] = useState('Ankit Meena');
  const [email, setEmail] = useState('ankit.meena@aapkaapnakitchen.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal State for order inspection
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReorder = (orderItems: any[]) => {
    orderItems.forEach((item) => {
      // Add items to current cart
      add(item, item.quantity, item.customNotes || '');
    });
    // Visual indicator: show alert or popup
    alert("Historical order items have been populated in your cart!");
  };

  const formatDate = (isoString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="profile-page container">
      <div className="profile-grid">
        {/* Left Side: Profile info */}
        <motion.div 
          className="profile-details-card glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="profile-header-avatar">
            <div className="avatar-letter">{name[0]}</div>
            <h2>My Profile</h2>
          </div>

          <form onSubmit={handleProfileSave} className="profile-edit-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className="form-input"
                required
              />
            </div>

            <div className="profile-action-row">
              {isEditing ? (
                <>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="btn btn-secondary edit-profile-btn">
                  Edit Profile
                </button>
              )}
            </div>

            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  className="profile-save-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle size={14} /> Profile details updated locally!
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Right Side: Order History */}
        <motion.div 
          className="order-history-card glass-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <div className="empty-history text-center">
              <Calendar size={32} className="history-empty-icon" />
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="history-list">
              {orders.map((order) => (
                <div key={order.id} className="history-tile">
                  <div className="tile-info-block">
                    <span className="history-order-id">{order.id}</span>
                    <div className="history-meta-info">
                      <div className="meta-icon-flex">
                        <Calendar size={12} />
                        <span>{formatDate(order.createdAt).split(',')[0]}</span>
                      </div>
                      <div className="meta-icon-flex">
                        <Clock size={12} />
                        <span>{formatDate(order.createdAt).split(',')[1]}</span>
                      </div>
                    </div>
                    <span className={`history-status-badge ${order.status}`}>{order.status}</span>
                  </div>

                  <div className="tile-action-block">
                    <span className="history-price">₹{order.total}</span>
                    <div className="tile-button-group">
                      <button 
                        onClick={() => handleReorder(order.items)} 
                        className="btn-reorder-tiny"
                        title="Reorder items"
                      >
                        Reorder
                      </button>
                      <button 
                        onClick={() => setSelectedOrderDetails(order)} 
                        className="btn-details-arrow"
                        aria-label="View Details"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal (AnimatePresence) */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <>
            <motion.div 
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderDetails(null)}
            />
            
            <motion.div 
              className="details-modal glass-panel"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3>Order Receipt ({selectedOrderDetails.id})</h3>
                <button onClick={() => setSelectedOrderDetails(null)} className="btn-icon" aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-receipt-meta">
                  <p><strong>Date Placed:</strong> {formatDate(selectedOrderDetails.createdAt)}</p>
                  <p><strong>Payment Method:</strong> {selectedOrderDetails.paymentMethod}</p>
                  <p><strong>Delivery Address:</strong> {selectedOrderDetails.shippingAddress.street}, {selectedOrderDetails.shippingAddress.city}</p>
                </div>

                <div className="modal-receipt-items">
                  <h4>Items Summary</h4>
                  {selectedOrderDetails.items.map((item: any) => (
                    <div key={item.id} className="modal-receipt-item-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="modal-receipt-totals">
                  <div className="modal-summary-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrderDetails.subtotal}</span>
                  </div>
                  <div className="modal-summary-row">
                    <span>GST (5%)</span>
                    <span>₹{selectedOrderDetails.tax}</span>
                  </div>
                  <div className="modal-summary-row">
                    <span>Delivery Fee</span>
                    <span>{selectedOrderDetails.deliveryFee === 0 ? "FREE" : `₹${selectedOrderDetails.deliveryFee}`}</span>
                  </div>
                  <div className="modal-summary-row modal-total-row">
                    <span>Total Amount</span>
                    <span>₹{selectedOrderDetails.total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .profile-page {
          padding-top: 40px;
          padding-bottom: 80px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 32px;
          align-items: start;
        }

        /* Profile details left card */
        .profile-details-card {
          padding: 32px;
          text-align: left;
        }

        .profile-header-avatar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .avatar-letter {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          font-weight: 800;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
        }

        .profile-header-avatar h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .profile-edit-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profile-edit-form input:disabled {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          opacity: 0.75;
          cursor: not-allowed;
        }

        .profile-action-row {
          margin-top: 16px;
          display: flex;
          gap: 12px;
        }

        .edit-profile-btn {
          width: 100%;
        }

        .profile-save-success {
          margin-top: 12px;
          padding: 10px 14px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--success);
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* History right card styling */
        .order-history-card {
          padding: 32px;
          text-align: left;
        }

        .order-history-card h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .empty-history {
          padding: 48px 0;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .history-empty-icon {
          color: var(--text-muted);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-tile {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .history-tile:hover {
          border-color: var(--border-glass-hover);
        }

        .tile-info-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .history-order-id {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .history-meta-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .meta-icon-flex {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .history-status-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          align-self: flex-start;
        }

        .history-status-badge.placed { background: var(--info-bg); color: var(--info); }
        .history-status-badge.confirmed { background: var(--info-bg); color: var(--info); }
        .history-status-badge.cooking { background: var(--warning-bg); color: var(--warning); }
        .history-status-badge.delivering { background: rgba(245, 158, 11, 0.1); color: var(--primary); }
        .history-status-badge.delivered { background: var(--success-bg); color: var(--success); }

        .tile-action-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .history-price {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tile-button-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-reorder-tiny {
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: var(--primary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-reorder-tiny:hover {
          background: var(--primary-gradient);
          color: white;
          border-color: transparent;
        }

        .btn-details-arrow {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .btn-details-arrow:hover {
          color: var(--text-primary);
        }

        /* Receipt Modal */
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 100;
        }

        .details-modal {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          background: var(--bg-secondary);
          z-index: 101;
          padding: 32px;
          text-align: left;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 16px;
        }

        .modal-header h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
        }

        .modal-receipt-meta {
          background: var(--bg-tertiary);
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .modal-receipt-items {
          margin-bottom: 24px;
        }

        .modal-receipt-items h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .modal-receipt-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
          padding: 6px 0;
          border-bottom: 1px solid var(--border-glass);
        }

        .modal-receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px dashed var(--border-glass);
        }

        .modal-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .modal-total-row {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          border-top: 1px solid var(--border-glass);
          padding-top: 12px;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
