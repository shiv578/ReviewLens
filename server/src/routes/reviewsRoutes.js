import { Router } from 'express';
import { getRecentReviews, getReviews, uploadReviewsBatch } from '../controllers/reviewsController.js';

const router = Router();

router.get('/recent', getRecentReviews);
router.get('/', getReviews);
router.post('/batch', uploadReviewsBatch);

export default router;
