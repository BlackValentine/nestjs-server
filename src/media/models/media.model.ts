import { Schema, Document } from 'mongoose';

const MediaSchema = new Schema(
  {
    name: String,
    fileName: String,
    mimeType: String,
    size: Number,
    key: String,
    create_at: { type: Date, default: Date.now },
  },
  {
    collection: 'media__medias',
  },
);

export { MediaSchema };

export interface Media extends Document {
  name: string;
  fileName: string;
  mimeType: string;
  size: number;
  key: string;
  created_at: Date;
}
