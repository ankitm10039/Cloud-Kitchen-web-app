import React from 'react';
import { Search, Flame, CircleDot } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCategoryFilter, setSearchQuery } from '../../store/menuSlice';

const Filters: React.FC = () => {
  const dispatch = useAppDispatch();
  const categoryFilter = useAppSelector((state) => state.menu.categoryFilter);
  const searchQuery = useAppSelector((state) => state.menu.searchQuery);

  const categories: { id: 'all' | 'chef-special'; label: string; icon?: any }[] = [
    { id: 'all', label: 'All Dishes' },
    { id: 'chef-special', label: 'Chef Specials', icon: () => <Flame size={14} className="chef-flame-icon" /> },
  ];

  return (
    <div className="filters-container">
      {/* Search Bar */}
      <div className="search-bar-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search for Kachori, Poha, Daal Bati..."
          className="search-input"
        />
      </div>

      {/* Category Pills & Pure Veg Status */}
      <div className="category-pills-row">
        <div className="pure-veg-badge-container">
          <CircleDot size={14} className="veg-dot-icon" />
          <span>100% PURE VEG</span>
        </div>

        <div className="category-pills">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => dispatch(setCategoryFilter(cat.id))}
                className={`pill-btn ${isActive ? 'active' : ''}`}
              >
                {Icon && <Icon />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .filters-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .search-bar-wrapper {
          position: relative;
          flex: 1;
          min-width: 280px;
          max-width: 420px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          transition: all var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
        }

        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .pure-veg-badge-container {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 10px 18px;
          border-radius: var(--radius-full);
          color: #10B981;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .category-pills {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .pill-btn:hover {
          border-color: var(--border-glass-hover);
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        .pill-btn.active {
          background: var(--bg-tertiary);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.12);
        }

        .veg-dot-icon {
          color: #10B981;
          fill: #10B981;
        }

        .chef-flame-icon {
          color: #F59E0B;
          fill: #F59E0B;
        }

        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }
          .search-bar-wrapper {
            max-width: 100%;
          }
          .category-pills-row {
            flex-direction: row;
            justify-content: space-between;
          }
          .category-pills {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 4px;
            white-space: nowrap;
            flex-wrap: nowrap;
            /* Hide scrollbar */
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .category-pills::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Filters;
