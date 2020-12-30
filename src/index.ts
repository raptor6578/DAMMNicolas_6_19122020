import express from 'express';
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.route';
import saucesRoutes from './routes/sauces.route';

dotenv.config();

if (process.env.EXPRESS_PORT &&
    process.env.MONGODB_HOST &&
    process.env.MONGODB_PORT &&
    process.env.MONGODB_DATABASE &&
    process.env.MONGODB_USER &&
    process.env.MONGODB_PASSWORD &&
    process.env.SECRET_JWT) {

   const config = {
      expressPort: process.env.EXPRESS_PORT,
      mongodbHost: process.env.MONGODB_HOST,
      mongodbPort: process.env.MONGODB_PORT,
      mongodbDatabase: process.env.MONGODB_DATABASE,
      mongodbUser: process.env.MONGODB_USER,
      mongodbPassword: process.env.MONGODB_PASSWORD
   };

   const app = express();

   app.listen(config.expressPort, () => {
      console.log(`Le serveur vient de démarrer sur le port ${config.expressPort}.`);
   });

   mongoose.connect(`mongodb://${config.mongodbUser}:${config.mongodbPassword}@${config.mongodbHost}:${config.mongodbPort}/${config.mongodbDatabase}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
       .then(() => console.log(`Connexion réussie à la base de données mongodb://${config.mongodbHost}:${config.mongodbPort}/${config.mongodbDatabase}`))
       .catch(() => console.log('Connexion à la base de données echouée !'));

   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({extended: true}));

   app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
   });

   app.use('/images', express.static('images'));
   app.use('/api/auth', authRoutes.router);
   app.use('/api/sauces', saucesRoutes.router);

} else {
   console.log(`Le fichier de configuration ".env" se trouvant à la racine du projet est incomplet, il doit contenir les champs suivants:
   EXPRESS_PORT, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_USER, MONGODB_PASSWORD, SECRET_JWT`);
}
