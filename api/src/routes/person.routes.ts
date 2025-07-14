import { Router } from 'express';
import {
  getPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/person.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';
import { checkPermission } from '../middleware/rbac.middleware';

const router = Router();

router.get('/:familyId', authenticateJWT, checkPermission('read'), getPersons);
router.get('/:id', authenticateJWT, checkPermission('read'), getPerson);
router.post('/', authenticateJWT, checkPermission('create'), createPerson);
router.put('/:id', authenticateJWT, checkPermission('update'), updatePerson);
router.delete('/:id', authenticateJWT, checkPermission('delete'), deletePerson);

export default router;
