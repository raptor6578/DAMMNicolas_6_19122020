import express from "express";
import SauceModel from '../models/sauce.model';
import UserModel from '../models/user.model';
import LikeModel from '../models/like.model';
import mongoose from "mongoose";

class SaucesController {
    public getAllSauces(req: express.Request, res: express.Response) {
        SauceModel.find({}).lean()
            .then((data: any) => {
                for (const key of Object.keys(data)) {
                    data[key].imageUrl = `${req.protocol}://${req.get('host')}/images/${data[key].image}`;
                }
                res.json(data);
            })
    }
    public getSauceById(req: express.Request, res: express.Response) {
        SauceModel.findById(req.params.id).lean()
            .then((data: any) => {
                data.imageUrl = `${req.protocol}://${req.get('host')}/images/${data.image}`;
                res.json(data);
            })
            .catch((error: mongoose.Error) => {
                res.status(400);
                res.json({message: error});
            })
    }
    public addSauce(req: express.Request, res: express.Response) {
        if (!req.body.sauce || !req.file.filename) {
            res.status(400);
            return res.json({message: `Les données envoyées au serveur sont incorrectes.` });
        }
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
                    });
                });
            });
    }
    public like(req: express.Request, res: express.Response) {
        const likeSauce = (data: any, create: boolean, oldLike?: number) => {
            if (req.body.like === 1) {
                if (!create) {
                    data.usersDisliked.pull(req.body.userId);
                }
                data.likes++;
                data.usersLiked.push(req.body.userId);
            }
            if (req.body.like === -1) {
                if (!create) {
                    data.usersLiked.pull(req.body.userId);
                }
                data.dislikes++;
                data.usersDisliked.push(req.body.userId);
            }
            if (String(req.body.like) === '0') {
                if (oldLike === 1) {
                    data.likes--;
                    data.usersLiked.pull(req.body.userId);
                }
                if (oldLike === -1) {
                    data.dislikes--;
                    data.usersDisliked.pull(req.body.userId);
                }
            }
            data.save().then();
        };
        SauceModel.findById(req.params.id)
            .then((sauce: any) => {
                if (!sauce) {
                    res.status(404);
                    res.json({message: `La sauce n'éxiste pas.`});
                }
                LikeModel.findOne({userId: req.body.userId, sauceId: req.params.id})
                    .then((data: any) => {
                       if (!data) {
                           const like: any = new LikeModel();
                           like.userId = req.body.userId;
                           like.sauceId = req.params.id;
                           like.like = req.body.like;
                           like.save().then();
                           likeSauce(sauce, true);
                           res.status(201);
                           return res.json({message: `Vote effectué. (1)`});
                       }
                       if (data.like === req.body.like) {
                           res.status(400);
                           return res.json({message: `Vous avez déjà voté pour cette sauce.` });
                       }
                       if (String(req.body.like) === '0') {
                           return LikeModel.deleteOne({userId: req.body.userId, sauceId: req.params.id})
                               .then(() => {
                                   likeSauce(sauce, false, data.like);
                                   res.status(201);
                                   res.json({message: `Votre vote a été supprimé.`});
                               })
                               .catch((error: mongoose.Error) => {
                                   res.status(400);
                                   res.json({message: error});
                               });
                       }
                       if (req.body.like !== 1 && req.body.like !== -1) {
                           res.status(400);
                           return res.json({
                               message: `Si vous aimez vous devez utiliser 1 et si vous n'aimez pas pas -1.`
                           });
                       }
                       data.like = req.body.like;
                       data.save().then();
                       likeSauce(sauce, false);
                       res.status(201);
                       return res.json({message: `Vote effectué. (2)`});
                    })
                    .catch((error: mongoose.Error) => {
                        res.status(400);
                        res.json({message: error});
                    })
            });
    }
}

export default new SaucesController();
