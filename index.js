import express from 'express';
import 'dotenv/config';
import { RestException } from './utils/RestException.js';
import { tasksRouter } from './routers/tasksRouter.js';
import { testConnection } from './mongo/mongoConnection.js';

// Création d'une application express
const app = express();
// Utilise un middleware pour utiliser la bib. qs pour décoder les querystring, permettant
// l'utilisation de syntaxes enrichies (json-like comme des tableaux etc.)
app.use(express.urlencoded());
// Utilise un middleware pour décoder automatiquement les corps de requêtes en JSON lorsque
// l'en-tête Content-type est application/json
app.use(express.json());

const listen = {
  hostname: process.env.EXPRESS_HOSTNAME,
  port: process.env.EXPRESS_PORT
}

/*
ROUTES
 */
// Ajout du routeur de gestion de tâche avec /api comme prefixe d'url
app.use('/api', tasksRouter);

//Pour toute route inconnu : levée d'une exception
app.use(function(req, res) {
  throw new RestException(`Methode ${req.method} et/ou chemin ${req.url} inconnu.`, 404);
});


/*
GESTION DES ERREURS
 */
app.use((err, req, rep, next) => {
  if (err){
    rep.status(err.status || 500);
    rep.json({
      error: err.message || 'Erreur inconnue.'
    });
  } else {
    rep.status(500).json({
      error: 'Erreur inconnue.'
    });
  }
})


// Mise en écoute du serveur de l'application après vérification que la Connection à la BD Mongo
// soit effective
testConnection().then(() => {
  app.listen(listen.port, listen.hostname, () => {
    console.log(`Server ready to handle requests on interface ${listen.hostname} and port ${listen.port}.`);
  });
}, (e) => {
  console.warn('Impossible de se connecter à la bd mongo: ' + e.message);
})
