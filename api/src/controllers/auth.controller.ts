import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import axios from 'axios';

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

    res
      .status(201)
      .json({ message: 'User registered', userId: user.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, captchaToken } = req.body;
  const nodeEnvironment = process.env.NODE_ENV;

  if (!captchaToken && nodeEnvironment == 'production') {
    return res.status(420).json({ error: 'Captcha token is missing' });
  }

  try {
    // Vérification Turnstile
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY!;

    if (nodeEnvironment == 'production') {
      const ip = req.ip || req.connection.remoteAddress || '';
      const verificationResponse = await axios.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        new URLSearchParams({
          secret: turnstileSecret,
          response: captchaToken,
          remoteip: ip,
        })
      );

      if (!verificationResponse.data.success) {
        return res.status(403).json({ error: 'Captcha verification failed' });
      }
    }

    // Authentification utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d', issuer: process.env.FRONTEND_URL!, audience: 'users' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};
