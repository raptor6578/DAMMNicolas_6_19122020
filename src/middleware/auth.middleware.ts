import jwt from 'jsonwebtoken';
import express from 'express';

// Middleware de vérification du token
export default function(req: express.Request, res: express.Response, next: express.NextFunction) {
    // Vérification de la présence d'un token dans le header
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            // Vérification de la validité du token
            // @ts-ignore
            const decodedToken: any = jwt.verify(token, process.env.SECRET_JWT);
            res.locals.userId = decodedToken._id;
            // Si le token ne correspond pas a l'ID utilisé on envoi une erreur.
            if (req.body.userId && req.body.userId !== res.locals.userId) {
                res.status(401);
                return res.json({message: `Vous n'êtes pas autorisé à utiliser cet ID.`});
            }
            // Si tout s'est bien déroulé on utilise le méthode next() pour continuer vers le controller.
            next();
        }
        // Une erreur s'est produite on l'envoie à l'utilisateur.
        catch (error) {
            res.status(401);
            return res.json({message: error.message});
        }
        // Aucun token n'est présent dans l'entête http on le signale à l'utilisateur.
    } else {
        res.status(401);
        return res.json({message: `Vous devez être identifié pour accéder à ce contenu.`});
    }
}
