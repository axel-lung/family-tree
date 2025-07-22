import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 tentatives max par IP
  message: 'Trop de tentatives de connexion, réessayez plus tard.',
});

router.post('/register', register);
router.post('/login', login);
router.post('/api/login', loginLimiter, login);

export default router;