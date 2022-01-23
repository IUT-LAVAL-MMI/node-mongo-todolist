// Server Configuration
const SERVER_INFO = {
  host: 'localhost',
  port: 3000,
};

// Mongo Configuration
const MONGO_INFO = {
  host: 'localhost',
  port: 27017,
  database: 'todolistdb',
  username: 'mongouser',
  password: 'ajdshfez2sd',
  authdb: 'admin',
  retryWrites: true
};

// Check mandatory mongo config. info.
if (!MONGO_INFO || !MONGO_INFO.host || !MONGO_INFO.port || !MONGO_INFO.database) {
  throw new Error('Missing mandatatory mongo config information');
}

// Build mongo uri access
let uri = 'mongodb://';
if (MONGO_INFO.username && MONGO_INFO.password) {
  uri += `${MONGO_INFO.username}:${MONGO_INFO.password}@`;
}
uri += `${MONGO_INFO.host}:${MONGO_INFO.port}`;
if (MONGO_INFO.username && MONGO_INFO.authdb) {
  uri += `/${MONGO_INFO.authdb}`;
}
if (MONGO_INFO.retryWrites) {
  uri += '?retryWrites=true';
}

module.exports = {
  serverHostname: SERVER_INFO.host,
  serverPort: SERVER_INFO.port,
  mongoUri: uri,
  mongoDb: MONGO_INFO.database,
};
