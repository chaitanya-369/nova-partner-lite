import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, TrendingDown, Clock, ShieldCheck, Package2 } from 'lucide-react';

/**
 * CompletionScreen component
 * Shown after all items are reviewed and the batch sync succeeds.
 * Displays gamified impact stats to create a "dopamine loop" for the store owner.
 *
 * Props:
 *   stats      — { inStock, outOfStock, total, syncTimestamp }
 *   storeName  — display name of the store
 *   onReset    — callback to restart the session (demo)
 */
export function CompletionScreen({ stats, storeName, onReset }) {
  const timeSavedMin = Math.round(stats.total * 5.5); // ~5.5 min saved per item vs manual update
  const cancellationsPrevented = stats.outOfStock * 7; // avg 7 orders at risk per out-of-stock item

  const statItems = [
    {
      icon: <Package2 size={18} />,
      label: 'Items Reviewed',
      value: stats.total,
      suffix: 'items',
      highlight: false,
    },
    {
      icon: <CheckCircle2 size={18} />,
      label: 'Confirmed In Stock',
      value: stats.inStock,
      suffix: 'items',
      highlight: false,
    },
    {
      icon: <Clock size={18} />,
      label: 'Time Saved',
      value: `~${timeSavedMin}`,
      suffix: 'min',
      highlight: true,
    },
    {
      icon: <TrendingDown size={18} />,
      label: 'Cancellations Prevented',
      value: `~${cancellationsPrevented}`,
      suffix: 'estimated',
      highlight: true,
    },
    {
      icon: <ShieldCheck size={18} />,
      label: 'Catalog Accuracy',
      value: '100%',
      suffix: 'for flagged items',
      highlight: true,
    },
  ];

  return (
    <div className="completion-screen">
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
      >
        <CheckCircle2 className="success-icon-large" size={72} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <h2 className="completion-title">All Done! 🎉</h2>
        <p className="completion-subtitle">Your catalog is live and accurate.</p>
      </motion.div>

      {/* Stats card */}
      <motion.div
        className="stats-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="stats-header">
          <span className="stats-header-label">Today's Impact</span>
          <span className="stats-sync-badge">✓ Synced</span>
        </div>

        {statItems.map((s, i) => (
          <motion.div
            key={i}
            className="stat-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          >
            <div className="stat-icon-label">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-value-group">
              <span className={`stat-value ${s.highlight ? 'highlight' : ''}`}>{s.value}</span>
              <span className="stat-suffix">{s.suffix}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Reset for demo */}
      <motion.button
        className="reset-btn"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <RotateCcw size={16} />
        <span>Run Again (Demo)</span>
      </motion.button>
    </div>
  );
}
