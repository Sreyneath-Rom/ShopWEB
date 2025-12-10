import { Router } from 'express';
import { register, login, setup2FA, verify2FA } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/2fa/setup', auth, setup2FA);
router.post('/2fa/verify', auth, verify2FA);

export default router;