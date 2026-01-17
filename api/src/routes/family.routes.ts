import { Router } from 'express';
import { authenticateJWT, restrictToAdmin } from '../middleware/jwt.middleware';
import {
  createFamily,
  getFamilies,
  getFamily,
} from '../controllers/family.controller';
import { restrictTo, Role } from '../middleware/rbac.middleware';

const router = Router();

router.get('/', getFamilies);
router.get('/:id', authenticateJWT, restrictTo(Role.FAMILY_MEMBER), getFamily);
router.post('/', authenticateJWT, restrictTo(Role.ADMIN), createFamily);
export default router;
