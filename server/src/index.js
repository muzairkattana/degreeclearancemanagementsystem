import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import clearanceRoutes from './routes/clearance.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARES
app.use(morgan('dev'));

// Permissive CORS for local & production deployment
app.use(cors({
  origin: (origin, callback) => {
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. HEALTH & ROOT CHECK
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h2 style="color: #00173b;">🚀 Degree Clearance Management API Server is Running!</h2>
      <p style="color: #64748b;">This port (5000) is the backend API.</p>
    </div>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI-Powered Degree Issuance & Clearance API is running',
    timestamp: new Date().toISOString(),
  });
});

// 3. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clearance', clearanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// 4. START SERVER (Only listen when running directly, not in serverless import)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export default app for Vercel Serverless Function handling
export default app;
