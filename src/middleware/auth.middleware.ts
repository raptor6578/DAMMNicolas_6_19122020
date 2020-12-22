import jwt from 'jsonwebtoken';
import express from 'express';

export default function(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            // @ts-ignore
            const decodedToken: any = jwt.verify(token, process.env.SECRET_JWT);
            const userId = decodedToken._id;
            if (req.body.userId && req.body.userId !== userId) {
                res.status(401);
                return res.json({message: `Vous n'êtes pas autorisé à utiliser cet ID.`});
            }
            next();
        }
        catch (error) {
            res.status(401);
            return res.json({message: error.message});
        }
    } else {
        res.status(401);
        return res.json({message: `Vous devez être identifié pour accéder à ce contenu.`});
    }
}
