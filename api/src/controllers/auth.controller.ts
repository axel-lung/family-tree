import { Request, Response } from 'express';
   import bcrypt from 'bcrypt';
   import jwt from 'jsonwebtoken';
   import { User } from '../models/user';

   export const register = async (req: Request, res: Response) => {
     const { email, password, role } = req.body;
     try {
       // Vérifier si l'utilisateur existe déjà
       const existingUser = await User.findOne({ where: { email } });
       if (existingUser) {
         return res.status(400).json({ error: 'Email already exists' });
       }

       const hashedPassword = await bcrypt.hash(password, 10);
       const user = await User.create({
         email,
         password: hashedPassword,
         role: role || 'guest',
       });

       const token = jwt.sign(
         { id: user.id, role: user.role },
         process.env.JWT_SECRET!,
         { expiresIn: '1d' }
       );

       res.status(201).json({ message: 'User registered', userId: user.id, token });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Registration failed' });
     }
   };

   export const login = async (req: Request, res: Response) => {
     const { email, password } = req.body;
     try {
       const user = await User.findOne({ where: { email } });
       if (!user || !(await bcrypt.compare(password, user.password))) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }

       const token = jwt.sign(
         { id: user.id, role: user.role },
         process.env.JWT_SECRET!,
         { expiresIn: '1d' }
       );

       res.json({ token });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Login failed' });
     }
   };