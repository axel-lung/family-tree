import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';
import { loginValidation, registerValidation } from '../middleware/validation.middleware';
import { formatValidationErrors } from '../utils/formatValidationErrors'; 

const router = Router();

// Limiteur pour éviter le brute force
const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: 'Trop de tentatives, réessayez plus tard.',
});

router.post('/register', postLimiter, registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: formatValidationErrors(errors) });
  }
  register(req, res);
});

router.post('/login', postLimiter, loginValidation, (req, res) => {
  login(req, res);
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
