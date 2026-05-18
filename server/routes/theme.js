import { Router } from 'express';
import { saveThemePreference, getThemeStats } from '../data/store.js';

const router = Router();
const VALID_THEMES = ['heist', 'pirate', 'cyberpunk'];

router.post('/', (req, res) => {
  const { theme } = req.body;
  if (!VALID_THEMES.includes(theme)) {
    return res.status(400).json({ error: 'Invalid theme', valid: VALID_THEMES });
  }
  saveThemePreference(theme);
  res.json({ success: true, theme });
});

router.get('/stats', (req, res) => {
  res.json(getThemeStats());
});

export default router;
