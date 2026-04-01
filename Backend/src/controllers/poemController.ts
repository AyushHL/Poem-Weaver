import { Request, Response } from 'express';
import Poem from '../models/Poem.js';
import { callModelService } from '../services/mlService.js';

// POST /api/poems/generate
export async function generatePoem(req: Request, res: Response): Promise<void> {
  const { keywords, model = 'EmbeddingLSTM', num_words = 150 } = req.body as {
    keywords: string[];
    model?: string;
    num_words?: number;
  };

  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    res.status(400).json({ error: 'Please provide at least one keyword' });
    return;
  }

  const data = await callModelService('/api/generate', { keywords, model, num_words });

  // Save to MongoDB
  Poem.create({
    keywords,
    poem: data.poem,
    modelUsed: data.model,
  }).catch(() => { });

  res.json({
    poem: data.poem,
    keywords: data.keywords,
    model: data.model,
  });
}

// GET /api/poems/recent
export async function getRecentPoems(_req: Request, res: Response): Promise<void> {
  try {
    const poems = await Poem.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json(poems);
  } catch {
    res.json([]);
  }
}

// GET /api/poems/model-status
export async function getModelStatus(_req: Request, res: Response): Promise<void> {
  try {
    const data = await callModelService('/api/health');
    res.json(data);
  } catch {
    res.json({ status: 'offline', rnn_loaded: false, lstm_loaded: false });
  }
}
