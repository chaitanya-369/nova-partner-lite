/**
 * inventorySync.js
 * Service layer for: PATCH /v1/inventory/batch
 * In Phase 2, replace the simulated fetch with a real API call.
 * 
 * Architecture contract:
 *   Input:  Array of { id, sku, status: 'in-stock' | 'out-of-stock' }
 *   Output: { success, synced, timestamp, failedSkus? }
 */

const API_BASE = '/v1'; // Replace with real base URL in production

/**
 * Simulated batch sync — mirrors what a real PATCH /v1/inventory/batch would do.
 * Introduces realistic network latency (800–1400ms) and logs the payload.
 *
 * @param {Array<{id, sku, status}>} updates
 * @returns {Promise<{success: boolean, synced: number, timestamp: string}>}
 */
export async function syncInventoryBatch(updates) {
  // Simulate realistic network round-trip
  const delay = 800 + Math.random() * 600;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // --- Phase 2: Replace simulation below with real fetch ---
  // const response = await fetch(`${API_BASE}/inventory/batch`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
  //   body: JSON.stringify({ storeId: updates[0]?.storeId, updates }),
  // });
  // if (!response.ok) throw new Error(`Sync failed: ${response.statusText}`);
  // return response.json();
  // ---------------------------------------------------------

  console.log(`[InventorySync] Simulated PATCH ${API_BASE}/inventory/batch`, updates);

  return {
    success: true,
    synced: updates.length,
    timestamp: new Date().toISOString(),
    endpoint: `${API_BASE}/inventory/batch`,
  };
}

/**
 * Single-item override: PUT /v1/inventory/{sku}
 * Used for manual corrections outside the swipe flow.
 *
 * @param {string} sku
 * @param {boolean} inStock
 * @returns {Promise<{success: boolean}>}
 */
export async function updateSingleItem(sku, inStock) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  console.log(`[InventorySync] Simulated PUT ${API_BASE}/inventory/${sku}`, { inStock });

  return { success: true, sku, inStock };
}
