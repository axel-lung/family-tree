import { Request, Response } from 'express';
import { Relationship } from '../models/relationship';

export const getRelationships = async (req: Request, res: Response) => {
  try {
    const relationships = await Relationship.findAll();
    res.json(relationships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch relationships:' + error  });
  }
};

export const createRelationship = async (req: Request, res: Response) => {
  const { person1_id, person2_id, relationship_type } = req.body;
  try {
    // Vérifie si la relation existe déjà
    const existing = await Relationship.findOne({
      where: {
        person1_id,
        person2_id,
        relationship_type,
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Relationship already exists' });
    }

    const relationship = await Relationship.create(req.body);

    res.status(201).json(relationship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create relationship:' + error  });
  }
};
