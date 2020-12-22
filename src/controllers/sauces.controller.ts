import express from "express";

class SaucesController {
    public sauces(req: express.Request, res: express.Response) {
        res.send('ok');
    }
}

export default new SaucesController();
