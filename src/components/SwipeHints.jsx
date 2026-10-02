import React from 'react';
import { X, Check } from 'lucide-react';

/**
 * SwipeHints component
 * Renders the Left (Out of Stock) / Right (In Stock) affordance labels
 * at the bottom of the review screen.
 *
 * Props:
 *   remaining — number of items left (shows count between hints)
 *   total     — total items in briefing
 */
export function SwipeHints({ remaining, total }) {
  const done = total - remaining;

  return (
    <div className="swipe-instructions">
      <div className="swipe-hint left">
        <div className="icon-circle">
          <X size={22} strokeWidth={2.5} />
        </div>
        <span>Out of Stock</span>
      </div>

      <div className="swipe-counter">
        <span className="swipe-counter-done">{done}</span>
        <span className="swipe-counter-sep">/</span>
        <span className="swipe-counter-total">{total}</span>
      </div>

      <div className="swipe-hint right">
        <div className="icon-circle">
          <Check size={22} strokeWidth={2.5} />
        </div>
        <span>In Stock</span>
      </div>
    </div>
  );
}
