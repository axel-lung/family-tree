import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ajoute ton e-mail dans .env
    pass: process.env.EMAIL_PASS, // Ajoute ton mot de passe d'application Gmail
  },
});