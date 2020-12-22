"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SaucesController = /** @class */ (function () {
    function SaucesController() {
    }
    SaucesController.prototype.sauces = function (req, res) {
        res.send('ok');
    };
    return SaucesController;
}());
exports.default = new SaucesController();
