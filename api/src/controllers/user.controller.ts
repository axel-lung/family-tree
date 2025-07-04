import { Request, Response } from 'express';
import { User } from '../models/user';
import { Permission } from '../models/permission';
import bcrypt from 'bcrypt';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.update(req.body);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const setPermission = async (req: Request, res: Response) => {
  try {
    const { user_id, person_id, can_create, can_update, can_delete } = req.body;
    const permission = await Permission.findOne({
      where: { user_id, person_id },
    });
    if (permission) {
      await permission.update({ can_create, can_update, can_delete });
      res.json({ message: 'Permission updated' });
    } else {
      await Permission.create({
        user_id,
        person_id,
        can_create,
        can_update,
        can_delete,
      });
      res.json({ message: 'Permission created' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to set permission' });
  }
};
