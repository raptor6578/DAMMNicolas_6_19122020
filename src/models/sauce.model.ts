import mongoose from 'mongoose';
import LikeModel from './like.model';

const sauceSchema: mongoose.Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mainPepper: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    heat: {
        type: Number,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    usersLiked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    usersDisliked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
},{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

sauceSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'sauces',
});

export default mongoose.model('Sauce', sauceSchema);
