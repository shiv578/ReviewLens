import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import statsRoutes from './statsRoutes.js';
import reviewsRoutes from './reviewsRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/stats', statsRoutes);
router.use('/reviews', reviewsRoutes);

export default router;
