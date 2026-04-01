import express from 'express';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import { applyMiddleware, errorHandler } from './middleware/index.js';
import poemRoutes from './routes/poemRoutes.js';

const app = express();

// Middleware
applyMiddleware(app);

// Routes
app.use('/api/poems', poemRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

// Start
async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server Running on Port ${config.port}`);
    console.log(`🔗 http://localhost:${config.port}`);
  });
}

start();
