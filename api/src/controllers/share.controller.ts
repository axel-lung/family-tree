import { Request, Response } from 'express';
   import { redisClient } from '../config/redis.config';
   import { randomBytes } from 'crypto';
import { Person } from '../models/person';

   export const generateShareLink = async (req: Request, res: Response) => {
     try {
       const { person_id } = req.body;
       const token = randomBytes(16).toString('hex');
       const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Expire dans 24h
       await redisClient.setEx(`share:${token}`, 24 * 60 * 60, JSON.stringify({ person_id, expiresAt }));
       const link = `http://localhost:4200/share/${token}`;
       res.json({ link });
     } catch (error) {
       res.status(500).json({ error: 'Failed to generate share link' });
     }
   };

   export const accessSharedPerson = async (req: Request, res: Response) => {
     try {
       const token = req.params.token;
       const data = await redisClient.get(`share:${token}`);
       if (!data) return res.status(404).json({ error: 'Invalid or expired link' });
       const { person_id, expiresAt } = JSON.parse(data.toString());
       if (Date.now() > expiresAt) {
         await redisClient.del(`share:${token}`);
         return res.status(404).json({ error: 'Link expired' });
       }
       const person = await Person.findByPk(person_id, { attributes: { exclude: ['email', 'phone', 'residence'] } });
       if (!person || person.deleted) return res.status(404).json({ error: 'Person not found' });
       res.json(person);
     } catch (error) {
       res.status(500).json({ error: 'Failed to access shared person' });
     }
   };