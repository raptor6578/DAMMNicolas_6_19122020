import express from 'express';
import saucesController from '../controllers/sauces.controller';
import auth from '../middleware/auth.middleware';
import multer from '../middleware/multer.middleware';

class SaucesRoute {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get('/', auth, saucesController.getAllSauces);
        this.router.post('/', auth, multer, saucesController.addSauce);
        this.router.get('/:id', auth, saucesController.getSauceById);
        this.router.post('/:id/like', auth, saucesController.like);
    }
}

export default new SaucesRoute();
