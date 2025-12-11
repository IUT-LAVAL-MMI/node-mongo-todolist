#!/bin/bash
source .env
echo "Attempt to connect to MMI Library Server Mongo server..."
docker compose run --rm mytodolist-mongo mongosh \
  --host mytodolist-mongo \
  -u ${MONGO_USER} -p ${MONGO_PWD} \
  --authenticationDatabase admin \
  todolistdb

echo "Bye."