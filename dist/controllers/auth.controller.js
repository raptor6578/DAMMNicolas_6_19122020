"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = __importDefault(require("../models/user.model"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var crypto_js_1 = __importDefault(require("crypto-js"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    // Méthode d'enregistrement d'un utilisateur
    AuthController.prototype.signup = function (req, res) {
        // Vérification de la présence d'une adresse email et d'un mot de passe
        if (!req.body.email || !req.body.password) {
            res.status(400);
            return res.json({ message: "Vous devez entrer une adresse email et un mot de passe." });
        }
        // Vérification que le mot de passe est minimum 8 caractères et moins de 30.
        if (req.body.password.length < 8 || req.body.password.length > 30) {
            res.status(400);
            return res.json({ message: "Votre mot de passe doit contenir entre 8 et 30 caract\u00E8res." });
        }
        // Vérification du format de l'adresse email
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            res.status(400);
            return res.json({ message: "Votre adresse email utilise un format invalide." });
        }
        // Cryptage de l'adresse email en SHA3
        var email = crypto_js_1.default.SHA3(req.body.email, { outputLength: 512 }).toString();
        user_model_1.default.findOne({ email: email })
            .then(function (result) {
            // Si l'adresse email existe déjà dans la base de données on envoi un message pour signaler que le compte existe déjà.
            if (result) {
                res.status(409);
                return res.json({ message: "Un compte utilisant l'adresse email que vous avez entr\u00E9 existe d\u00E9j\u00E0." });
            }
            // Création de l'utilisateur à partir du modèle "User"
            var user = new user_model_1.default();
            user.email = email;
            user.password = req.body.password;
            user.save()
                // L'inscription a bien été enregistrée.
                .then(function () {
                res.status(201);
                res.json({ message: "Votre compte a bien \u00E9t\u00E9 enregistr\u00E9." });
            })
                // En cas d'erreur on renvoi l'erreur serveur.
                .catch(function (error) {
                res.status(400);
                res.json({ message: error });
            });
            // Deuxième erreur serveur sur le recherche de l'email.
        }).catch(function (error) {
            res.status(500);
            res.json({ message: error });
        });
    };
    // Méthode d'identification
    AuthController.prototype.login = function (req, res) {
        // Vérification de la présence d'une adresse email et d'un mot de passe.
        if (!req.body.email || !req.body.password) {
            res.status(400);
            return res.json({ message: "Vous devez entrer une adresse email et un mot de passe." });
        }
        // Encodage de l'adresse email entrée afin de la comparer avec celle en base de données.
        var email = crypto_js_1.default.SHA3(req.body.email, { outputLength: 512 }).toString();
        user_model_1.default.findOne({ email: email })
            .then(function (user) {
            // Si l'utilisateur est introuvable on envoi un message d'erreur.
            if (!user) {
                res.status(401);
                return res.json({ message: "Adresse email introuvable." });
            }
            // Vérification du mot de passe
            user.comparePassword(req.body.password)
                .then(function (isMatch) {
                // Si le mot de passe est incorrect on envoi un message d'erreur
                if (!isMatch) {
                    res.status(401);
                    return res.json({ message: 'Mot de passe incorrect.' });
                }
                // Création d'un token qu'on envoi en format JSON avec l'ID de l'utilisateur.
                // @ts-ignore
                var token = jsonwebtoken_1.default.sign(user.toJSON(), process.env.SECRET_JWT, { expiresIn: '24h' });
                res.status(200);
                res.json({ userId: user._id, token: token });
            })
                // Un problème serveur lié au mot de passe est survenu, on l'envoi a l'utilisateur
                .catch(function (error) {
                res.status(500);
                res.json({ message: error });
            });
            // Erreur serveur lié a la recherche de l'email en base de données, pareil on l'envoi a l'utilisateur
        }).catch(function (error) {
            res.status(500);
            res.json({ message: error });
        });
    };
    return AuthController;
}());
exports.default = new AuthController();
