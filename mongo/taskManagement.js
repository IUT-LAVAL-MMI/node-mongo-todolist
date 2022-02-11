const { ObjectId } = require('mongodb');
const { getDatabase } = require('./mongoConnection');
const { RestException } = require('./RestException');

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

async function updateTask() {
  throw new Error('Not implemented');
}

/**
 * Suppression asynchrone d'une tâche d'après son id
 * @param  {[String]} idTask Identifiant de la tâche
 * @return {[undefined]} ne retourne rien
 * @throw RestException si une erreur d'accès à la base de données survient ou si aucune tâche ne
 * correspond à l'id
 */
async function deleteTask(idTask) {
  const db = await getDatabase();
  // Demande de suppression d'un document dont l'id correspond et récupération du nombre de
  // documents supprimés (1 ou 0 donc)
  const { deletedCount } = await db.collection(COL_NAME).deleteOne({
    _id: new ObjectId(idTask)
  });
  // Vérification du nombre document supprimé
  if (deletedCount === 0) {
    throw new RestException(`Aucune tâche correspondant à l'id ${idTask}.`, 404);
  }
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
