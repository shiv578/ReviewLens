import { Router } from 'express';
import multer from 'multer';
import {
  getRecentReviews,
  getReviews,
  uploadReviewsBatch,
  generateSuggestedReply,
} from '../controllers/reviewsController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

router.get('/recent', getRecentReviews);
router.get('/', getReviews);
router.post('/batch', uploadReviewsBatch);
router.post('/upload', upload.single('file'), uploadReviewsBatch);
router.post('/:id/reply', generateSuggestedReply);

export default router;
