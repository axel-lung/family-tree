import { Request, Response } from 'express';
import { Users_Families } from "../models/users-families";

export const getFamiliessByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id); // ou req.params.id si tu veux garder le nom

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const entries = await Users_Families.findAll({
      where: {
        user_id: userId
      }
    });

    if (entries.length === 0) {
      return res.status(400).json({ error: 'No families found for this user' });
    }

    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user family ' });
  }
};