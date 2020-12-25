import mongoose from 'mongoose';
import {IUser} from "./user.model";

export interface ISauce extends mongoose.Document {
    userId: string
    manufacturer: string
    description: string
    mainPepper: string
    image: string
    imageUrl: string
    heat: number
    likes: number
    dislikes: number
    usersLiked: mongoose.Types.DocumentArray<IUser>
    usersDisliked: mongoose.Types.DocumentArray<IUser>
    date: Date
}

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

export default mongoose.model<ISauce>('Sauce', sauceSchema);
