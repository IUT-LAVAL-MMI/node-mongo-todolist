const express = require('express');
const bodyParser = require('body-parser');
const { serverHostname, serverPort } = require('./config');
const { testConnexion } = require('./mongo/mongoConnection');
const { tasksRouter } = require('./routers/tasksRouter');

// Création d'une application express
const app = express();
// Utilise un middleware pour utiliser la bib. qs pour décoder les querystring, permettant
// l'utilisation de syntaxes enrichies (json-like comme des tableaux etc.)
app.use(bodyParser.urlencoded({
  extended: true
}));
// Utilise un middleware pour décoder automatiquement les corps de requêtes en JSON lorsque
// l'en-tête Content-type est application/json
app.use(bodyParser.json());

/*
ROUTES
 */
// Ajout du routeur de gestion de tâche avec /api comme prefixe d'url
app.use('/api', tasksRouter);

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


// Mise en écoute du serveur de l'application après vérification que la connexion à la BD Mongo
// soit effective
testConnexion().then(() => {
  app.listen(serverPort, serverHostname, () => {
    console.log(`Server ready to handle requests on interface ${serverHostname} and port ${serverPort}.`);
  });
}, (e) => {
  console.warn('Impossible de se connecter à la bd mongo: ' + e.message);
})
