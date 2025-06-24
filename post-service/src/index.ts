import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/post.routes';
import { jsonParseErrorHandler } from './middlewares/errorHandler.middleware';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', postRoutes);
app.use(jsonParseErrorHandler);

const PORT = process.env.PORT || 5001;

// DB connect
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Post service running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
