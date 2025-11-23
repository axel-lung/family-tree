import { Router } from 'express';
import {
  getUsers,
  updateUser,
  editUser,
  setPermission,
} from '../controllers/user.controller';
import { authenticateJWT, restrictToAdmin } from '../middleware/jwt.middleware';
import { restrictTo, Role } from '../middleware/rbac.middleware';

const router = Router();

router.get('/', authenticateJWT, restrictTo(Role.ADMIN), getUsers);
router.put('/:id', authenticateJWT, restrictTo(Role.ADMIN), updateUser);
router.patch('/:id', authenticateJWT, restrictTo(Role.ADMIN), editUser); 
router.post('/permissions', authenticateJWT, restrictTo(Role.ADMIN), setPermission);

export default router;
 