import { Router } from 'express';
import {
  getRelationships,
  createRelationship,
} from '../controllers/relationship.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';
import { restrictTo, Role } from '../middleware/rbac.middleware';

const router = Router();

router.get('/', authenticateJWT, restrictTo(Role.FAMILY_MEMBER), getRelationships);
router.post('/', authenticateJWT, restrictTo(Role.FAMILY_MANAGER), createRelationship);

export default router;
