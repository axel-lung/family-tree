import { body } from 'express-validator';

export const loginValidation = [
  body('email')
    .isEmail().withMessage("L'adresse email est invalide.")
    .isLength({ max: 100 }).withMessage("L'adresse email est trop longue (max 100 caractères).")
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ max: 32 }).withMessage('Le mot de passe est trop long (max 32 caractères).'),
];


export const registerValidation = [
  body('email')
    .isEmail().withMessage("L'adresse email est invalide.")
    .isLength({ max: 100 }).withMessage("L'adresse email est trop longue (max 100 caractères).")
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8, max: 32 }).withMessage('Le mot de passe doit contenir entre 8 et 32 caractères.')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule.')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[^A-Za-z0-9]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial.'),

  body('first_name')
    .trim()
    .notEmpty().withMessage('Le prénom est requis.')
    .isLength({ max: 50 }).withMessage('Le prénom est trop long (max 50 caractères).')
    .escape(),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Le nom est requis.')
    .isLength({ max: 50 }).withMessage('Le nom est trop long (max 50 caractères).')
    .escape(),

  body('role')
    .optional()
    .isIn(['guest', 'user', 'admin']).withMessage("Le rôle n'est pas valide."),
];