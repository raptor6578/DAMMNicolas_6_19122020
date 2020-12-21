"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Auth = /** @class */ (function () {
    function Auth() {
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    Auth.prototype.initializeRoutes = function () {
        this.router.post('/signup', function (req, res) {
            res.send('ok');
        });
        this.router.post('/login', function (req, res) {
            res.send('ok');
        });
    };
    return Auth;
}());
exports.default = new Auth();
