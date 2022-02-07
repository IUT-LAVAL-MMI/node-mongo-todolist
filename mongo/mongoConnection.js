const { MongoClient } = require('mongodb');
const { mongoUri, mongoDb } = require('../config');

const client = new MongoClient(mongoUri);
const promesseConnexion = client.connect();

async function testConnexion() {
  const c = await promesseConnexion;
  return c.db(mongoDb).command({ ping: 1 });
}

async function getDatabase() {
  const c = await promesseConnexion;
  return c.db(mongoDb);
}

module.exports = {
  testConnexion,
  getDatabase
};
