import { Request, Response } from 'express';
import { Family } from '../models/family';

export const getFamilies = async (req: Request, res: Response) => {
  try {
    const families = await Family.findAll();
    res.json(families);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch families:' + error });
  }
};

export const getFamily = async (req: Request, res: Response) => {
  try {
    const family = await Family.findByPk(req.params.id);
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }
    const response = { ...family.get()};
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family:' + error  });
  }
};

export const createFamily = async (req: Request, res: Response) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create family:' + error  });
  }
};
