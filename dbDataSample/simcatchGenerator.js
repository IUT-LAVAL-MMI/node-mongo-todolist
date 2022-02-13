const COLLECTION_NAME = 'simcatching';
const FIRSTNAMES = ['Keny', 'Aniès', 'Sandra', 'Neefa', 'Yérim', 'Azédine'];
const LASTNAMES = ['Laston', 'Puccino', 'Cotentin', 'Diarra', 'De suza'];
const AGES = [15, 17, 19, 20, 24, 25, 30, 46];
const PHONE_MODELS = ['Samsung_S4', 'Samsung_S5', 'Galaxy_note_29', 'Nokia_3310', 'Iphone_5',
  'Iphone_5', 'Iphone_7', 'Iphone_5'
];
const EXTRA_PHONES_INFOS = ["Wifi Enabled", "Unlocked", "Claimed Stolen"];
const LOCATIONS = [
  { type: "Point", coordinates: [48.643969, -1.870400] }, //Roellinger
  { type: "Point", coordinates: [47.410767, 0.774519] }, //Hautes roches
  { type: "Point", coordinates: [43.607456, 1.434504] }, //Sarran
  { type: "Point", coordinates: [44.917763, 4.885654] }, // Pic
  { type: "Point", coordinates: [50.471282, 1.754462] }, // la grenouillere
  { type: "Point", coordinates: [46.922406, 0.919372] }, // petit pressigny
  { type: "Point", coordinates: [47.366180, 0.718475] }, // roche leroy
  { type: "Point", coordinates: [47.387141, 0.690406] }, //petit pressigny
];
const TIMESTAMP_RANGE = [
  Date.parse('2020-01-01T00:00:00.000+00:00'),
  Date.parse('2020-04-01T00:00:00.000+00:00'),
]

/*
Générateur de fonction "d'écrasement"
 */
function createMash() {
  let n = 0xefc8249d; // noyau initial

  let mash = function(data) {
    data = String(data); // on force la représentation du param entre String, quel qu'il soit
    for (let i = 0; i < data.length; i++) { // pour chaque caractère de la chaine
      n += data.charCodeAt(i); // on rajoute à n le code caractère (number)
      let h = 0.02519603282416938 * n; // calcul pour faire bouger les bits de poids faible ?
      n = h >>> 0; // n reprend uniquement la représentation des 32 derniers bit
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}

/*
Générateur de nombre aléatoire sous forme d'un float 32bits
 */
function NumberGenerator(seed) {
  let mash = createMash();
  // Initialisation de l'état
  // Apply the seeding algorithm from Baagoe.
  this.c = 1;
  this.s0 = mash(' ');
  this.s1 = mash(' ');
  this.s2 = mash(' ');
  this.s0 -= mash(seed);
  if (this.s0 < 0) {
    this.s0 += 1;
  }
  this.s1 -= mash(seed);
  if (this.s1 < 0) {
    this.s1 += 1;
  }
  this.s2 -= mash(seed);
  if (this.s2 < 0) {
    this.s2 += 1;
  }
}

// Méthode de passage au nombre aléatoire suivant
NumberGenerator.prototype.next = function() {
  let t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
  this.s0 = this.s1;
  this.s1 = this.s2;
  this.c = t | 0; //this.c = partie entière de t
  this.s2 = t - this.c; // this.s2 = partie décimale de t
  return this.s2;
}

// Pour la récupération/sauvegarde de l'état interne du générateur
Object.defineProperty(NumberGenerator.prototype, 'state', {
  get: function state() {
    return {
      c: this.c,
      s0: this.s0,
      s1: this.s1,
      s2: this.s2,
    }
  },
  set: function state(st) {
    if (typeof(state) !== 'object') {
      throw new Error('Wrong state');
    }
    this.c = st.c || 0;
    this.s0 = st.s0 || 0;
    this.s1 = st.s1 || 0;
    this.s2 = st.s2 || 0;
  }
});

/*
Générateur de nombres aléatoire
 */
function Prng(seed, options) {
  this.numberGenerator = new NumberGenerator(seed);
  if (options && options.state) {
    this.numberGenerator.state = options.state;
  }
}

//32 bits of randomness in a float
Prng.prototype.quick = function() {
  return this.numberGenerator.next();
}

//32 bit (signed) integer
Prng.prototype.int32 = function() {
  return (this.numberGenerator.next() * 0x100000000) | 0;
}

//56 bits of randomness
Prng.prototype.double = function() {
  return this.numberGenerator.next() + (this.numberGenerator.next() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
}

const MY_PRNG = new Prng('asdhfeklaS');

function generateControlledRandom() {
  return MY_PRNG.quick();
}

function getRandomIntExclusive(min, max) {
  return Math.floor(generateControlledRandom() * (max - min) + min);
}

function getRandomValueFromArray(array) {
  const idx = Math.floor(generateControlledRandom() * array.length);
  return array[idx];
}

function getRandomDate(minDate, maxDate) {
  const timeMs = getRandomIntExclusive(minDate, maxDate);
  return new Date(timeMs);
}

function getRandomPercent() {
  return generateControlledRandom() * 100.0;
}

function getRandomBoolean() {
  return generateControlledRandom() < 0.5 ? true : false;
}

function randomTransformString(str) {
  let fStr;
  let choice = getRandomIntExclusive(0, 3);
  switch (choice) {
    case 0:
      fStr = str;
      break;
    case 1:
      fStr = str.toLowerCase();
      break;
    case 2:
      fStr = str.toUpperCase();
      break;
  }
  choice = getRandomIntExclusive(0, 4);
  switch (choice) {
    case 0:
      fStr = str;
      break;
    case 1:
      fStr = str + '   ';
      break;
    case 2:
      fStr = '   ' + str;
      break;
    case 3:
      fStr = '   ' + str + '   ';
      break;
  }
  return fStr;
}

function buildRandomUserInfos(fname, lname) {
  const ui = {
    firstname: randomTransformString(fname),
    lastname: randomTransformString(lname),
  };
  if (getRandomBoolean()) {
    ui['age'] = getRandomValueFromArray(AGES);
  }
  return ui;
}

function buildRandomPhoneInfo() {
  const pi = {
    signal: getRandomPercent(),
    data: getRandomBoolean(),
  }
  const nbExtra = getRandomIntExclusive(0, EXTRA_PHONES_INFOS.length + 1);
  let extras;
  switch (nbExtra) {
    case 0:
      extras = getRandomBoolean() ? [] : null;
      break;
    case 1:
      extras = getRandomValueFromArray(EXTRA_PHONES_INFOS);
      break;
    default:
      let i = getRandomIntExclusive(0, EXTRA_PHONES_INFOS.length);
      extras = [];
      for (let j = 0; j < nbExtra; j++) {
        extras.push(EXTRA_PHONES_INFOS[i]);
        i = (i + 1) % EXTRA_PHONES_INFOS.length;
      }
  }
  if (extras !== null) {
    pi['extra'] = extras;
  }
  pi['model'] = getRandomBoolean() ? getRandomValueFromArray(PHONE_MODELS) : null;
  return pi;
}

function makeRandomCoordinates(coorBase) {
  const latSecond = 30.715; // A latitudinal second is 30.715m.
  const lonSecond = 30.92; // A longitudinal second is 30.92m at equator (but for sank of simplicity we will use it as a constant)
  const latVariationMeter = 1000; // we allow -1000m
  const lonVariationMeter = 2000; // we allow +2000m if we were at the equator!
  const latVariation = (latVariationMeter / latSecond) / 3600; // Latitudinal variation in degrees
  const lonVariation = (lonVariationMeter / lonSecond) / 3600; // Longitudinal variation in degrees

  // Compute new coordinates with random variation
  const coordinates = [
    coorBase.coordinates[0] + (2 * generateControlledRandom() - 1) * latVariation,
    coorBase.coordinates[1] + (2 * generateControlledRandom() - 1) * lonVariation
  ];

  return { type: coorBase.type, coordinates };
}

function buildRandomModel() {
  const fname = getRandomValueFromArray(FIRSTNAMES);
  const lname = getRandomValueFromArray(LASTNAMES);
  return {
    timestamp: getRandomDate(...TIMESTAMP_RANGE),
    username: fname.slice(0, 1).toLowerCase() + lname.toLowerCase(),
    userInfos: buildRandomUserInfos(fname, lname),
    location: makeRandomCoordinates(getRandomValueFromArray(LOCATIONS)),
    phoneInfo: buildRandomPhoneInfo()
  }
}

function main() {
  const nbElements = 1000000;
  const nbBatchItems = 1000;
  let percentProgression = 0.0;
  let batchPercent = 100 * (nbBatchItems / nbElements);

  print("Geospatial index creation...")
  db[COLLECTION_NAME].createIndex({ location: "2dsphere" });
  print("Simcatch traces insertion...")
  print(`...${percentProgression.toFixed(2)}% traces inserted...`);
  for (let i = 0; i < Math.floor(nbElements / nbBatchItems); i++) {
    db[COLLECTION_NAME].insertMany(Array(nbBatchItems).fill(null).map(() => buildRandomModel()));
    percentProgression += batchPercent;
    print(`...${percentProgression.toFixed(2)}% traces inserted...`);
  }
}

main();
