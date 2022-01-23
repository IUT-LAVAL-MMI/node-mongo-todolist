/*
JEU DE DONNEES DE TEST

Ajoute dans la collection Mongo TASK_COLLECTION_NAME un jeu de 5 tâches :
- non achevée, avec deadline, en retard, avec détails
- non achevée, avec deadline, pas en retard, avec détails
- non achevée, avec deadline, en retard, sans détail
- achevée, sans deadline, sans détail
- achevée, ave deadline, en retard, avec détail
 */

const TASK_COLLECTION_NAME = 'tasks';

const TITLES = [
  "Réparer vélo",
  "Préparer C.A. FDN",
  "Calibrer colorimétrie écran",
  "Poncer table",
  "Installer detecteur de fumée",
];

const DETAILS = [
  "pensée à prendre jeu de clé",
  "Ne pas oublier la QPC déposée",
  null,
  null,
  "Pensée à prendre des molly",
];

const AUTHORS = [
  "Rémi",
  "Rémi",
  "Sébastien",
  "Anne-Marie",
  "Sébastien"
];

const CREATIONS_DATES = [
  [-30, -5, -3],
  [-20, -6, -2],
  [-15, -3, -8],
  [-10, -5, -2],
  [-5, -2, -1],
];

const DEADLINE_DATES = [
  [-5, -2, -3],
  [10, 6, 2],
  [-8, -1, -2],
  null,
  [-2, -1, -1],
];

const ACHIEVED_DATES = [
  null,
  null,
  null,
  [-4, 0, 0],
  [-1, -1, -6],
]

const NOW = (() => {
  const now = new Date();
  now.setMilliseconds(0);
  now.setSeconds(0);
  return now;
})();

const MS_IN_MINUTE = 1000 * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

function createDate(addDays, addHours, addMinutes) {
  const delta = (addDays || 0) * MS_IN_DAY + (addHours || 0) * MS_IN_HOUR + (addMinutes || 0) * MS_IN_MINUTE;
  return new Date(NOW.getTime() + delta);
}

function checkDatatest() {
  const l = TITLES.length;
  if (l !== DETAILS.length || l !== AUTHORS.length || l !== CREATIONS_DATES.length
    || l !== DEADLINE_DATES.length || l !== ACHIEVED_DATES.length) {
    throw new Error('Wrong dataset');
  }
  if(CREATIONS_DATES.some((d) => !d || d.length !== 3)) {
    throw new Error('Wrong dataset');
  }
  if(DEADLINE_DATES.some((d) => d !== null && d.length !== 3)) {
    throw new Error('Wrong dataset');
  }
  if(ACHIEVED_DATES.some((d) => d !== null && d.length !== 3)) {
    throw new Error('Wrong dataset');
  }
  if (!NOW || !(NOW instanceof Date)) {
    throw new Error('Wrong dataset');
  }
  const test = createDate(1, 1, 1);
  if (!test || !(test instanceof Date)) {
    throw new Error('Wrong dataset');
  }
}

function createTask(taskIdx) {
  if (taskIdx < 0 || taskIdx >= TITLES.length){
    throw new Error('Wrong task id');
  }
  return {
    creation: createDate(...CREATIONS_DATES[taskIdx]),
    deadline: DEADLINE_DATES[taskIdx] === null ? null : createDate(...DEADLINE_DATES[taskIdx]),
    achieved: ACHIEVED_DATES[taskIdx] === null ? null : createDate(...ACHIEVED_DATES[taskIdx]),
    author: AUTHORS[taskIdx],
    title: TITLES[taskIdx],
    details: DETAILS[taskIdx],
  };
}

function main() {
  // Check dataset
  checkDatatest();
  // Create specific indexes
  db[TASK_COLLECTION_NAME].createIndex({ title: "text" });
  // Generate dateset in db
  db[TASK_COLLECTION_NAME].insertMany(Array(TITLES.length).fill(null).map((_, idx) => createTask(idx)));
}

main();
