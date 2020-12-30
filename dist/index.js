"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv = __importStar(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
var auth_route_1 = __importDefault(require("./routes/auth.route"));
var sauces_route_1 = __importDefault(require("./routes/sauces.route"));
dotenv.config();
if (process.env.EXPRESS_PORT &&
    process.env.MONGODB_HOST &&
    process.env.MONGODB_PORT &&
    process.env.MONGODB_DATABASE &&
    process.env.MONGODB_USER &&
    process.env.MONGODB_PASSWORD &&
    process.env.SECRET_JWT) {
    var config_1 = {
        expressPort: process.env.EXPRESS_PORT,
        mongodbHost: process.env.MONGODB_HOST,
        mongodbPort: process.env.MONGODB_PORT,
        mongodbDatabase: process.env.MONGODB_DATABASE,
        mongodbUser: process.env.MONGODB_USER,
        mongodbPassword: process.env.MONGODB_PASSWORD
    };
    var app = express_1.default();
    app.listen(config_1.expressPort, function () {
        console.log("Le serveur vient de d\u00E9marrer sur le port " + config_1.expressPort + ".");
    });
    mongoose_1.default.connect("mongodb://" + config_1.mongodbUser + ":" + config_1.mongodbPassword + "@" + config_1.mongodbHost + ":" + config_1.mongodbPort + "/" + config_1.mongodbDatabase, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(function () { return console.log("Connexion r\u00E9ussie \u00E0 la base de donn\u00E9es mongodb://" + config_1.mongodbHost + ":" + config_1.mongodbPort + "/" + config_1.mongodbDatabase); })
        .catch(function () { return console.log('Connexion à la base de données echouée !'); });
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });
    app.use('/images', express_1.default.static('images'));
    app.use('/api/auth', auth_route_1.default.router);
    app.use('/api/sauces', sauces_route_1.default.router);
}
else {
    console.log("Le fichier de configuration \".env\" se trouvant \u00E0 la racine du projet est incomplet, il doit contenir les champs suivants:\n   EXPRESS_PORT, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_USER, MONGODB_PASSWORD, SECRET_JWT");
}
