import express from 'express';
import saucesController from '../controllers/sauces.controller';
import auth from '../middleware/auth.middleware';

class SaucesRoute {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get('/', auth, saucesController.sauces);
    }
}

export default new SaucesRoute();
