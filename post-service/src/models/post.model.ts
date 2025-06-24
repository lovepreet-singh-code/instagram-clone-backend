import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  caption: string;
  mediaUrl: string;
  userId: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
  }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
