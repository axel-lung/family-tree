import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import axios from 'axios';
import { PasswordResetToken } from '../models/password-reset-token';
import { transporter } from '../config/email';

export const register = async (req: Request, res: Response) => {
  const { email, password, role, captchaToken, first_name, last_name } =
    req.body;

  if (!captchaToken) {
    return res.status(420).json({ error: 'Captcha token is missing' });
  }

  try {
    // Vérification Turnstile
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY!;

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

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email,
      password: hashedPassword,
      role: role || 'guest',
      approved: 0,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
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

  if (!captchaToken) {
    return res.status(420).json({ error: 'Captcha token is missing' });
  }

  try {
    // Vérification Turnstile
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY!;

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

    // Authentification utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json('Utilisateur ou mot de passe incorrect');
    }

    if (!user.approved) {
      return res.status(401).json({ error: 'Account not approved' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d', issuer: process.env.FRONTEND_URL!, audience: 'users' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Générer un token de réinitialisation
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
    const expiresAt = new Date(Date.now() + 900000); // Expire dans 15 minutes

    // Stocker le token
    await PasswordResetToken.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    // Envoyer l'e-mail
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

    await transporter.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetUrl}">${resetUrl}</a>. Ce lien expire dans 15 minutes.`,
    });

    res.json({ message: 'E-mail de réinitialisation envoyé' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    const resetTokens = await PasswordResetToken.findAll({
      where: { user_id: decoded.userId },
      order: [['created_at', 'DESC']],
    });    

    const resetToken = resetTokens[0]; // le plus récent    

    if (!resetToken || resetToken.expires_at < new Date()) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: decoded.userId } });

    // Supprimer le token utilisé
    await resetToken.destroy();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
  }
};