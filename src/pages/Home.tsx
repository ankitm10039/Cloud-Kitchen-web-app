import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMenu } from '../store/menuSlice';
import { useTimeBasedMenu } from '../hooks/useTimeBasedMenu';
import MealTimingSelector from '../components/Food/MealTimingSelector';
import Filters from '../components/Food/Filters';
import FoodCard from '../components/Food/FoodCard';
import { ShieldCheck, ChefHat, Zap, MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, categoryFilter, searchQuery } = useAppSelector((state) => state.menu);
  const { selectedTiming, greeting, subtitle } = useTimeBasedMenu();

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  // Filter menu items based on: Selected Timing, Category, and Search Query
  const filteredItems = items.filter((item) => {
    // 1. Filter by meal timing (Breakfast, Lunch, Dinner)
    const matchesTiming = item.timing === selectedTiming;

    // 2. Filter by category
    let matchesCategory = true;
    if (categoryFilter === 'veg') {
      matchesCategory = item.category === 'veg';
    } else if (categoryFilter === 'nonveg') {
      matchesCategory = item.category === 'nonveg';
    } else if (categoryFilter === 'chef-special') {
      matchesCategory = item.isChefSpecial;
    }

    // 3. Filter by search query (name, description, tags)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query));

    return matchesTiming && matchesCategory && matchesSearch;
  });

  const testimonials = [
    {
      id: 1,
      name: "Rohan Sharma",
      role: "Tech Lead",
      content: "The Charcoal Smoked Butter Chicken thali was mind-blowing! True gourmet restaurant quality delivered hot and fast in pristine packaging.",
      rating: 5
    },
    {
      id: 2,
      name: "Ananya Iyer",
      role: "Fitness Coach",
      content: "Their Quinoa Harvest Bowl is a daily lunch staple for me. Fresh avocados, perfectly roasted sweet potatoes, and dressing is top notch.",
      rating: 5
    },
    {
      id: 3,
      name: "Vikram Malhotra",
      role: "Gourmand",
      content: "Ordered the Ultimate Truffle Burger for dinner. Perfectly cooked double patty, melting gruyère, and that truffle aioli was spectacular.",
      rating: 5
    }
  ];

  return (
    <div className="home-page-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.div
            className="hero-text-block"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge">⭐ High-Performance Kitchen</span>
            <h1>Artisan Meals Crafted For Your <span>Cravings</span></h1>
            <p>
              Experience restaurant-standard culinary creations from our hygiene-certified cloud kitchen, prepared fresh by culinary masters and delivered in under 30 minutes.
            </p>
            <div className="hero-cta-group">
              <a href="#menu-anchor" className="btn btn-primary">Order Fresh Now</a>
              <a href="#features-anchor" className="btn btn-secondary">Why CraveCraft?</a>
            </div>
          </motion.div>
          
          <motion.div
            className="hero-graphics-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="floating-plate-glow">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
                alt="Signature gourmet dish plate" 
                className="hero-food-plate"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Core Brand Qualities Section */}
      <section id="features-anchor" className="features-section container">
        <div className="section-header text-center">
          <span className="section-pre-title">Our Philosophy</span>
          <h2>A Smarter Way to Dine</h2>
          <p className="section-subtitle">We bridge the gap between fine dining and convenient home delivery.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <ChefHat className="feature-icon" />
            </div>
            <h3>Chef-Curated Recipes</h3>
            <p>Every single item is conceptualized, tested, and cooked by professional culinary experts using artisanal ingredients.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <ShieldCheck className="feature-icon" />
            </div>
            <h3>Pristine Food Hygiene</h3>
            <p>100% contactless preparation, double-sealed protective packaging, and hourly sanitization audits in our workspace.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Zap className="feature-icon" />
            </div>
            <h3>Lightning Delivery</h3>
            <p>We cook in strategic micro-kitchen blocks, ensuring your hot food arrives within 30 minutes from the pan to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* 3. Interactive Menu Section */}
      <section id="menu-anchor" className="menu-section container">
        <div className="section-header text-center">
          <span className="section-pre-title">Fresh Menu Slots</span>
          <h2>Explore Gourmet Slots</h2>
          <p className="section-subtitle">{greeting}! {subtitle}</p>
        </div>

        {/* Timing Tabs Selector */}
        <MealTimingSelector />

        {/* Search & Category Filter */}
        <Filters />

        {/* Error State */}
        {error && (
          <div className="menu-error-state">
            <p>Oops! {error}</p>
            <button onClick={() => dispatch(fetchMenu())} className="btn btn-primary">Try Again</button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid-responsive">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-card glass-card">
                <div className="skeleton skeleton-img"></div>
                <div className="skeleton-meta-row">
                  <div className="skeleton skeleton-badge"></div>
                  <div className="skeleton skeleton-rating"></div>
                </div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-desc"></div>
                <div className="skeleton-footer-row">
                  <div className="skeleton skeleton-price"></div>
                  <div className="skeleton skeleton-btn"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="menu-empty-state glass-panel">
            <p>No dishes found matching your search criteria or category filter in this meal slot.</p>
            <p className="empty-tip">Try changing your search query or switching tabs!</p>
          </div>
        )}

        {/* Menu Cards Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid-responsive">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-pre-title">Reviews</span>
            <h2>Loved by Food Enthusiasts</h2>
            <p className="section-subtitle">Here is what our regular patrons have to say about the CraveCraft experience.</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card glass-panel">
                <MessageSquareQuote size={32} className="quote-icon" />
                <p className="testimonial-content">"{t.content}"</p>
                <div className="testimonial-footer">
                  <div className="avatar-placeholder">{t.name[0]}</div>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-page-container {
          padding-bottom: 80px;
        }

        /* Hero CSS */
        .hero-section {
          position: relative;
          padding: 80px 0 120px;
          background: radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 10% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 40%);
          overflow: hidden;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 60px;
        }

        .hero-text-block {
          text-align: left;
        }

        .hero-badge {
          display: inline-flex;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 24px;
        }

        .hero-text-block h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          line-height: 1.1;
          color: var(--text-primary);
        }

        .hero-text-block h1 span {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text-block p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 580px;
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
        }

        .hero-graphics-block {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .floating-plate-glow {
          position: relative;
          width: 380px;
          height: 380px;
          border-radius: 50%;
        }

        .floating-plate-glow::before {
          content: '';
          position: absolute;
          top: -10px; left: -10px; right: -10px; bottom: -10px;
          border-radius: 50%;
          background: var(--primary-gradient);
          opacity: 0.35;
          filter: blur(30px);
          z-index: -1;
          animation: floatGlow 6s ease-in-out infinite alternate;
        }

        @keyframes floatGlow {
          0% { transform: scale(0.95); opacity: 0.3; }
          100% { transform: scale(1.05); opacity: 0.5; }
        }

        .hero-food-plate {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 8px solid rgba(255, 255, 255, 0.05);
          box-shadow: var(--shadow-lg);
          animation: spinPlate 40s linear infinite;
        }

        @keyframes spinPlate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Features Section CSS */
        .features-section {
          padding: 80px 24px;
        }

        .section-header {
          margin-bottom: 48px;
        }

        .section-pre-title {
          font-family: var(--font-display);
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 1.05rem;
          margin-top: 10px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .text-center {
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          padding: 32px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .feature-icon {
          flex-shrink: 0;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .feature-card p {
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Menu Section CSS */
        .menu-section {
          padding: 60px 24px 80px;
        }

        .menu-error-state, .menu-empty-state {
          padding: 60px 24px;
          text-align: center;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .menu-empty-state {
          border: 1px dashed var(--border-glass);
        }

        .empty-tip {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Testimonials Section CSS */
        .testimonials-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
          padding: 80px 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-top: 48px;
        }

        .testimonial-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
          background: var(--bg-tertiary);
        }

        .quote-icon {
          color: rgba(245, 158, 11, 0.2);
        }

        .testimonial-content {
          font-size: 0.95rem;
          line-height: 1.6;
          font-style: italic;
          color: var(--text-primary);
          flex-grow: 1;
        }

        .testimonial-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .testimonial-footer h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .testimonial-footer span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Loading Skeletons CSS */
        .skeleton-card {
          padding: 0;
          overflow: hidden;
        }

        .skeleton-img {
          width: 100%;
          padding-top: 65%;
          border-radius: 0;
        }

        .skeleton-meta-row {
          display: flex;
          justify-content: space-between;
          padding: 16px 16px 8px;
        }

        .skeleton-badge {
          width: 80px;
          height: 18px;
        }

        .skeleton-rating {
          width: 40px;
          height: 18px;
        }

        .skeleton-title {
          width: 65%;
          height: 24px;
          margin: 0 16px 10px;
        }

        .skeleton-desc {
          width: 88%;
          height: 40px;
          margin: 0 16px 20px;
        }

        .skeleton-footer-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px 16px;
          border-top: 1px solid var(--border-glass);
        }

        .skeleton-price {
          width: 60px;
          height: 24px;
        }

        .skeleton-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
        }

        @media (max-width: 992px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .hero-text-block {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-text-block h1 {
            font-size: 2.75rem;
          }
          .floating-plate-glow {
            width: 300px;
            height: 300px;
          }
        }

        @media (max-width: 576px) {
          .hero-text-block h1 {
            font-size: 2.25rem;
          }
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-cta-group a {
            width: 100%;
          }
          .floating-plate-glow {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
