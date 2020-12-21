import express from "express";
import UserModel from '../models/user.model';
import mongoose from 'mongoose';

class AuthController {
    public signup(req: express.Request, res: express.Response) {
        if (!req.body.email || !req.body.password) {
            res.status(400);
            res.json({message: `Vous devez entrer une adresse email et un mot de passe.` });
            return;
        }
        if (req.body.password.length >= 8 && req.body.password.length <= 30) {
            res.status(400);
            res.json({message: `Votre mot de passe doit contenir entre 8 et 30 caractères.` });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            res.status(400);
            res.json({message: `Votre adresse email utilise un format invalide.` });
            return;
        }
        UserModel.findOne({email: req.body.email})
            .then((result) => {
                if (result) {
                    res.status(409);
                    res.json({message: `Un compte utilisant l'adresse email que vous avez entré existe déjà.`});
                    return;
                }
                const user: any  = new UserModel();
                user.email = req.body.email;
                user.password = req.body.password;
                user.save()
                    .then(() => {
                        res.status(201);
                        res.json({message: `Votre compte a bien été enregistré.`});
                    })
                    .catch((error: mongoose.Error) => {
                        res.status(400);
                        res.json({message: error});
                    })
            }).catch((error) => {
                res.status(400);
                res.json({message: error});
        });
    }
    public login(req: express.Request, res: express.Response) {
        res.send('ok');
    }
}

export default new AuthController();
