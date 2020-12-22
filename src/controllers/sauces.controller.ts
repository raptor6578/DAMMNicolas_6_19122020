import express from "express";
import SauceModel from '../models/sauce.model';
import UserModel from '../models/user.model';
import mongoose from "mongoose";

class SaucesController {
    public getAllSauces(req: express.Request, res: express.Response) {
        res.send('Url en préparation.');
    }
    public addSauce(req: express.Request, res: express.Response) {
        if (!req.body.sauce || !req.file.filename) {
            res.status(400);
            return res.json({message: `Les données envoyées au serveur sont incorrectes.` });
        }
        const mongooseError = (error: mongoose.Error) => {
            res.status(400);
            res.json({message: error});
        };
       const formData = JSON.parse(req.body.sauce);
       UserModel.findById(formData.userId)
            .then((user: any) => {
                const sauce: any = new SauceModel();
                for (const key of Object.keys(formData)) {
                    sauce[key] = formData[key]
                }
                sauce.image = req.file.filename;
                user.sauces.push(sauce);
                sauce.save().then(() => {
                    user.save().then(() => {
                        res.status(201);
                        res.json({message: `Votre sauce a bien été enregistrée.`});
                    }).catch(mongooseError);
                }).catch(mongooseError);
            }).catch(mongooseError)
    }
}

export default new SaucesController();
