import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag, Notebook } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, subtotal, tax, deliveryFee, total, updateQty, remove, setNotes } = useCart();
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleOpenNotes = (id: string, currentNotes = '') => {
    setEditingNotesId(id);
    setNoteText(currentNotes);
  };

  const handleSaveNotes = (id: string) => {
    setNotes(id, noteText);
    setEditingNotesId(null);
  };

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            className="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="cart-drawer glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="header-title">
                <ShoppingBag size={20} className="header-icon" />
                <h2>Your Order</h2>
                <span className="drawer-item-count">({items.length})</span>
              </div>
              <button onClick={onClose} className="btn-icon close-drawer-btn" aria-label="Close Cart">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="drawer-body">
              {items.length === 0 ? (
                <div className="empty-cart-state">
                  <div className="empty-icon-glow">
                    <ShoppingBag size={48} className="empty-bag-icon" />
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add delicious meals from our kitchen to start ordering.</p>
                  <button onClick={onClose} className="btn btn-primary start-ordering-btn">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <button 
                            onClick={() => remove(item.id)} 
                            className="item-delete-btn"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="cart-item-price-qty">
                          <span className="cart-item-price">₹{item.price * item.quantity}</span>
                          
                          <div className="qty-controller">
                            <button 
                              onClick={() => updateQty(item.id, item.quantity - 1)} 
                              className="qty-btn"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item.id, item.quantity + 1)} 
                              className="qty-btn"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Chef Notes Toggle */}
                        {editingNotesId === item.id ? (
                          <div className="chef-notes-editor">
                            <input
                              type="text"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="e.g. Extra spicy, No onions, Less cheese"
                              className="notes-input"
                              maxLength={60}
                            />
                            <div className="notes-actions">
                              <button onClick={() => setEditingNotesId(null)} className="notes-cancel-btn">Cancel</button>
                              <button onClick={() => handleSaveNotes(item.id)} className="notes-save-btn">Save</button>
                            </div>
                          </div>
                        ) : (
                          <div className="chef-notes-display">
                            {item.customNotes ? (
                              <span className="notes-text-badge">
                                <Notebook size={10} />
                                {item.customNotes}
                                <button onClick={() => handleOpenNotes(item.id, item.customNotes)} className="notes-edit-inline">Edit</button>
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleOpenNotes(item.id)} 
                                className="add-notes-btn"
                              >
                                <Notebook size={12} />
                                Add special instructions...
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Order Summary */}
            {items.length > 0 && (
              <div className="drawer-footer">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="free-fee">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                
                {deliveryFee > 0 && (
                  <div className="free-delivery-nudge">
                    Add <strong>₹{500 - subtotal}</strong> more for <strong>FREE delivery!</strong>
                  </div>
                )}

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>

                <button 
                  onClick={handleCheckoutClick} 
                  className="btn btn-primary checkout-action-btn"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 100;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 440px;
          height: 100vh;
          border-radius: 0;
          border-left: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          z-index: 101;
          box-shadow: var(--shadow-lg);
          background: var(--bg-secondary);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid var(--border-glass);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title h2 {
          font-size: 1.35rem;
          color: var(--text-primary);
        }

        .header-icon {
          color: var(--primary);
        }

        .drawer-item-count {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 1rem;
        }

        .close-drawer-btn {
          width: 36px;
          height: 36px;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .empty-cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          gap: 16px;
        }

        .empty-icon-glow {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.05) inset;
        }

        .empty-bag-icon {
          color: var(--text-muted);
        }

        .empty-cart-state h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .empty-cart-state p {
          font-size: 0.9rem;
          max-width: 260px;
        }

        .start-ordering-btn {
          margin-top: 8px;
          width: 100%;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item-row {
          display: flex;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-glass);
        }

        .cart-item-img {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          object-fit: cover;
          background: var(--bg-tertiary);
          flex-shrink: 0;
        }

        .cart-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cart-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .cart-item-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .item-delete-btn {
          color: var(--text-muted);
          transition: color var(--transition-fast);
          padding: 2px;
          background: none;
        }

        .item-delete-btn:hover {
          color: var(--accent);
        }

        .cart-item-price-qty {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-item-price {
          font-family: var(--font-sans);
          font-weight: 700;
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        .qty-controller {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 2px;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
        }

        .qty-btn:hover {
          background: var(--border-glass-hover);
          color: var(--text-primary);
        }

        .qty-number {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0 10px;
          color: var(--text-primary);
        }

        .add-notes-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: color var(--transition-fast);
          text-align: left;
        }

        .add-notes-btn:hover {
          color: var(--primary);
        }

        .notes-text-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--primary);
          line-height: 1.2;
        }

        .notes-edit-inline {
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          margin-left: 6px;
          cursor: pointer;
          font-size: 0.7rem;
        }

        .notes-edit-inline:hover {
          color: var(--text-primary);
          text-decoration: underline;
        }

        .chef-notes-editor {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: var(--bg-tertiary);
          padding: 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
        }

        .notes-input {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          padding: 6px 10px;
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-sans);
        }

        .notes-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .notes-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .notes-cancel-btn, .notes-save-btn {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .notes-cancel-btn {
          color: var(--text-muted);
          background: none;
        }

        .notes-save-btn {
          background: var(--primary-gradient);
          color: white;
          border: none;
        }

        .drawer-footer {
          padding: 24px;
          border-top: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--bg-secondary);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .free-fee {
          color: var(--success);
          font-weight: 700;
        }

        .free-delivery-nudge {
          background: rgba(16, 185, 129, 0.08);
          border: 1px dashed rgba(16, 185, 129, 0.3);
          color: var(--success);
          font-size: 0.75rem;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .total-row {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 4px;
          padding-top: 12px;
          border-top: 1px dashed var(--border-glass);
        }

        .checkout-action-btn {
          width: 100%;
          margin-top: 8px;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default CartDrawer;
