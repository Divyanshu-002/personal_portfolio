import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import contactRoutes from './routes/contact.js';
import resumeRoutes from './routes/resume.js';
import themeRoutes from './routes/theme.js';
import analyticsRoutes from './routes/analytics.js';
import assistantRoutes from './routes/assistant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Try again later.' },
});
app.use('/api', limiter);

app.use('/api/contact', contactRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assistant', assistantRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', codename: 'DIV_OPS', name: 'Divyanshu', version: '7.7.7' });
});

const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) res.status(404).json({ error: 'Build client first: npm run build' });
  });
});

app.listen(PORT, () => {
  console.log(`[PHANTOM OS] Server online — port ${PORT}`);
});
