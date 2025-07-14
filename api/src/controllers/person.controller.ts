import { Request, Response } from 'express';
import { Person } from '../models/person';

export const getPersons = async (req: Request, res: Response) => {
  try {
    console.log(req);
    
    const persons = await Person.findAll({ where: { deleted: false, family_id: req.params.familyId } });
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
    const user = req.user as { id: number; role: string };
    const response = { ...person.get(), email: null, phone: null, residence: null };
    if (user.role === 'admin' || person.user_id === user.id) {
      response.email = person.email;
      response.phone = person.phone;
      response.residence = person.residence;
    }
    res.json(response);
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
