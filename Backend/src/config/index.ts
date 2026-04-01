import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Poem-Generator',
  mlServerUrl: process.env.ML_SERVER_URL || 'http://127.0.0.1:5001',
  corsOrigins: process.env.CORS_ORIGINS || '*',
};
