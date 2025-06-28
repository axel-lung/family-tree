import { Router } from 'express';
import {
  getPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/person.controller';
import { authenticateJWT } from '../middleware/jwt.middleware';

const router = Router();

router.get('/', authenticateJWT, getPersons);
router.get('/:id', authenticateJWT, getPerson);
router.post('/', authenticateJWT, createPerson);
router.put('/:id', authenticateJWT, updatePerson);
router.delete('/:id', authenticateJWT, deletePerson);

export default router;
