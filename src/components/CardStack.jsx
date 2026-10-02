import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from './SwipeCard';

/**
 * CardStack component
 * Manages the stacked display of SwipeCards.
 * Only the top card (index 0) is draggable; others serve as visual depth.
 *
 * Props:
 *   items    — remaining items to review
 *   onSwipe  — passed through to SwipeCard
 */
export function CardStack({ items, onSwipe }) {
  // Show max 3 cards in the stack for visual depth
  const visibleItems = items.slice(0, 3);

  return (
    <div className="card-stack">
      <AnimatePresence>
        {visibleItems.map((item, index) => (
          <SwipeCard
            key={item.id}
            item={item}
            index={index}
            onSwipe={onSwipe}
          />
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <motion.div
          className="stack-empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="stack-empty-emoji">✅</span>
          <p>All items reviewed</p>
        </motion.div>
      )}
    </div>
  );
}
