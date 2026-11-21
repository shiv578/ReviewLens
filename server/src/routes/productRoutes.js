import { Router } from 'express';
import { getProductsList, getProductDetail } from '../controllers/productController.js';

const router = Router();

router.get('/', getProductsList);
router.get('/:productName', getProductDetail);

export default router;
