import mongoose, { Schema, Document } from 'mongoose';

export interface IPoem extends Document {
  keywords: string[];
  poem: string;
  modelUsed: string;
  createdAt: Date;
}

const PoemSchema = new Schema<IPoem>({
  keywords: { type: [String], required: true },
  poem: { type: String, required: true },
  modelUsed: { type: String, default: 'EmbeddingLSTM' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPoem>('Poem', PoemSchema);
