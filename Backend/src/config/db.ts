import mongoose from 'mongoose';
import { config } from '../config/index.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('⚠️  Server will Continue without Database');
  }
}
