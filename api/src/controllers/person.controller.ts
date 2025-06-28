import { Request, Response } from 'express';
import { Person } from '../models/person';
import { authenticateJWT } from '../middleware/jwt.middleware';

export const getPersons = async (req: Request, res: Response) => {
  try {
    const persons = await Person.findAll({ where: { deleted: false } });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persons' });
  }
};

export const getPerson = async (req: Request, res: Response) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person || person.deleted) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person' });
  }
};

export const createPerson = async (req: Request, res: Response) => {
  try {
    const person = await Person.create(req.body);
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create person' });
  }
};

export const updatePerson = async (req: Request, res: Response) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person || person.deleted) {
      return res.status(404).json({ error: 'Person not found' });
    }
    await person.update(req.body);
    res.json({ message: 'Person updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update person' });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person || person.deleted) {
      return res.status(404).json({ error: 'Person not found' });
    }
    await person.update({ deleted: true });
    res.json({ message: 'Person deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete person' });
  }
};
