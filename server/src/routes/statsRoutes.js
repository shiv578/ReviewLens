import { Router } from 'express';
import { getStats, getCostLog } from '../controllers/statsController.js';

const router = Router();

router.get('/', getStats);
router.get('/cost-log', getCostLog);

export default router;
