import express from 'express';
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.route';
import saucesRoutes from './routes/sauces.route';

dotenv.config();
const app = express();
const expressPort = process.env.EXPRESS_PORT || 3000;
const mongodbHost = process.env.MONGODB_HOST || 'localhost';
const mongodbPort = process.env.MONGODB_PORT || 27017;
const mongodbDatabase = process.env.MONGODB_DATABASE || 'piquante';

app.listen(expressPort, () => {
   console.log(`Le serveur vient de démarrer sur le port ${expressPort}.`);
});

mongoose.connect(`mongodb://${mongodbHost}:${mongodbPort}/${mongodbDatabase}`, {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
    .then(() => console.log(`Connexion réussie à la base de données mongodb://${mongodbHost}:${mongodbPort}/${mongodbDatabase}`))
    .catch(() => console.log('Connexion à la base de données echouée !'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

app.use('/api/auth', authRoutes.router);
app.use('/api/sauces', saucesRoutes.router);

