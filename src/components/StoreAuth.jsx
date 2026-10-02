import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Delete, ArrowRight } from 'lucide-react';

const PIN_LENGTH = 4;
const VALID_DEMO_PIN = '8842'; // Any 4-digit PIN works for demo

/**
 * StoreAuth component
 * Provides a numeric PIN pad for store owner authentication.
 * In Phase 2, POST the PIN to your auth endpoint and receive a JWT.
 *
 * Props:
 *   onAuth(storeId) — called when PIN is verified
 */
export function StoreAuth({ onAuth }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleDigit = (digit) => {
    if (pin.length >= PIN_LENGTH) return;
    setPin((p) => p + digit);
    setError('');
  };

  const handleBackspace = () => {
    setPin((p) => p.slice(0, -1));
    setError('');
  };

  const handleSubmit = () => {
    if (pin.length < PIN_LENGTH) {
      setError('Enter your 4-digit Store PIN');
      triggerShake();
      return;
    }

    // Demo: accept any 4-digit PIN, use last 3 digits as store ID
    // Phase 2: replace with real auth API call
    const storeId = pin.slice(-3);
    onAuth(storeId);
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'del'];

  return (
    <div className="auth-screen">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Brand mark */}
        <div className="auth-brand">
          <div className="auth-logo-ring">
            <Package size={28} className="auth-logo-icon" />
          </div>
          <div className="auth-title">NOVA<span>LITE</span></div>
          <p className="auth-subtitle">Partner Inventory Portal</p>
        </div>

        {/* PIN dots */}
        <motion.div
          className="pin-display"
          animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
            />
          ))}
        </motion.div>

        {error && (
          <motion.p
            className="auth-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        {/* Numpad */}
        <div className="numpad">
          {DIGITS.map((d, i) => {
            if (d === null) return <div key={i} />;
            if (d === 'del') {
              return (
                <button key={i} className="numpad-key action" onClick={handleBackspace}>
                  <Delete size={20} />
                </button>
              );
            }
            return (
              <motion.button
                key={i}
                className="numpad-key"
                onClick={() => handleDigit(d)}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {d}
              </motion.button>
            );
          })}
        </div>

        {/* Submit */}
        <motion.button
          className="auth-submit-btn"
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Open Briefing</span>
          <ArrowRight size={18} />
        </motion.button>

        <p className="auth-hint">Enter your 4-digit store PIN to continue</p>
      </motion.div>
    </div>
  );
}
