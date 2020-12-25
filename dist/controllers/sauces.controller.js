"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sauce_model_1 = __importDefault(require("../models/sauce.model"));
var user_model_1 = __importDefault(require("../models/user.model"));
var like_model_1 = __importDefault(require("../models/like.model"));
var fs_1 = __importDefault(require("fs"));
var SaucesController = /** @class */ (function () {
    function SaucesController() {
    }
    SaucesController.prototype.getAllSauces = function (req, res) {
        sauce_model_1.default.find({}).lean()
            .then(function (data) {
            for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                var key = _a[_i];
                data[key].imageUrl = req.protocol + "://" + req.get('host') + "/images/" + data[key].image;
            }
            res.json(data);
        })
            .catch(function (error) {
            res.status(400);
            res.json({ message: error });
        });
    };
    SaucesController.prototype.getSauceById = function (req, res) {
        sauce_model_1.default.findById(req.params.id).lean()
            .then(function (data) {
            data.imageUrl = req.protocol + "://" + req.get('host') + "/images/" + data.image;
            res.json(data);
        })
            .catch(function (error) {
            res.status(400);
            res.json({ message: error });
        });
    };
    SaucesController.prototype.addSauce = function (req, res) {
        if (!req.body.sauce || !req.file.filename) {
            res.status(400);
            return res.json({ message: "Les donn\u00E9es envoy\u00E9es au serveur sont incorrectes." });
        }
        var formData = JSON.parse(req.body.sauce);
        user_model_1.default.findById(formData.userId)
            .then(function (user) {
            if (user) {
                var sauce = new sauce_model_1.default();
                for (var _i = 0, _a = Object.keys(formData); _i < _a.length; _i++) {
                    var key = _a[_i];
                    sauce[key] = formData[key];
                }
                sauce.image = req.file.filename;
                user.sauces.push(sauce);
                sauce.save().then(function () {
                    user.save().then(function () {
                        res.status(201);
                        res.json({ message: "Votre sauce a bien \u00E9t\u00E9 enregistr\u00E9e." });
                    })
                        .catch(function (error) {
                        res.status(400);
                        res.json({ message: error });
                    });
                })
                    .catch(function (error) {
                    res.status(400);
                    res.json({ message: error });
                });
            }
        })
            .catch(function (error) {
            res.status(400);
            res.json({ message: error });
        });
    };
    SaucesController.prototype.deleteSauceById = function (req, res) {
        sauce_model_1.default.findOne({ _id: req.params.id, userId: res.locals.userId })
            .then(function (data) {
            if (!data) {
                res.status(404);
                return res.json({ message: "La sauce n'\u00E9xiste pas ou vous n'en \u00EAtes pas son autheur." });
            }
            fs_1.default.unlink("images/" + data.image, function () {
                sauce_model_1.default.deleteOne({ _id: req.params.id, userId: res.locals.userId })
                    .then(function () {
                    like_model_1.default.deleteMany({ sauceId: { $in: data._id } }).then();
                    like_model_1.default.deleteMany({ sauceId: { $in: data._id } }).then();
                    res.status(201);
                    return res.json({ message: "Votre sauce a bien \u00E9t\u00E9 supprim\u00E9e." });
                })
                    .catch(function (error) {
                    res.status(400);
                    res.json({ message: error });
                });
            });
        });
    };
    SaucesController.prototype.editSauceById = function (req, res) {
        sauce_model_1.default.findOne({ _id: req.params.id, userId: res.locals.userId })
            .then(function (sauce) {
            if (!sauce) {
                res.status(404);
                return res.json({ message: "La sauce n'\u00E9xiste pas ou vous n'en \u00EAtes pas son autheur." });
            }
            if (req.file) {
                var bodySauce = JSON.parse(req.body.sauce);
                for (var _i = 0, _a = Object.keys(bodySauce); _i < _a.length; _i++) {
                    var key = _a[_i];
                    sauce[key] = bodySauce[key];
                }
                fs_1.default.unlink("images/" + sauce.image, function () { return; });
                sauce.image = req.file.filename;
            }
            else {
                for (var _b = 0, _c = Object.keys(req.body); _b < _c.length; _b++) {
                    var key = _c[_b];
                    sauce[key] = req.body[key];
                }
            }
            sauce.save()
                .then(function () {
                res.status(200);
                return res.json({ message: 'Votre sauce a bien été modifié. (1)' });
            })
                .catch(function (error) {
                res.status(400);
                return res.json({ message: error });
            });
        })
            .catch(function (error) {
            res.status(400);
            res.json({ message: error });
        });
    };
    SaucesController.prototype.like = function (req, res) {
        var likeSauce = function (data, create, oldLike) {
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
        sauce_model_1.default.findById(req.params.id)
            .then(function (sauce) {
            if (!sauce) {
                res.status(404);
                return res.json({ message: "La sauce n'\u00E9xiste pas." });
            }
            like_model_1.default.findOne({ userId: req.body.userId, sauceId: req.params.id })
                .then(function (data) {
                if (!data) {
                    var like = new like_model_1.default();
                    like.userId = req.body.userId;
                    like.sauceId = req.params.id;
                    like.like = req.body.like;
                    like.save().then();
                    likeSauce(sauce, true);
                    res.status(201);
                    return res.json({ message: "Vote effectu\u00E9. (1)" });
                }
                if (data.like === req.body.like) {
                    res.status(400);
                    return res.json({ message: "Vous avez d\u00E9j\u00E0 vot\u00E9 pour cette sauce." });
                }
                if (String(req.body.like) === '0') {
                    return like_model_1.default.deleteOne({ userId: req.body.userId, sauceId: req.params.id })
                        .then(function () {
                        likeSauce(sauce, false, data.like);
                        res.status(201);
                        res.json({ message: "Votre vote a \u00E9t\u00E9 supprim\u00E9." });
                    })
                        .catch(function (error) {
                        res.status(400);
                        res.json({ message: error });
                    });
                }
                if (req.body.like !== 1 && req.body.like !== -1) {
                    res.status(400);
                    return res.json({
                        message: "Si vous aimez vous devez utiliser 1 et si vous n'aimez pas pas -1."
                    });
                }
                data.like = req.body.like;
                data.save().then();
                likeSauce(sauce, false);
                res.status(201);
                return res.json({ message: "Vote effectu\u00E9. (2)" });
            })
                .catch(function (error) {
                res.status(400);
                res.json({ message: error });
            });
        });
    };
    return SaucesController;
}());
exports.default = new SaucesController();
