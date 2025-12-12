
import { Router } from 'express';
import { getProducts, getProductById, createProduct, deleteProduct } from '../controllers/product.controller';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById); // <--- add this line
router.post('/', auth, adminOnly, createProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

export default router;
