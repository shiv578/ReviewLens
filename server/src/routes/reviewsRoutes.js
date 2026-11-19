import { Router } from 'express';
import { getRecentReviews, getReviews } from '../controllers/reviewsController.js';

const router = Router();

router.get('/recent', getRecentReviews);
router.get('/', getReviews);

export default router;
