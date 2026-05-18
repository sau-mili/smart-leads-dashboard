// backend/src/routes/leadRoutes.ts
import { Router } from 'express';
import { createLead, getLeads, getLeadStats } from '../controllers/leadController';
import { protect } from '../middleware/authMiddleware'; // 1. Import the bouncer

const router = Router();

// 2. Add 'protect' before the controller functions

router.get('/stats', protect, getLeadStats); 

router.post('/', protect, createLead);
router.get('/', protect, getLeads);

export default router;