// Types
export interface GeneratedPoem {
  poem: string;
  keywords: string[];
  model: string;
}

export interface RecentPoem {
  _id: string;
  poem: string;
  keywords: string[];
  createdAt: string;
}

export interface ModelStatus {
  rnn: boolean;
  lstm: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  emoji: string;
  description: string;
}
