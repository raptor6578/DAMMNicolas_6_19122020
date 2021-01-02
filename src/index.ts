import express from 'express';
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';

import authRoutes from './routes/auth.route';
import saucesRoutes from './routes/sauces.route';

dotenv.config();

// Vérification du fichier de configuration
if (process.env.EXPRESS_PORT &&
    process.env.MONGODB_HOST &&
    process.env.MONGODB_PORT &&
    process.env.MONGODB_DATABASE &&
    process.env.MONGODB_USER &&
    process.env.MONGODB_PASSWORD &&
    process.env.SECRET_JWT &&
    process.env.ALLOW_ORIGIN) {

   const config = {
      expressPort: process.env.EXPRESS_PORT,
      mongodbHost: process.env.MONGODB_HOST,
      mongodbPort: process.env.MONGODB_PORT,
      mongodbDatabase: process.env.MONGODB_DATABASE,
      mongodbUser: process.env.MONGODB_USER,
      mongodbPassword: process.env.MONGODB_PASSWORD,
      allowOrigin: process.env.ALLOW_ORIGIN
   };

   // Démarrage du serveur express
   const app = express();
   app.listen(config.expressPort, () => {
      console.log(`Le serveur vient de démarrer sur le port ${config.expressPort}.`);
   });

   // Connexion à la base de données MongoDB
   mongoose.connect(`mongodb://${config.mongodbUser}:${config.mongodbPassword}@${config.mongodbHost}:${config.mongodbPort}/${config.mongodbDatabase}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
       .then(() => console.log(`Connexion réussie à la base de données mongodb://${config.mongodbHost}:${config.mongodbPort}/${config.mongodbDatabase}`))
       .catch(() => console.log('Connexion à la base de données echouée !'));

   // Middleware permettant d'utiliser des requetes dans le body
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({extended: true}));

   // Header http
   app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', config.allowOrigin);
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
   });

   // Nettoyage des requetes pour se protéger des attaques par injection
   app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      req.body = sanitize(req.body);
      req.query = sanitize(req.query);
      req.params = sanitize(req.params);
      next();
   });

   // Configuration des routes
   app.use('/images', express.static('images'));
   app.use('/api/auth', authRoutes.router);
   app.use('/api/sauces', saucesRoutes.router);

} else {
   // Fichier de configuration incomplet
   console.log(`Le fichier de configuration ".env" se trouvant à la racine du projet est incomplet, il doit contenir les champs suivants:
   EXPRESS_PORT, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE, MONGODB_USER, MONGODB_PASSWORD, SECRET_JWT`);
}
