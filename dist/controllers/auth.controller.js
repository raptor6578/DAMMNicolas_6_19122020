"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = __importDefault(require("../models/user.model"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.signup = function (req, res) {
        if (!req.body.email || !req.body.password) {
            res.status(400);
            res.json({ message: "Vous devez entrer une adresse email et un mot de passe." });
            return;
        }
        if (req.body.password.length < 8 || req.body.password.length > 30) {
            res.status(400);
            res.json({ message: "Votre mot de passe doit contenir entre 8 et 30 caract\u00E8res." });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            res.status(400);
            res.json({ message: "Votre adresse email utilise un format invalide." });
            return;
        }
        user_model_1.default.findOne({ email: req.body.email })
            .then(function (result) {
            if (result) {
                res.status(409);
                res.json({ message: "Un compte utilisant l'adresse email que vous avez entr\u00E9 existe d\u00E9j\u00E0." });
                return;
            }
            var user = new user_model_1.default();
            user.email = req.body.email;
            user.password = req.body.password;
            user.save()
                .then(function () {
                res.status(201);
                res.json({ message: "Votre compte a bien \u00E9t\u00E9 enregistr\u00E9." });
            })
                .catch(function (error) {
                res.status(400);
                res.json({ message: error });
            });
        }).catch(function (error) {
            res.status(400);
            res.json({ message: error });
        });
    };
    AuthController.prototype.login = function (req, res) {
        if (!req.body.email || !req.body.password) {
            res.status(400);
            res.json({ message: "Vous devez entrer une adresse email et un mot de passe." });
            return;
        }
        user_model_1.default.findOne({ email: req.body.email })
            .then(function (user) {
            if (!user) {
                res.status(401);
                res.json({ message: "Adresse email introuvable." });
                return;
            }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // @ts-ignore
                    var token = jsonwebtoken_1.default.sign(user.toJSON(), process.env.SECRET_JWT);
                    res.status(200);
                    res.json({ userId: user._id, token: token });
                }
                else {
                    res.status(401);
                    res.json({ message: 'Mot de passe incorrect.' });
                }
            });
        }).catch(function (error) {
            res.status(400);
            res.json({ message: error });
        });
    };
    return AuthController;
}());
exports.default = new AuthController();
