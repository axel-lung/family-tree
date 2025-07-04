import { Router } from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
  setPermission,
} from '../controllers/user.controller';
import { authenticateJWT, restrictToAdmin } from '../middleware/jwt.middleware';

const router = Router();

router.get('/', authenticateJWT, restrictToAdmin, getUsers);
router.put('/:id', authenticateJWT, restrictToAdmin, updateUser);
router.delete('/:id', authenticateJWT, restrictToAdmin, deleteUser);
router.post('/permissions', authenticateJWT, restrictToAdmin, setPermission);

export default router;
