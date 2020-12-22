"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sauces_controller_1 = __importDefault(require("../controllers/sauces.controller"));
var auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
var multer_middleware_1 = __importDefault(require("../middleware/multer.middleware"));
var SaucesRoute = /** @class */ (function () {
    function SaucesRoute() {
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    SaucesRoute.prototype.initializeRoutes = function () {
        this.router.get('/', auth_middleware_1.default, sauces_controller_1.default.getAllSauces);
        this.router.post('/', auth_middleware_1.default, multer_middleware_1.default, sauces_controller_1.default.addSauce);
    };
    return SaucesRoute;
}());
exports.default = new SaucesRoute();
