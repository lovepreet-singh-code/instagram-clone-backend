import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './config/db';
import { connectRedis } from './config/redis';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use(errorMiddleware);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await connectMongoDB();
  await connectRedis();
});
