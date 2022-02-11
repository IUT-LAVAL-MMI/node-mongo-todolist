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
    .then((task) => ep.json(task))
    .catch((error) => next(error));
})

// Récupération d'une tâche par son id
router.get('/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  taskMgmt.getTask(id)
    .then((task) => rep.json(task))
    .catch((error) => next(error));
});

// Suppression d'une tâche par son id
router.delete('/tasks/:id', (req, rep, next) => {
  const { id } = req.params;
  taskMgmt.deleteTask(id)
    .then(() => rep.status(204).end())
    .catch((error) => next(error));
});

module.exports = {
  tasksRouter: router,
};
