const express = require('express');
const bodyParser = require('body-parser');
const { serverHostname, serverPort } = require('./config');

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

// TODO: faire les routes et une gestion correcte des erreurs

// Mise en écoute du serveur de l'application
app.listen(serverPort, serverHostname, () => {
  console.log(`Server ready to handle requests on interface ${serverHostname} and port ${serverPort}.`);
});
