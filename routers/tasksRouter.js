const express = require('express');
const taskMgmt = require('../mongo/taskManagement');
const { stringToBoolean, enforceArray } = require('../utils/queryParamsUtils');

// Création d'un routeur pour gérer les routes de tâches
const router = express.Router();

// Recherche de tâches
router.get('/tasks', (req, rep, next) => {
  const achieved = stringToBoolean(req.query.achieved); //null, true ou false
  const lateOnly = stringToBoolean(req.query.lateOnly); //null, true ou false
  const keywords = enforceArray(req.query.keyword); //null, ou tableau de chaine

  taskMgmt.getTasks({ achieved, lateOnly, keywords })
    .then((tasks) => rep.json(tasks))
    .catch((error) => next(error));
});

// Création d'une tâche
router.post('/tasks', (req, rep, next) => {
  const taskToCreate = req.body;
  taskMgmt.createTask(taskToCreate)
    .then((task) => rep.json(task))
    .catch((error) => next(error));
})

// Vérification optimisée de l'existence d'une tâche par son id
// A TOUJOURS PLACER AVANT UN get SUR LA MÊME URL (Sinon un traitement par défaut pour head
// sera mis en place par express)
router.head('/tasks/:id', (req, res, next) => {
  const { id } = req.params;
  console.log('in head');
  taskMgmt.checkTaskExists(id)
    .then(() => res.end()) // Ne revoit aucune donnée avec code 200 si la tâche existe
    .catch((error) => next(error)); // 404 si la tache existe ou autre
});

// Récupération d'une tâche par son id
router.get('/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  taskMgmt.getTask(id)
    .then((task) => rep.json(task))
    .catch((error) => next(error));
});

// Mise à jour d'une tâche par son id
router.patch('/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  const update = req.body;
  taskMgmt.updateTask(id, update)
    .then((task) => rep.json(task))
    .catch((error) => next(error));
})

// Suppression d'une tâche par son id
router.delete('/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  taskMgmt.deleteTask(id)
    .then(() => rep.status(204).end()) // Ne revoit aucune donnée avec un code 204
    .catch((error) => next(error));
});

// Calcul de statistique : nombre de tâches par jour et par état d'achèvement
router.get('/tasks-stats/tasksByDay', (req, res, next) => {
  taskMgmt.countAchievedAndOnGoingTasksByDays()
    .then((stats) => res.json(stats))
    .catch((error) => next(error));
});

module.exports = {
  tasksRouter: router,
};
