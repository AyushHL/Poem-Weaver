import type { AIModel } from '../types/index';

// API
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Available AI Models
export const AI_MODELS: AIModel[] = [
  { id: 'EmbeddingLSTM', name: 'LSTM', emoji: '🧠', description: 'Embedding + LSTM — Fluid & Expressive' },
  { id: 'OneHotRNN', name: 'RNN', emoji: '⚡', description: 'One-Hot + RNN — Creative & Varied' },
];
