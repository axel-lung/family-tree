import { Router } from 'express';
import {
  getRelationships,
  createRelationship,
} from '../controllers/relationship.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';

const router = Router();

router.get('/', authenticateJWT, getRelationships);
router.post('/', authenticateJWT, createRelationship);

export default router;
