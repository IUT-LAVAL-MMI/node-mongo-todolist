const { ObjectId } = require('mongodb');
const { getDatabase } = require('./mongoConnection');
const { RestException } = require('../utils/RestException');

const COL_NAME = 'tasks';

/**
 * Récupération asynchrone de tâches, avec filtrage optionnel
 * @param  {[Boolean]} achieved  filtrage sur l'état d'achevement (true, false ou null/undefined)
 * @param  {[Boolean]} lateOnly  filtrage sur l'état de retard (true, false ou null/undefined)
 * @param  {[String]} keywords   filtrage sur le contenu du titre (string ou null/undefined)
 * @return {[Array<Task>]} liste de tâches
 * @throw RestException si une erreur d'accès à la base de données survient
 */
async function getTasks({ achieved, lateOnly, keywords }) {
  // Création du filtre de requête à partir des paramètres de filtrage optionnels
  const filter = {};

  // Filtrage sur l'étât de tâche achevée ou non
  if (achieved !== null) {
    if (achieved) { // Tâches uniquement terminées
      filter['achieved'] = { // achieved ne doit pas être null
        '$ne': null
      };
    } else { // T$aches uniquement en cours
      filter['achieved'] = null; // achieved doit être null
    }
  }
  // Filtrage sur l'état de retard d'une tâche (qu'elle soit achevée ou non)
  if (lateOnly === true) { // Tâche uniquement en cours
    filter['deadline'] = { $ne: null }; // deadline ne doit pas être null
    filter['$or'] = [{ // cas 1 : tâche non achevée et deadline < maintenant
      'achieved': null,
      'deadline': { $lt: new Date() },
    }, { // cas 2 : tâche achevée et deadline < achieved
      'achieved': { $ne: null },
      '$expr': { '$lt': ['$deadline', '$achieved'] }
    }];
  }
  // Filtrage textuel sur le titre de la tâche
  if (keywords !== null) {
    filter['$text'] = {
      '$search': keywords.join(' '),
      '$language': 'fr',
      '$caseSensitive': false,
      '$diacriticSensitive': false,
    };
  }
  const db = await getDatabase();
  return await db.collection(COL_NAME)
    .find(filter)
    .project({
      details: 0 // On ne récupère par le détail des tâche
    })
    .sort({
      creation: -1 // On tri par date de création descendante (de la plus récente à la plus ancienne)
    })
    .toArray();
}

/**
 * Récupèration asynchrone d'une tache d'après son identifiant
 * @param  {[String]} idTask Identifiant de la tâche
 * @return {[Task]}  La tâche
 * @throw RestException si une erreur d'accès à la base de données survient ou si aucune tâche ne
 * correspond à l'id
 */
async function getTask(idTask) {
  const db = await getDatabase();
  const task = await db.collection(COL_NAME).findOne({
    _id: new ObjectId(idTask)
  });
  // Si pas de tâche trouvée : erreur
  if (!task) {
    throw new RestException(`Aucune tâche correspondant à l'id ${idTask}.`, 404)
  }
  // Sinon on retourne la tâche
  return task;
}

/**
 * Création asynchrone d'une tâche
 * @param  {[String|Date]} creation date de création (String, Date ou null/undefined)
 * @param  {[String]} author auteur (String)
 * @param  {[String]} title  titre (String)
 * @param  {[String|Date]} deadline date limite (String, Date ou null/undefined)
 * @param  {[String]} details détails (String ou null/undefined)
 * @throw RestException si une précondition n'est pas respectée ou si une erreur d'accès à
 * la base de données survient
 */
async function createTask({
  creation,
  author,
  title,
  deadline,
  details,
}) {
  // Précondition : l'auteur doit être renseigné
  if (!author) {
    throw new RestException('Impossible de créer une tâche sans auteur.', 400);
  }
  // Précondition : le titre doit être renseigné
  if (!title) {
    throw new RestException('Impossible de créer une tâche sans titre.', 400);
  }
  // Si date de création fournie : conversion en Date de la chaine de car. le cas échéant. Sinon date du jour
  const creationDate = creation ? new Date(creation) : new Date();
  // Précondition : si la date de création a été fournie en string, sa conversion en Date doit être valide
  if (isNaN(creationDate)) {
    throw new RestException("La date de création fournie n'est pas valide.", 400);
  }
  // Si date de création limite : conversion en Date de la chaine de car. le cas échéant. Sinon null
  const deadlineDate = deadline ? new Date(deadline) : null;
  // Précondition : si la date limite a été fournie en string, sa conversion en Date doit être valide
  if (isNaN(deadlineDate)) {
    throw new RestException("La date limite fournie n'est pas valide.", 400);
  }
  // Création de la nouvelle tâche
  const newTask = {
    creation: creationDate,
    deadline: deadlineDate,
    achieved: null, // achieved est toujours null à la création
    author,
    title,
    details: details || null, // si détails == '', null ou undefined, on force la valeur null
  }
  const db = await getDatabase();
  // Insertion de la tâche en base de donnée et récupération de l'id du document nouvellement créé
  const { insertedId } = await db.collection(COL_NAME).insertOne(newTask);
  // Retourne la tâche nouvellement créée
  return await getTask(insertedId);
}

/**
 * Mise à jour partielle et asynchrone d'une tâche. Ne met à jour que les champs renseignés
 * @param  {[String]} idTask Identifiant de la tâche
 * @param  {[String|null|undefined]} author Auteur
 * @param  {[type]} title                  [description]
 * @param  {[type]} details                [description]
 * @param  {[type]} creation               [description]
 * @param  {[type]} deadline               [description]
 * @param  {[type]} achieved               [description]
 * @return {[type]}          [description]
 */
async function updateTask(idTask, { author, title, details, creation, deadline, achieved }) {
  // Précondition : l'id de la tâche doit être renseigné
  if (!idTask) {
    throw new RestException('Identifiant de tâche invalide.', 400);
  }
  // Précondition : auteur, titre ou date de création ne peuvent pas être null
  if (author === null) {
    throw new RestException("Impossible de supprimer l'auteur d'une tâche.", 400);
  }
  if (title === null) {
    throw new RestException("Impossible de supprimer le titre d'une tâche.", 400);
  }
  if (creation === null) {
    throw new RestException("Impossible de supprimer la date de création d'une tâche.", 400);
  }

  const updateRequest = {}; // Objet de requête de mise à jour
  // préparation de la mise à jour de l'auteur, titre et détail si fournis
  if (author) {
    updateRequest['author'] = author;
  }
  if (title) {
    updateRequest['title'] = title;
  }
  if (details || details === null) { // détails peut être null également
    updateRequest['details'] = details;
  }
  // préparation de la mise à jour de la date de création si fournie avec vérification de
  // sa validité (conversion en Date si String fournie)
  if (creation) {
    updateRequired = true;
    const creationDate = new Date(creation);
    if (isNaN(creationDate)) {
      throw new RestException('Date de création de la tâche invalide.', 400);
    }
    updateRequest['creation'] = creationDate;
  }
  // préparation de la mise à jour de la deadline si fournie avec vérification de
  // sa validité (conversion en Date si String fournie)
  if (deadline || deadline === null) {
    const deadlineDate = deadline !== null ? new Date(deadline) : null;
    if (isNaN(deadlineDate)) {
      throw new RestException('Deadline de la tâche invalide.', 400);
    }
    updateRequest['deadline'] = deadlineDate;
  }
  // préparation de la mise à jour de la achieved si fournie avec vérification de
  // sa validité (conversion en Date si String fournie)
  if (achieved || achieved === null) {
    const achievedDate = achieved !== null ? new Date(achieved) : null;
    if (isNaN(achievedDate)) {
      throw new RestException("Date d'âchevement de la tâche invalide.", 400);
    }
    updateRequest['achieved'] = achievedDate;
  }

  // Si aucun mise à jour n'est requise, on se contente de renvoyer la tâche contenue en base
  if (Object.getOwnPropertyNames(updateRequest).length === 0) {
    return getTask(idTask);
  }

  const db = await getDatabase();
  // Mise à jour au maximum d'un document dont l'id correspond et récupération du nombre de
  // documents correspondant à la requete (donc 1 ou 0)
  // On n'utilise pas updateCount (le nb de document effectivement mis à jour) car il
  // se peut que la requête de mise à jour ne contienne que des valeurs qui soient déja celle
  // du document (et donc celui-ci ne sera pas mis à jour)
  const { matchedCount } = await db.collection(COL_NAME).updateOne({ _id: new ObjectId(idTask) }, { '$set': updateRequest });
  // Vérification du nombre de document qui ont pu être mis à jour
  if (matchedCount === 0) {
    throw new RestException(`Tâche d'id ${idTask} inconnue.`, 404);
  }
  // Retourne la tâche mise à jour
  return getTask(idTask);
}

/**
 * Suppression asynchrone d'une tâche d'après son id
 * @param  {[String]} idTask Identifiant de la tâche
 * @return {[undefined]} ne retourne rien
 * @throw RestException si une erreur d'accès à la base de données survient ou si aucune tâche ne
 * correspond à l'id
 */
async function deleteTask(idTask) {
  // Précondition : l'id de la tâche doit être renseigné
  if (!idTask) {
    throw new RestException('Identifiant de tâche invalide.', 400);
  }
  const db = await getDatabase();
  // Demande de suppression d'un document dont l'id correspond et récupération du nombre de
  // documents supprimés (1 ou 0 donc)
  const { deletedCount } = await db.collection(COL_NAME).deleteOne({
    _id: new ObjectId(idTask)
  });
  // Vérification du nombre de documents supprimés
  if (deletedCount === 0) {
    throw new RestException(`Aucune tâche correspondant à l'id ${idTask}.`, 404);
  }
}

/**
 * Vérification de l'existence d'un document
 * @param  {[String]} idTask Identifiant de la tâche
 * @return {[undefined]} ne retourne rien
 */
async function checkTaskExists(idTask) {
  // Précondition : l'id de la tâche doit être renseigné
  if (!idTask) {
    throw new RestException('Identifiant de tâche invalide.', 400);
  }
  const db = await getDatabase();
  // On récupère le premier document venu, en ne projetant que l'id pour éviter de rappatrier
  // toute les données
  const task = await db.collection(COL_NAME)
    .findOne({ _id: new ObjectId(idTask) }, {
      projection: {
        _id: 1,
      }
    });
  if (task == null) {
    throw new RestError(`Tâche d'id ${idTask} inconnue.`, 'Ressource inconnue', 404);
  }
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  checkTaskExists
};
