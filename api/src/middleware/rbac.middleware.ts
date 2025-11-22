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
        if (!permission || !permission?.[`can_${requiredPermission}`]) {
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
      res.status(401).json({ error: 'Invalid token:' + error  });
    }
  };
};

export enum Role {
  FAMILY_MEMBER = "family_member",
  FAMILY_MANAGER = "family_manager",
  ADMIN = "admin",
}

const ROLES_HIERARCHY: Record<Role, number> = {
  [Role.FAMILY_MEMBER]: 1,
  [Role.FAMILY_MANAGER]: 2,
  [Role.ADMIN]: 3,
};

export const restrictTo = (requiredRole: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
        issuer: process.env.FRONTEND_URL!,
        audience: 'users',
      }) as { id: number; role: string };

      // Vérifier si le rôle du JWT est valide
      const userRole = decoded.role as Role;
      if (!Object.values(Role).includes(userRole)) {
        return res.status(403).json({ error: 'Invalid role' });
      }

      // Comparer les niveaux hiérarchiques
      if (ROLES_HIERARCHY[userRole] < ROLES_HIERARCHY[requiredRole]) {
        return res.status(403).json({
          error: `Access denied: ${requiredRole.replace('_', ' ')} or higher role required`,
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: `Invalid token: ${error}` });
    }
  };
};