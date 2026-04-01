import cors from 'cors';
import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

// Apply all Middleware to the Express App
export function applyMiddleware(app: Express): void {
  // CORS
  app.use(cors({ origin: config.corsOrigins }));

  // JSON Body Parser
  app.use(express.json());

  // Request Logger
  app.use(requestLogger);
}

// Logs Incoming Requests
function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
}

// Async Error Wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// Global Error Handler
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('❌ Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
}
