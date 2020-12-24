import mongoose from 'mongoose';

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

export default mongoose.model('Like', likeSchema);
