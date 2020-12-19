import express from 'express';
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Le serveur vient de démarrer sur le port ${port}.`)
});

app.use(bodyParser.json());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

app.get('/', (req: express.Request, res: express.Response) => {
   res.send('hello world');
});
