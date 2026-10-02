/**
 * useBriefing.js
 * Custom hook that fetches the daily AI briefing from Prediction API.
 * Simulates: GET /v1/briefing?storeId=842
 *
 * Returns: { items, loading, error, refetch }
 *
 * Phase 2 upgrade: replace mock delay + PREDICTED_ITEMS with
 * a real fetch to your FastAPI / Express Prediction API endpoint.
 */

import { useState, useEffect, useCallback } from 'react';
import { PREDICTED_ITEMS } from '../services/mockData';

const BRIEFING_STEPS = [
  'Analyzing sales velocity data...',
  'Scanning local demand signals...',
  'Computing stockout risk scores...',
  'Ranking items by priority...',
  'Preparing your briefing...',
];

/**
 * @param {string|null} storeId — null means don't fetch yet
 */
export function useBriefing(storeId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  const fetchBriefing = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Animate through analysis steps with realistic delays
      for (let i = 0; i < BRIEFING_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300));
      }

      // --- Phase 2: Replace simulation with real API call ---
      // const res = await fetch(`/v1/briefing?storeId=${id}`, {
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      // if (!res.ok) throw new Error('Failed to load briefing');
      // const data = await res.json();
      // setItems(data.items);
      // ------------------------------------------------------

      setItems(PREDICTED_ITEMS);
    } catch (err) {
      setError(err.message || 'Failed to load briefing. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchBriefing(storeId);
    }
  }, [storeId, fetchBriefing]);

  return {
    items,
    loading,
    loadingStep: BRIEFING_STEPS[currentStep],
    loadingProgress: loading ? ((currentStep + 1) / BRIEFING_STEPS.length) * 100 : 100,
    error,
    refetch: () => fetchBriefing(storeId),
  };
}
