import React from 'react';
import { Sunrise, Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSelectedTiming } from '../../store/menuSlice';
import { motion } from 'framer-motion';

const MealTimingSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTiming = useAppSelector((state) => state.menu.selectedTiming);

  const timings: { id: 'Breakfast' | 'Lunch' | 'Dinner'; label: string; icon: any }[] = [
    { id: 'Breakfast', label: 'Breakfast', icon: Sunrise },
    { id: 'Lunch', label: 'Lunch', icon: Sun },
    { id: 'Dinner', label: 'Dinner', icon: Moon },
  ];

  return (
    <div className="timing-selector-wrapper">
      <div className="timing-selector glass-panel">
        {timings.map((time) => {
          const Icon = time.icon;
          const isActive = selectedTiming === time.id;
          return (
            <button
              key={time.id}
              onClick={() => dispatch(setSelectedTiming(time.id))}
              className={`timing-tab ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTimingTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} className="tab-icon" />
              <span>{time.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .timing-selector-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .timing-selector {
          display: flex;
          padding: 6px;
          border-radius: var(--radius-lg);
          gap: 4px;
          position: relative;
          background: rgba(18, 20, 28, 0.4);
          z-index: 10;
        }

        .timing-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color var(--transition-fast);
          z-index: 1;
        }

        .timing-tab:hover {
          color: var(--text-primary);
        }

        .timing-tab.active {
          color: white;
        }

        .tab-icon {
          flex-shrink: 0;
        }

        .active-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--primary-gradient);
          border-radius: var(--radius-md);
          z-index: -1;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        @media (max-width: 576px) {
          .timing-selector {
            width: 100%;
          }
          .timing-tab {
            flex: 1;
            padding: 10px 12px;
            font-size: 0.85rem;
            gap: 4px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MealTimingSelector;
