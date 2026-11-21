import { Router } from 'express';
import { getRatingMismatches } from '../controllers/mismatchController.js';

const router = Router();

router.get('/', getRatingMismatches);

export default router;
