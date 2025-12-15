// src/routes/category.routes.ts
import { Router } from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCategories);
router.post('/', auth, adminOnly, createCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

export default router;