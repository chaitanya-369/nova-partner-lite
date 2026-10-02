import React from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Check, X } from 'lucide-react';

function velocityColor(velocity) {
  switch (velocity) {
    case 'Very High': return { bg: 'rgba(255, 23, 68, 0.85)', text: '#FF1744' };
    case 'High':      return { bg: 'rgba(255, 145, 0, 0.85)', text: '#FF9100' };
    case 'Medium':    return { bg: 'rgba(255, 214, 0, 0.85)', text: '#FFD600' };
    default:          return { bg: 'rgba(158, 158, 158, 0.85)', text: '#9E9E9E' };
  }
}

function riskColor(risk) {
  if (risk >= 85) return '#FF1744';
  if (risk >= 70) return '#FF9100';
  return '#FFD600';
}

/**
 * SwipeCard component
 * Draggable inventory item card with:
 *   - Real-time swipe overlay (✓ / ✗) that appears as you drag
 *   - Animated risk meter bar
 *   - Velocity badge
 *   - AI reasoning tag
 *
 * Props:
 *   item    — inventory item from PREDICTED_ITEMS
 *   index   — stack position (0 = top)
 *   onSwipe(id, action) — 'in-stock' | 'out-of-stock'
 */
export function SwipeCard({ item, index, onSwipe }) {
  const x = useMotionValue(0);
  const controls = useAnimation();

  const rotate = useTransform(x, [-220, 220], [-16, 16]);
  const cardOpacity = useTransform(x, [-220, -100, 0, 100, 220], [0, 1, 1, 1, 0]);

  // Overlay opacities — in-stock (right), out-of-stock (left)
  const inStockOpacity = useTransform(x, [20, 120], [0, 1]);
  const outOfStockOpacity = useTransform(x, [-120, -20], [1, 0]);

  const handleDragEnd = async (_e, info) => {
    const { x: offsetX } = info.offset;
    const { x: velX } = info.velocity;

    if (offsetX > 100 || velX > 500) {
      await controls.start({ x: 700, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } });
      onSwipe(item.id, 'in-stock');
    } else if (offsetX < -100 || velX < -500) {
      await controls.start({ x: -700, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } });
      onSwipe(item.id, 'out-of-stock');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 320, damping: 22 } });
    }
  };

  const vColor = velocityColor(item.velocity);
  const rColor = riskColor(item.stockRisk);

  return (
    <motion.div
      className="swipe-card"
      style={{
        x,
        rotate,
        opacity: cardOpacity,
        zIndex: 100 - index,
        top: index * 14,
        scale: 1 - index * 0.045,
        pointerEvents: index === 0 ? 'auto' : 'none',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* ── Swipe Overlay: In Stock ── */}
      <motion.div className="swipe-overlay in-stock-overlay" style={{ opacity: inStockOpacity }}>
        <div className="overlay-badge in-stock-badge">
          <Check size={28} strokeWidth={3} />
          <span>IN STOCK</span>
        </div>
      </motion.div>

      {/* ── Swipe Overlay: Out of Stock ── */}
      <motion.div className="swipe-overlay out-of-stock-overlay" style={{ opacity: outOfStockOpacity }}>
        <div className="overlay-badge out-of-stock-badge">
          <X size={28} strokeWidth={3} />
          <span>OUT OF STOCK</span>
        </div>
      </motion.div>

      {/* ── Card Image ── */}
      <div className="card-image-container">
        <span className="card-emoji">{item.img}</span>
        <div className="velocity-badge" style={{ background: vColor.bg }}>
          <TrendingUp size={10} />
          <span>{item.velocity}</span>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="card-body">
        <p className="card-category">{item.category}</p>
        <h3 className="card-name">{item.name}</h3>

        {/* Risk meter */}
        <div className="risk-meter">
          <div className="risk-header">
            <div className="risk-label">
              <AlertTriangle size={12} />
              <span>Stockout Risk</span>
            </div>
            <span className="risk-pct" style={{ color: rColor }}>
              {item.stockRisk}%
            </span>
          </div>
          <div className="risk-bar-track">
            <motion.div
              className="risk-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${item.stockRisk}%` }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.7, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg, ${rColor}99, ${rColor})` }}
            />
          </div>
        </div>

        {/* AI reasoning */}
        <div className="ai-reasoning">
          <Sparkles size={13} />
          <span>{item.reason}</span>
        </div>
      </div>
    </motion.div>
  );
}
