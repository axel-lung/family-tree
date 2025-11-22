import { Router } from 'express';
import {
  getPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/person.controller';
import { authenticateJWT, restrictToAdmin } from '../middleware/jwt.middleware';
import { restrictTo, Role } from '../middleware/rbac.middleware';

const router = Router();

router.get('/family/:familyId', authenticateJWT, restrictTo(Role.FAMILY_MEMBER), getPersons);
router.get('/:id', authenticateJWT, restrictTo(Role.FAMILY_MEMBER), getPerson);
router.post('/', authenticateJWT, restrictTo(Role.FAMILY_MANAGER), createPerson);
router.put('/:id', authenticateJWT, restrictTo(Role.FAMILY_MANAGER), updatePerson);
router.delete('/:id', authenticateJWT, restrictTo(Role.ADMIN), deletePerson);

export default router;
