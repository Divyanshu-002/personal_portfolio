import { Router } from 'express';

const router = Router();

const RESPONSES = {
  default: [
    'Affirmative. Systems operational.',
    'Copy that, captain. Standing by.',
    'Neural link synchronized.',
    'Mission parameters updated.',
  ],
  greeting: [
    'Welcome back, operative.',
    'Greetings, captain. All systems green.',
    'Hello. Encryption protocols active.',
  ],
  help: [
    'I can guide you through missions, skills, and contact channels. Try voice commands!',
    'Navigate using the menu or say "show projects" to view classified missions.',
  ],
};

router.post('/', (req, res) => {
  const { message, context } = req.body;
  const msg = (message || '').toLowerCase();

  let pool = RESPONSES.default;
  if (msg.includes('hello') || msg.includes('hi')) pool = RESPONSES.greeting;
  if (msg.includes('help')) pool = RESPONSES.help;

  const response = pool[Math.floor(Math.random() * pool.length)];

  res.json({
    response,
    mood: context?.angry ? 'angry' : 'neutral',
    timestamp: new Date().toISOString(),
  });
});

router.get('/lines', (req, res) => {
  res.json({
    click: [
      "Hey don't touch me 😭",
      'Mission activated.',
      'Welcome back captain.',
      'Access granted.',
    ],
    idle: [
      'Systems nominal. Awaiting orders.',
      'Scanning perimeter... all clear.',
    ],
  });
});

export default router;
