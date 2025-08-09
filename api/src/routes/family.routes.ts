import { Router } from 'express';
import { authenticateJWT, restrictToAdmin } from '../middleware/jwt.middleware';
import {
  createFamily,
  getFamilies,
  getFamily,
} from '../controllers/family.controller';

const router = Router();

router.get('/', authenticateJWT, getFamilies);
router.get('/:id', authenticateJWT, getFamily);
router.post('/', authenticateJWT, restrictToAdmin, createFamily);
export default router;
