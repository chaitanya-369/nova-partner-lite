import React from 'react';
import { Package, ChevronRight } from 'lucide-react';

/**
 * Header component
 * Shows the NOVA LITE brand, store badge, and a compact progress indicator.
 *
 * Props:
 *   storeId      — store number to display in badge
 *   totalItems   — total items in today's briefing
 *   doneItems    — how many have been reviewed
 *   showProgress — whether to show the progress bar (hidden on auth/loading screens)
 */
export function Header({ storeId, totalItems = 0, doneItems = 0, showProgress = false }) {
  const pct = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

  return (
    <header className="header">
      <div className="logo-area">
        <Package className="logo-icon" size={26} />
        <div className="logo-text">
          NOVA<span className="logo-lite">LITE</span>
        </div>
      </div>

      <div className="header-right">
        {storeId && (
          <div className="store-badge">
            <span>Store</span>
            <ChevronRight size={10} />
            <span className="store-id">#{storeId}</span>
          </div>
        )}
      </div>

      {showProgress && totalItems > 0 && (
        <div className="header-progress">
          <div
            className="header-progress-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </header>
  );
}
