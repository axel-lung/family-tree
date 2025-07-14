import { Request, Response } from 'express';
import { Family } from '../models/family';

export const getFamilies = async (req: Request, res: Response) => {
  try {
    const families = await Family.findAll();
    res.json(families);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch families' });
  }
};

export const getFamily = async (req: Request, res: Response) => {
  try {
    const family = await Family.findByPk(req.params.id);
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }
    // const user = req.user as { id: number; role: string };
    const response = { ...family.get()};
    // if (user.role === 'admin' || family.user_id === user.id) {
    //   response.email = family.email;
    //   response.phone = family.phone;
    //   response.residence = family.residence;
    // }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family' });
  }
};

export const createFamily = async (req: Request, res: Response) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create family' });
  }
};
