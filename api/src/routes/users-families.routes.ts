import { Router } from 'express';
import {
  getFamiliesByUserId
} from '../controllers/users-families.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';
import { restrictTo, Role } from '../middleware/rbac.middleware';

const router = Router();

router.get('/:id', getFamiliesByUserId);

export default router;
 