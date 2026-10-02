/**
 * App.jsx — Nova Partner Lite Orchestrator
 *
 * Screen flow:
 *   auth → loading → review → syncing → complete
 *
 * State management is intentionally kept in this single component
 * for clarity. For a larger app, lift into a context or Zustand store.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Header } from './components/Header';
import { StoreAuth } from './components/StoreAuth';
import { LoadingScreen } from './components/LoadingScreen';
import { CardStack } from './components/CardStack';
import { SwipeHints } from './components/SwipeHints';
import { CompletionScreen } from './components/CompletionScreen';

import { useBriefing } from './hooks/useBriefing';
import { syncInventoryBatch } from './services/inventorySync';
import { STORE_CONFIG } from './services/mockData';

// Note: index.css is imported once in main.jsx — do not re-import here.

// Screen states
const SCREENS = {
  AUTH: 'auth',
  LOADING: 'loading',
  REVIEW: 'review',
  SYNCING: 'syncing',
  COMPLETE: 'complete',
};

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: 'easeIn' } },
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.AUTH);
  const [storeId, setStoreId] = useState(null);
  const [reviewItems, setReviewItems] = useState([]); // live stack during review
  const [actions, setActions] = useState([]);           // accumulated swipe decisions
  const [syncResult, setSyncResult] = useState(null);

  // Fetch briefing whenever storeId is set
  const { items: briefingItems, loading: briefingLoading, loadingStep, loadingProgress } = useBriefing(storeId);

  // ── Auth handler ─────────────────────────────────────────────────────────
  /**
   * Authenticates the user (store owner) with a PIN code.
   * On success, sets the store ID and transitions to the loading screen.
   * 
   * @param {string} code - The 4-digit PIN code entered by the user.
   */
  const handleAuth = useCallback((code) => {
    setStoreId(code);
    setScreen(SCREENS.LOADING);
  }, []);

  // ── Transition from loading → review once briefing is ready ──────────────
  React.useEffect(() => {
    if (screen === SCREENS.LOADING && !briefingLoading && briefingItems.length > 0) {
      setReviewItems(briefingItems);
      setActions([]);
      setTimeout(() => setScreen(SCREENS.REVIEW), 300); // slight pause for UX
    }
  }, [screen, briefingLoading, briefingItems]);

  // ── Handle each card swipe ───────────────────────────────────────────────
  // Use a ref to track accumulated actions without stale closure issues.
  // This avoids the anti-pattern of calling setReviewItems inside setActions.
  const actionsRef = React.useRef([]);

  /**
   * Handles a swipe action on an inventory item card.
   * Records the decision and removes the item from the review stack.
   * When the stack is empty, it triggers the batch sync.
   * 
   * @param {number|string} id - The unique ID of the inventory item.
   * @param {'in-stock'|'out-of-stock'} action - The swipe direction/action.
   */
  const handleSwipe = useCallback((id, action) => {
    const swipedItem = reviewItems.find((i) => i.id === id);
    if (!swipedItem) return;

    const newAction = {
      id: swipedItem.id,
      sku: swipedItem.sku,
      status: action,
      storeId,
    };

    // Update the ref immediately (synchronous, no stale closure risk)
    actionsRef.current = [...actionsRef.current, newAction];
    setActions(actionsRef.current);

    // Remove card from review stack
    setReviewItems((items) => {
      const remaining = items.filter((i) => i.id !== id);
      // When all cards are done, kick off sync with the ref value
      if (remaining.length === 0) {
        handleSync(actionsRef.current);
      }
      return remaining;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewItems, storeId]);

  // ── Batch sync ───────────────────────────────────────────────────────────
  /**
   * Synchronizes the accumulated swipe actions with the backend API.
   * Transitions to the syncing screen, performs the API call, and handles results.
   * 
   * @param {Array<{id: number|string, sku: string, status: string, storeId: string}>} finalActions - The batch of updates.
   */
  const handleSync = useCallback(async (finalActions) => {
    setScreen(SCREENS.SYNCING);
    try {
      const result = await syncInventoryBatch(finalActions);
      setSyncResult(result);
    } catch (err) {
      console.error('[App] Sync error:', err);
      // In production: show an error toast and allow retry
      setSyncResult({ success: false, synced: 0 });
    } finally {
      setScreen(SCREENS.COMPLETE);
    }
  }, []);

  // ── Reset (demo mode) ────────────────────────────────────────────────────
  /**
   * Resets the application state to allow running the demo again.
   * Clears all actions, items, and authentication state.
   */
  const handleReset = useCallback(() => {
    actionsRef.current = [];
    setActions([]);
    setReviewItems([]);
    setSyncResult(null);
    setStoreId(null);
    setScreen(SCREENS.AUTH);
  }, []);

  // ── Derived stats for CompletionScreen ──────────────────────────────────
  // Use syncResult.synced (set by handleSync) to avoid a flash of total=0.
  // Fall back to actions.length if syncResult isn't ready yet.
  const completionStats = {
    total: syncResult?.synced ?? actions.length,
    inStock: actions.filter((a) => a.status === 'in-stock').length,
    outOfStock: actions.filter((a) => a.status === 'out-of-stock').length,
    syncTimestamp: syncResult?.timestamp,
  };

  const doneCount = briefingItems.length - reviewItems.length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Header is shown on all screens except AUTH */}
      {screen !== SCREENS.AUTH && (
        <Header
          storeId={storeId}
          totalItems={briefingItems.length}
          doneItems={doneCount}
          showProgress={screen === SCREENS.REVIEW}
        />
      )}

      <main className="content">
        <AnimatePresence mode="wait">

          {/* ── Auth ── */}
          {screen === SCREENS.AUTH && (
            <motion.div key="auth" className="screen" {...PAGE_VARIANTS}>
              <StoreAuth onAuth={handleAuth} />
            </motion.div>
          )}

          {/* ── Loading / AI Analysis ── */}
          {screen === SCREENS.LOADING && (
            <motion.div key="loading" className="screen" {...PAGE_VARIANTS}>
              <LoadingScreen
                loadingStep={loadingStep}
                loadingProgress={loadingProgress}
              />
            </motion.div>
          )}

          {/* ── Review / Swipe ── */}
          {screen === SCREENS.REVIEW && (
            <motion.div key="review" className="screen review-screen" {...PAGE_VARIANTS}>
              <div className="mission-text">
                <h2>Smart Inventory Sync</h2>
                <p>
                  Review today's{' '}
                  <strong>{reviewItems.length}</strong> high-risk item
                  {reviewItems.length !== 1 ? 's' : ''}
                </p>
              </div>

              <CardStack items={reviewItems} onSwipe={handleSwipe} />

              <SwipeHints
                remaining={reviewItems.length}
                total={briefingItems.length}
              />
            </motion.div>
          )}

          {/* ── Syncing ── */}
          {screen === SCREENS.SYNCING && (
            <motion.div key="syncing" className="screen syncing-screen" {...PAGE_VARIANTS}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={48} className="syncing-icon" />
              </motion.div>
              <p className="syncing-text">Syncing to catalog…</p>
            </motion.div>
          )}

          {/* ── Complete ── */}
          {screen === SCREENS.COMPLETE && (
            <motion.div key="complete" className="screen" {...PAGE_VARIANTS}>
              <CompletionScreen
                stats={completionStats}
                storeName={STORE_CONFIG.name}
                onReset={handleReset}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
