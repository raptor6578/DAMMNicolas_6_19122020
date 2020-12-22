import express from "express";
import UserModel from '../models/user.model';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

class AuthController {
    public signup(req: express.Request, res: express.Response) {
        if (!req.body.email || !req.body.password) {
            res.status(400);
            return res.json({message: `Vous devez entrer une adresse email et un mot de passe.` });
        }
        if (req.body.password.length < 8 || req.body.password.length > 30) {
            res.status(400);
            return res.json({message: `Votre mot de passe doit contenir entre 8 et 30 caractères.` });
        }
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            res.status(400);
            return res.json({message: `Votre adresse email utilise un format invalide.` });
        }
        UserModel.findOne({email: req.body.email})
            .then((result) => {
                if (result) {
                    res.status(409);
                    return res.json({message: `Un compte utilisant l'adresse email que vous avez entré existe déjà.`});
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
            }).catch((error: mongoose.Error) => {
                res.status(500);
                res.json({message: error});
        });
    }
    public login(req: express.Request, res: express.Response) {
        if (!req.body.email || !req.body.password) {
            res.status(400);
            return res.json({message: `Vous devez entrer une adresse email et un mot de passe.` });
        }
        UserModel.findOne({email: req.body.email})
            .then((user: any) => {
                if (!user) {
                    res.status(401);
                    return res.json({message: `Adresse email introuvable.`});
                }
                user.comparePassword(req.body.password, (err: any, isMatch: any) => {
                    if (isMatch && !err) {
                        // @ts-ignore
                        const token = jwt.sign(user.toJSON(), process.env.SECRET_JWT, {expiresIn: '24h'});
                        res.status(200);
                        res.json({userId: user._id, token});
                    } else {
                        res.status(401);
                        res.json({message: 'Mot de passe incorrect.'});
                    }
                });
            }).catch((error: mongoose.Error) => {
                res.status(500);
                res.json({message: error});
        });
    }
}

export default new AuthController();
