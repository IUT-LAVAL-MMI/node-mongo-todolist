import { MongoClient } from 'mongodb';
// Dotenv permet de lire les fichiers .env et les variables d'environnement.
import 'dotenv/config';

const mongoUri = 
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@localhost:${process.env.MONGO_PORT}`;
const client = new MongoClient(mongoUri);

async function testConnection() {
  await client.connect();
  const db = client.db(process.env.MONGO_DB).command({ping: 1});
  return db;
}

async function getDatabase() {
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  return db;
}

export { testConnection, getDatabase };