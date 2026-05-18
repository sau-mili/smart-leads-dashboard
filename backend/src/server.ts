import { webcrypto } from 'node:crypto';
import authRoutes from './routes/authRoutes';
// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// 1. IMPORT YOUR NEW ROUTES HERE
import leadRoutes from './routes/leadRoutes';

dotenv.config();
connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

// 2. TELL EXPRESS TO USE THEM HERE
app.use('/api/leads', leadRoutes);

app.use('/api/auth', authRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running beautifully!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});