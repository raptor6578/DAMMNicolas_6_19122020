import express from "express";
import UserModel from '../models/user.model';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

class AuthController {
    // Méthode d'enregistrement d'un utilisateur
    public signup(req: express.Request, res: express.Response) {
        // Vérification de la présence d'une adresse email et d'un mot de passe
        if (!req.body.email || !req.body.password) {
            res.status(400);
            return res.json({message: `Vous devez entrer une adresse email et un mot de passe.` });
        }
        // Vérification que le mot de passe est minimum 8 caractères et moins de 30.
        if (req.body.password.length < 8 || req.body.password.length > 30) {
            res.status(400);
            return res.json({message: `Votre mot de passe doit contenir entre 8 et 30 caractères.` });
        }
        // Vérification du format de l'adresse email
        if (!/\S+@\S+\.\S+/.test(req.body.email)) {
            res.status(400);
            return res.json({message: `Votre adresse email utilise un format invalide.` });
        }
        // Cryptage de l'adresse email en SHA3
        const email = CryptoJS.SHA3(req.body.email, { outputLength: 512 }).toString();
        UserModel.findOne({email})
            .then((result) => {
                // Si l'adresse email existe déjà dans la base de données on envoi un message pour signaler que le compte existe déjà.
                if (result) {
                    res.status(409);
                    return res.json({message: `Un compte utilisant l'adresse email que vous avez entré existe déjà.`});
                }
                // Création de l'utilisateur à partir du modèle "User"
                const user  = new UserModel();
                user.email = email;
                user.password = req.body.password;
                user.save()
                // L'inscription a bien été enregistrée.
                    .then(() => {
                        res.status(201);
                        res.json({message: `Votre compte a bien été enregistré.`});
                    })
                    // En cas d'erreur on renvoi l'erreur serveur.
                    .catch((error: mongoose.Error) => {
                        res.status(400);
                        res.json({message: error});
                    })
                // Deuxième erreur serveur sur le recherche de l'email.
            }).catch((error: mongoose.Error) => {
                res.status(500);
                res.json({message: error});
        });
    }
    // Méthode d'identification
    public login(req: express.Request, res: express.Response) {
        // Vérification de la présence d'une adresse email et d'un mot de passe.
        if (!req.body.email || !req.body.password) {
            res.status(400);
            return res.json({message: `Vous devez entrer une adresse email et un mot de passe.` });
        }
        // Encodage de l'adresse email entrée afin de la comparer avec celle en base de données.
        const email = CryptoJS.SHA3(req.body.email, { outputLength: 512 }).toString();
        UserModel.findOne({email})
            .then((user) => {
                // Si l'utilisateur est introuvable on envoi un message d'erreur.
                if (!user) {
                    res.status(401);
                    return res.json({message: `Adresse email introuvable.`});
                }
                // Vérification du mot de passe
                user.comparePassword(req.body.password)
                    .then((isMatch) => {
                        // Si le mot de passe est incorrect on envoi un message d'erreur
                        if (!isMatch) {
                            res.status(401);
                            return res.json({message: 'Mot de passe incorrect.'});
                        }
                        // Création d'un token qu'on envoi en format JSON avec l'ID de l'utilisateur.
                        // @ts-ignore
                        const token = jwt.sign(user.toJSON(), process.env.SECRET_JWT, {expiresIn: '24h'});
                        res.status(200);
                        res.json({userId: user._id, token});
                    })
                    // Un problème serveur lié au mot de passe est survenu, on l'envoi a l'utilisateur
                    .catch(error => {
                        res.status(500);
                        res.json({message: error});
                    })
                // Erreur serveur lié a la recherche de l'email en base de données, pareil on l'envoi a l'utilisateur
            }).catch((error: mongoose.Error) => {
                res.status(500);
                res.json({message: error});
        });
    }
}

export default new AuthController();
