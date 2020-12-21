import express from 'express';
import authController from '../controllers/auth.controller';

class AuthRoute {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post('/signup', authController.signup);
        this.router.post('/login', authController.login);
    }
}

export default new AuthRoute();
