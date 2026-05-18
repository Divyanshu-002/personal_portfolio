import { Router } from 'express';
import { recordVisit, getAnalytics } from '../data/store.js';

const router = Router();

router.post('/visit', (req, res) => {
  const { page, referrer } = req.body;
  const visit = recordVisit({
    page: page || '/',
    referrer: referrer || 'direct',
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  res.json({ success: true, visitId: visit.id });
});

router.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production' && !req.query.key) {
    return res.status(403).json({ error: 'Analytics key required in production' });
  }
  res.json(getAnalytics());
});

export default router;
