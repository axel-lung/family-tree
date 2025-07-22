import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      issuer: process.env.FRONTEND_URL!,
      audience: 'users',
    }) as { id: number; role: string };
    req.user = decoded; // TypeScript reconnaît maintenant req.user grâce à la déclaration
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const restrictToAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      issuer: process.env.FRONTEND_URL!,
      audience: 'users',
    }) as { id: number; role: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
