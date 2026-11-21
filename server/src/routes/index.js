import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import statsRoutes from './statsRoutes.js';
import reviewsRoutes from './reviewsRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/stats', statsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/ai', aiRoutes);

export default router;
