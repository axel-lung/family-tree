import { Router } from 'express';
import { getPermissions } from '../controllers/permission.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';

const router = Router();

router.get('/:userId', authenticateJWT, getPermissions);

export default router;
