import { Request, Response } from 'express';
import { Relationship } from '../models/relationship';

export const getRelationships = async (req: Request, res: Response) => {
  try {
    const relationships = await Relationship.findAll();
    res.json(relationships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch relationships' });
  }
};

export const createRelationship = async (req: Request, res: Response) => {
  try {
    const relationship = await Relationship.create(req.body);
    res.status(201).json(relationship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create relationship' });
  }
};
