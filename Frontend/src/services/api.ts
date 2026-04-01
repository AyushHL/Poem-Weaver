import { API_BASE } from '../config/index';
import type { GeneratedPoem, RecentPoem, ModelStatus } from '../types/index';

// Generate a Poem
export async function generatePoemAPI(keywords: string[], model: string, numWords: number = 150): Promise<GeneratedPoem> {
  const res = await fetch(`${API_BASE}/poems/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords, model, num_words: numWords }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Generation failed');
  }

  return res.json();
}

// Fetch Recent Poems
export async function fetchRecentPoems(): Promise<RecentPoem[]> {
  try {
    const res = await fetch(`${API_BASE}/poems/recent`);
    return res.json();
  } catch {
    return [];
  }
}

// Fetch Model Status
export async function fetchModelStatus(): Promise<ModelStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/poems/model-status`);
    const data = await res.json();
    return { rnn: data.rnn_loaded, lstm: data.lstm_loaded };
  } catch {
    return null;
  }
}
