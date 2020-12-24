"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var likeSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Like', likeSchema);
