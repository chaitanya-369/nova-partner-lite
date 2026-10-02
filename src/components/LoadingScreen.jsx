import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * LoadingScreen component
 * Displayed while useBriefing() is fetching data from the Prediction API.
 * Animates through analysis steps with a smooth progress bar.
 *
 * Props:
 *   loadingStep      — current step string (e.g. "Scanning demand signals...")
 *   loadingProgress  — 0–100 number representing fetch progress
 */
export function LoadingScreen({ loadingStep, loadingProgress }) {
  return (
    <div className="loading-screen">
      <motion.div
        className="loading-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated AI orb */}
        <div className="ai-orb-container">
          <motion.div
            className="ai-orb"
            animate={{
              boxShadow: [
                '0 0 20px rgba(94, 53, 177, 0.4)',
                '0 0 50px rgba(94, 53, 177, 0.8)',
                '0 0 20px rgba(94, 53, 177, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={32} className="orb-icon" />
          </motion.div>

          {/* Orbiting ring */}
          <motion.div
            className="orb-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="orb-ring orb-ring-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="loading-text-area">
          <h2 className="loading-title">AI Briefing</h2>
          <motion.p
            key={loadingStep}
            className="loading-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loadingStep}
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="loading-bar-track">
          <motion.div
            className="loading-bar-fill"
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <p className="loading-caption">
          Analyzing your store's top high-risk items
        </p>
      </motion.div>
    </div>
  );
}
