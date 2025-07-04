import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Permission } from '../models/permission';
import { Person } from '../models/person';

export const checkPermission = (
  requiredPermission: 'create' | 'update' | 'delete' | 'read'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        role: string;
      };
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(401).json({ error: 'User not found' });

      if (user.role === 'admin') return next(); // Admins ont tous les droits

      if (user.role === 'guest' && requiredPermission !== 'read') {
        return res.status(403).json({ error: 'Guests can only read' });
      }

      if (requiredPermission === 'read') return next();

      const personId = req.params.id ? Number(req.params.id) : null;
      if (personId) {
        const permission = await Permission.findOne({
          where: { user_id: user.id, person_id: personId },
        });
        if (!permission || !permission[`can_${requiredPermission}`]) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      // Vérifier les données sensibles
      if (req.body.email || req.body.phone || req.body.residence) {
        const person = await Person.findByPk(personId);
        if (person && person.user_id !== user.id) {
          return res
            .status(403)
            .json({ error: 'Only the owner can modify sensitive data' });
        }
      }

      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
