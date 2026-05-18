import { Router } from 'express';
import { saveContact, getContacts } from '../data/store.js';

const router = Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const entry = saveContact({ name: name.trim(), email: email.trim(), message: message.trim() });

  res.status(201).json({
    success: true,
    message: 'Transmission received. Divyanshu will respond soon.',
    id: entry.id,
  });
});

router.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(getContacts());
});

export default router;
