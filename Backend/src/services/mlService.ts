import { config } from '../config/index.js';

// Proxy a Request to the ML Model Service
export async function callModelService(endpoint: string, body?: object): Promise<any> {
  const url = `${config.mlServerUrl}${endpoint}`;

  const options: RequestInit = body
    ? {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
    : { method: 'GET' };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Model service error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
