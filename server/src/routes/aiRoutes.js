import { Router } from 'express';
import { getStatus, testConnection, chat, generateReply } from '../controllers/aiController.js';

const router = Router();

router.get('/status', getStatus);
router.get('/test', testConnection);
router.post('/chat', chat);
router.post('/reply', generateReply);

export default router;
