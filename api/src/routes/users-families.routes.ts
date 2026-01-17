import { Router } from 'express';
import {
  getFamiliessByUserId
} from '../controllers/users-families.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';
import { restrictTo, Role } from '../middleware/rbac.middleware';

const router = Router();

router.get('/:id', getFamiliessByUserId);

export default router;
 