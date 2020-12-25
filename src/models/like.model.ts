import mongoose from 'mongoose';

export interface ILike extends mongoose.Document {
    userId: string
    sauceId: string
    like: number
}

const likeSchema: mongoose.Schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    sauceId: {
      type: String,
      required: true,
    },
    like: {
        type: Number,
        required: true,
    }
});

export default mongoose.model<ILike>('Like', likeSchema);
