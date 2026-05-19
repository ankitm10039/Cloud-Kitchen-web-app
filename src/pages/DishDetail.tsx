import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMenu } from '../store/menuSlice';
import { useCart } from '../hooks/useCart';
import { ArrowLeft, Star, Clock, Flame, ShieldAlert, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const DishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: menuItems, loading } = useAppSelector((state) => state.menu);
  const { add } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [customInstructions, setCustomInstructions] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState<string | null>(null);

  // Load menu if empty
  useEffect(() => {
    if (menuItems.length === 0) {
      dispatch(fetchMenu());
    }
  }, [dispatch, menuItems]);

  const dish = menuItems.find((item) => item.id === id);

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!dish) return;
    const finalNotes = [
      selectedTopping ? `Topping: ${selectedTopping}` : '',
      customInstructions.trim()
    ].filter(Boolean).join('. ');
    
    add(dish, quantity, finalNotes);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="detail-loading-container container">
        <div className="skeleton skeleton-detail-img"></div>
        <div className="skeleton-detail-body">
          <div className="skeleton skeleton-title-large"></div>
          <div className="skeleton skeleton-text-med"></div>
          <div className="skeleton skeleton-text-large"></div>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="detail-error-container container text-center">
        <ShieldAlert size={60} className="error-icon" />
        <h2>Dish Not Found</h2>
        <p>The culinary creation you are looking for might have been retired or shifted slots.</p>
        <Link to="/" className="btn btn-primary">Back to Menu</Link>
      </div>
    );
  }

  const toppings = dish.category === 'veg' 
    ? ["Extra Paneer (+₹50)", "Extra Cheese (+₹30)", "Less Oil"]
    : ["Extra Chicken (+₹60)", "Extra Egg (+₹20)", "Spicy Butter Glaze"];

  return (
    <div className="dish-detail-page container">
      {/* Back Button */}
      <div className="back-btn-wrapper">
        <button onClick={() => navigate(-1)} className="btn-icon back-arrow-btn" aria-label="Go Back">
          <ArrowLeft size={20} />
        </button>
        <span className="back-btn-text">Back to Menu</span>
      </div>

      <div className="dish-grid">
        {/* Left Side: Dish Image */}
        <motion.div 
          className="dish-image-section"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="detail-image-glow-wrapper">
            <img src={dish.image} alt={dish.name} className="dish-detail-image" />
          </div>
        </motion.div>

        {/* Right Side: Dish Details */}
        <motion.div 
          className="dish-info-section glass-panel"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Tags row */}
          <div className="detail-tags-row">
            <span className={`badge badge-veg-nonveg ${dish.category}`}>
              {dish.category === 'veg' ? 'VEG' : 'NON-VEG'}
            </span>
            {dish.isChefSpecial && (
              <span className="badge badge-chef">
                <Sparkles size={10} /> Chef Special
              </span>
            )}
            {dish.tags.map((tag, idx) => (
              <span key={idx} className="badge-tag-label">{tag}</span>
            ))}
          </div>

          <h1 className="dish-detail-title">{dish.name}</h1>

          {/* Quick Metrics */}
          <div className="detail-metrics-row">
            <div className="metric-item" title="Rating">
              <Star size={16} className="star-icon-fill" />
              <span>{dish.rating} (120+ reviews)</span>
            </div>
            <div className="divider-dot"></div>
            <div className="metric-item" title="Prep & Delivery Time">
              <Clock size={16} />
              <span>{dish.deliveryTime} mins delivery</span>
            </div>
            <div className="divider-dot"></div>
            <div className="metric-item" title="Calories">
              <Flame size={16} className="calorie-fire" />
              <span>{dish.calories} kcal</span>
            </div>
          </div>

          {/* Price */}
          <div className="detail-price-wrapper">
            <span className="detail-currency">₹</span>
            <span className="detail-amount">{dish.price}</span>
            <span className="price-tax-note">inclusive of all GST charges</span>
          </div>

          <p className="dish-detail-desc">{dish.description}</p>

          {/* Ingredients list */}
          <div className="ingredients-box">
            <h4>Fresh Ingredients</h4>
            <div className="ingredients-list">
              {dish.ingredients.map((ing, index) => (
                <span key={index} className="ingredient-chip">{ing}</span>
              ))}
            </div>
          </div>

          {/* Customizations options */}
          <div className="customizations-box">
            <h4>Select Customizations (Optional)</h4>
            <div className="custom-options-grid">
              {toppings.map((topping, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTopping(selectedTopping === topping ? null : topping)}
                  className={`custom-opt-btn ${selectedTopping === topping ? 'active' : ''}`}
                >
                  {topping}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions (Textarea) */}
          <div className="instructions-box">
            <h4>Chef Instructions (Optional)</h4>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Make it extra spicy, discard coriander leaves..."
              className="instructions-input-field"
            />
          </div>

          {/* Quantity and Actions */}
          <div className="detail-action-footer">
            <div className="detail-qty-picker">
              <button onClick={decrementQty} className="qty-btn" aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="qty-val">{quantity}</span>
              <button onClick={incrementQty} className="qty-btn" aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>

            <button 
              onClick={handleAddToCart} 
              className={`btn btn-primary detail-add-to-cart-btn ${addedFeedback ? 'added' : ''}`}
            >
              {addedFeedback ? (
                <>
                  <Check size={18} /> Item Added to Cart
                </>
              ) : (
                <>
                  Add to Cart • ₹{dish.price * quantity}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .dish-detail-page {
          padding-top: 40px;
          padding-bottom: 80px;
        }

        .back-btn-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .back-arrow-btn {
          width: 44px;
          height: 44px;
        }

        .back-btn-text {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .dish-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 48px;
          align-items: start;
        }

        /* Left Image CSS */
        .dish-image-section {
          width: 100%;
        }

        .detail-image-glow-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          width: 100%;
          padding-top: 80%; /* aspect ratio */
          box-shadow: var(--shadow-md);
        }

        .detail-image-glow-wrapper::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.4) inset;
          pointer-events: none;
        }

        .dish-detail-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Right Info CSS */
        .dish-info-section {
          padding: 40px;
          text-align: left;
        }

        .detail-tags-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .badge-veg-nonveg {
          padding: 4px 10px;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: var(--radius-full);
        }

        .badge-veg-nonveg.veg {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge-veg-nonveg.nonveg {
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .badge-tag-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
        }

        .dish-detail-title {
          font-size: 2.25rem;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .detail-metrics-row {
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 24px;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .star-icon-fill {
          color: #FBBF24;
          fill: #FBBF24;
        }

        .calorie-fire {
          color: #EF4444;
        }

        .divider-dot {
          width: 4px;
          height: 4px;
          background: var(--text-muted);
          border-radius: 50%;
        }

        .detail-price-wrapper {
          display: flex;
          align-items: baseline;
          margin-bottom: 24px;
        }

        .detail-currency {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary);
          margin-right: 2px;
          font-family: var(--font-display);
        }

        .detail-amount {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          font-family: var(--font-display);
          line-height: 1;
        }

        .price-tax-note {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-left: 12px;
        }

        .dish-detail-desc {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 32px;
          color: var(--text-secondary);
        }

        .ingredients-box, .customizations-box, .instructions-box {
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-glass);
        }

        .ingredients-box h4, .customizations-box h4, .instructions-box h4 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ingredients-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ingredient-chip {
          font-size: 0.85rem;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
        }

        .custom-options-grid {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .custom-opt-btn {
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .custom-opt-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-glass-hover);
        }

        .custom-opt-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(245, 158, 11, 0.05);
        }

        .instructions-input-field {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .instructions-input-field:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
        }

        .detail-action-footer {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 12px;
        }

        .detail-qty-picker {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .detail-qty-picker .qty-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
        }

        .detail-qty-picker .qty-btn:hover {
          background: var(--border-glass-hover);
          color: var(--text-primary);
        }

        .qty-val {
          font-size: 1.1rem;
          font-weight: 700;
          width: 32px;
          text-align: center;
          color: var(--text-primary);
        }

        .detail-add-to-cart-btn {
          flex-grow: 1;
          height: 48px;
        }

        .detail-add-to-cart-btn.added {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        /* Loading Detail Skeletons */
        .detail-loading-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          padding: 80px 24px;
        }

        .skeleton-detail-img {
          width: 100%;
          padding-top: 80%;
          border-radius: var(--radius-lg);
        }

        .skeleton-detail-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-title-large {
          width: 80%;
          height: 48px;
        }

        .skeleton-text-med {
          width: 40%;
          height: 24px;
        }

        .skeleton-text-large {
          width: 95%;
          height: 120px;
        }

        @media (max-width: 992px) {
          .dish-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .detail-loading-container {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 576px) {
          .dish-info-section {
            padding: 24px;
          }
          .detail-action-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .detail-qty-picker {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default DishDetail;
