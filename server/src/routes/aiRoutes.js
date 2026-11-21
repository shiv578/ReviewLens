import { Router } from 'express';
import { getStatus, testConnection, chat, generateReply, getModelQuota } from '../controllers/aiController.js';

const router = Router();

router.get('/status', getStatus);
router.get('/quota', getModelQuota);
router.get('/models', getModelQuota);
router.get('/test', testConnection);
router.post('/chat', chat);
router.post('/reply', generateReply);

export default router;
