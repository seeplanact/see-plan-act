import express from 'express';
import { body } from 'express-validator';
import { submitContact, getContacts } from '../controllers/contact.controllers.js';

const router = express.Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
];

router.route('/').post(contactValidation, submitContact).get(getContacts);

export default router;