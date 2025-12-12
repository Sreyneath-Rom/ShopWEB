import { Router } from 'express';
import { getUserOrders } from '../controllers/order.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', auth, getUserOrders);

export default router;