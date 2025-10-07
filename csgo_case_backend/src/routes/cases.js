import express from 'express';
import { listCases, getCaseById, openCaseForUser } from '../services/caseService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC_INTERFACE
router.get('/', async (_req, res, next) => {
  /** Returns list of all cases */
  try {
    const data = await listCases();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// PUBLIC_INTERFACE
router.get('/:id', async (req, res, next) => {
  /** Returns case details including drops */
  try {
    const data = await getCaseById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Case not found' });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// PUBLIC_INTERFACE
router.post('/:id/open', requireAuth, async (req, res, next) => {
  /** Opens a case for the authenticated user and returns the result */
  try {
    const userId = req.session.user.id;
    const result = await openCaseForUser(userId, req.params.id);
    // update session balance for convenience
    req.session.user = { ...req.session.user, balance: result.newBalance };
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
