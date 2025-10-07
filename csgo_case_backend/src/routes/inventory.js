import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getInventoryForUser, sellInventoryItem, withdrawInventoryItem } from '../services/inventoryService.js';

const router = express.Router();

// PUBLIC_INTERFACE
router.get('/', requireAuth, async (req, res, next) => {
  /** Returns current user's inventory list */
  try {
    const items = await getInventoryForUser(req.session.user.id);
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// PUBLIC_INTERFACE
router.post('/:inventoryId/sell', requireAuth, async (req, res, next) => {
  /** Optional: Sell an inventory item and credit balance */
  try {
    const result = await sellInventoryItem(req.session.user.id, req.params.inventoryId);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// PUBLIC_INTERFACE
router.post('/:inventoryId/withdraw', requireAuth, async (req, res, next) => {
  /** Optional: Stub for withdrawing an item (would integrate with Steam trades) */
  try {
    const result = await withdrawInventoryItem(req.session.user.id, req.params.inventoryId);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
