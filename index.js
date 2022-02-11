const express = require('express');
const bodyParser = require('body-parser');
const { serverHostname, serverPort } = require('./config');
const { testConnexion } = require('./mongo/mongoConnection');
const taskMgmt = require('./mongo/taskManagement');
const { stringToBoolean, enforceArray } = require('./utils/queryParamsUtils');

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
app.get('/api/tasks', (req, rep, next) => {
  const achieved = stringToBoolean(req.query.achieved); //null, true ou false
  const lateOnly = stringToBoolean(req.query.lateOnly); //null, true ou false
  const keywords = enforceArray(req.query.keyword); //null, ou tableau de chaine

  taskMgmt.getTasks({achieved, lateOnly, keywords}).then((tasks) => {
    rep.json(tasks);
  }, (e) => {
    next(e);
  })
});

app.post('/api/tasks', (req, rep, next) => {
  const taskToCreate = req.body;
  taskMgmt.createTask(taskToCreate).then((task) => {
    rep.json(task);
  }, (e) => {
    next(e);
  });
})

app.get('/api/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  taskMgmt.getTask(id).then((task) => {
    rep.json(task);
  }, (e) => {
    next(e);
  })
});

app.delete('/api/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  taskMgmt.deleteTask(id).then(() => {
    rep.status(204).end();
  }, (e) => {
    next(e);
  })
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


// Mise en écoute du serveur de l'application
testConnexion().then(() => {
  app.listen(serverPort, serverHostname, () => {
    console.log(`Server ready to handle requests on interface ${serverHostname} and port ${serverPort}.`);
  });
}, (e) => {
  console.warn('Impossible de se connecter à la bd mongo: ' + e.message);
})
