"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware de vérification du token
function default_1(req, res, next) {
    // Vérification de la présence d'un token dans le header
    if (req.headers.authorization) {
        try {
            var token = req.headers.authorization.split(' ')[1];
            // Vérification de la validité du token
            // @ts-ignore
            var decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
            res.locals.userId = decodedToken._id;
            // Si le token ne correspond pas a l'ID utilisé on envoi une erreur.
            if (req.body.userId && req.body.userId !== res.locals.userId) {
                res.status(401);
                return res.json({ message: "Vous n'\u00EAtes pas autoris\u00E9 \u00E0 utiliser cet ID." });
            }
            // Si tout s'est bien déroulé on utilise le méthode next() pour continuer vers le controller.
            next();
        }
        // Une erreur s'est produite on l'envoie à l'utilisateur.
        catch (error) {
            res.status(401);
            return res.json({ message: error.message });
        }
        // Aucun token n'est présent dans l'entête http on le signale à l'utilisateur.
    }
    else {
        res.status(401);
        return res.json({ message: "Vous devez \u00EAtre identifi\u00E9 pour acc\u00E9der \u00E0 ce contenu." });
    }
}
exports.default = default_1;
