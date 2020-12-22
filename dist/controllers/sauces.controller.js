"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sauce_model_1 = __importDefault(require("../models/sauce.model"));
var user_model_1 = __importDefault(require("../models/user.model"));
var SaucesController = /** @class */ (function () {
    function SaucesController() {
    }
    SaucesController.prototype.getAllSauces = function (req, res) {
        res.send('Url en préparation.');
    };
    SaucesController.prototype.addSauce = function (req, res) {
        if (!req.body.sauce || !req.file.filename) {
            res.status(400);
            return res.json({ message: "Les donn\u00E9es envoy\u00E9es au serveur sont incorrectes." });
        }
        var mongooseError = function (error) {
            res.status(400);
            res.json({ message: error });
        };
        var formData = JSON.parse(req.body.sauce);
        user_model_1.default.findById(formData.userId)
            .then(function (user) {
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
                }).catch(mongooseError);
            }).catch(mongooseError);
        }).catch(mongooseError);
    };
    return SaucesController;
}());
exports.default = new SaucesController();
