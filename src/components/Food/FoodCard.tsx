import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Plus, Check, Flame, Award } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodCardProps {
  item: MenuItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);

  // Find if item is already in cart to show current count
  const cartItem = items.find((ci) => ci.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents clicking card link when clicking Add button
    add(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // Reset animation after 1.5s
  };

  // Render spice flame icons
  const renderSpiceLevel = () => {
    if (item.spiceLevel === 0) return null;
    return (
      <div className="spice-level-indicators" title={`Spice Level: ${item.spiceLevel}/3`}>
        {Array.from({ length: item.spiceLevel }).map((_, i) => (
          <Flame key={i} size={14} className="spice-flame-active" />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="food-card glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/menu/${item.id}`} className="card-link-wrapper">
        {/* Card Image Header */}
        <div className="card-image-wrapper">
          <img src={item.image} alt={item.name} className="card-image" loading="lazy" />
          
          {/* Category Tag */}
          <span className={`category-indicator-badge ${item.category}`}>
            <span className="dot"></span>
            {item.category === 'veg' ? 'VEG' : 'NON-VEG'}
          </span>

          {/* Chef Special Badge */}
          {item.isChefSpecial && (
            <span className="badge badge-chef chef-badge-overlay">
              <Award size={12} />
              Chef Special
            </span>
          )}

          {/* Rating Overlay */}
          <div className="card-rating-overlay">
            <Star size={12} className="star-icon" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="card-meta-row">
            <span className="card-calories">{item.calories} kcal</span>
            {renderSpiceLevel()}
          </div>

          <h3 className="card-title">{item.name}</h3>
          
          <p className="card-desc">
            {item.description.length > 80 
              ? `${item.description.substring(0, 80)}...` 
              : item.description}
          </p>

          <div className="card-footer-row">
            <div className="price-tag">
              <span className="currency">₹</span>
              <span className="amount">{item.price}</span>
            </div>

            <div className="card-actions">
              <div className="delivery-time-meta">
                <Clock size={12} className="time-icon" />
                <span>{item.deliveryTime}m</span>
              </div>

              {/* Add to Cart button */}
              <button 
                onClick={handleAddToCart}
                className={`add-to-cart-btn ${currentQuantity > 0 ? 'in-cart' : ''}`}
                aria-label="Add item to cart"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="checked"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="btn-content-flex"
                    >
                      <Check size={16} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="plus"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="btn-content-flex"
                    >
                      <Plus size={16} />
                      {currentQuantity > 0 && <span className="qty-sub">{currentQuantity}</span>}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .food-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0;
          height: 100%;
        }

        .card-link-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 65%; /* 16:10 Aspect Ratio */
          overflow: hidden;
          background-color: var(--bg-tertiary);
        }

        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .food-card:hover .card-image {
          transform: scale(1.08);
        }

        .category-indicator-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .category-indicator-badge.veg {
          background: rgba(16, 185, 129, 0.85);
          color: white;
        }

        .category-indicator-badge.nonveg {
          background: rgba(239, 68, 68, 0.85);
          color: white;
        }

        .category-indicator-badge .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
        }

        .chef-badge-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          font-size: 0.65rem;
          box-shadow: var(--shadow-sm);
        }

        .card-rating-overlay {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: #FBBF24;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .star-icon {
          fill: #FBBF24;
        }

        .card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .card-calories {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .spice-level-indicators {
          display: flex;
          gap: 2px;
        }

        .spice-flame-active {
          color: #EF4444;
          fill: #EF4444;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.3;
          height: 2.6rem; /* Restrict title to 2 lines max */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
          height: 3.8rem; /* Restrict description height */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border-glass);
        }

        .price-tag {
          display: flex;
          align-items: baseline;
          color: var(--text-primary);
          font-family: var(--font-display);
        }

        .currency {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary);
          margin-right: 2px;
        }

        .amount {
          font-size: 1.35rem;
          font-weight: 800;
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .delivery-time-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .time-icon {
          color: var(--text-muted);
        }

        .add-to-cart-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-to-cart-btn:hover {
          background: var(--primary-gradient);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
          transform: scale(1.05);
        }

        .add-to-cart-btn.in-cart {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(245, 158, 11, 0.08);
        }

        .add-to-cart-btn.in-cart:hover {
          background: var(--primary-gradient);
          color: white;
          border-color: transparent;
        }

        .btn-content-flex {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .qty-sub {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--accent);
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          min-width: 14px;
          height: 14px;
          border-radius: 7px;
          padding: 0 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--bg-secondary);
        }
      `}</style>
    </motion.div>
  );
};

export default FoodCard;
