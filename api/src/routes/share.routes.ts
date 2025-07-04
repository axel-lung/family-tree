import { Router } from 'express';
import {
  generateShareLink,
  accessSharedPerson,
} from '../controllers/share.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';

const router = Router();

router.post('/', authenticateJWT, generateShareLink);
router.get('/:token', accessSharedPerson);

export default router;
