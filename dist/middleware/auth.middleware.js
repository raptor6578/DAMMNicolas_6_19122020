"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function default_1(req, res, next) {
    if (req.headers.authorization) {
        try {
            var token = req.headers.authorization.split(' ')[1];
            // @ts-ignore
            var decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
            res.locals.userId = decodedToken._id;
            if (req.body.userId && req.body.userId !== res.locals.userId) {
                res.status(401);
                return res.json({ message: "Vous n'\u00EAtes pas autoris\u00E9 \u00E0 utiliser cet ID." });
            }
            next();
        }
        catch (error) {
            res.status(401);
            return res.json({ message: error.message });
        }
    }
    else {
        res.status(401);
        return res.json({ message: "Vous devez \u00EAtre identifi\u00E9 pour acc\u00E9der \u00E0 ce contenu." });
    }
}
exports.default = default_1;
