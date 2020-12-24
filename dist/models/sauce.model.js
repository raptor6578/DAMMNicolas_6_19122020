"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var sauceSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    usersDisliked: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Like"
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
}, {
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
exports.default = mongoose_1.default.model('Sauce', sauceSchema);
