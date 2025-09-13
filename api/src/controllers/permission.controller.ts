import { Request, Response } from 'express';
import { Permission } from '../models/permission';

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const permissions = await Permission.findAll({
      where: { user_id: userId },
    });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions:' + error  });
  }
};
