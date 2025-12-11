# A Simple Todo list based on Node.js and MongoDB

## Requirements

- node.js v16+
- npm v8+
- docker
- docker compose

## Setup the environment

Clone [.env.example](.env.example) file and rename it as `.env`, then tweak it to your needs.

## Launching the MongoDB test database

In the project directory, execute the following command :
```
$ docker compose up
```

To stop it, execute the following command (either in another terminal or once shutting the previous one with CTRL+C) :
```
$ docker compose down
```

To clean it completly, remove the associated volume by executing the following command:
```
$ docker compose down -v
```

## Accessing the MongoDB test database in a command line client

Once the mongoDB test database launched, execute the following command in another terminal:
```
$ ./access_mongo_client.sh
```
You should be connected to the mongo datbase through a CLI client.

## Expected REST API

You have to developp a Rest API using the express and mongo node.js libraries.
The API handle a single data model: the task.

### REST API endoints documentation

The task JSON model, used for MongoDB and the REST API is described in french at [docs/TaskModel.md](docs/TaskModel.md).
The error JSON model, used for the REST API is described in french at [docs/ErrorModel.md](docs/ErrorModel.md).
The expected REST API is described in french at [docs/RESTApi.md](docs/RESTApi.md).

### MongoDB connection information

The connection information to the MongoDB test database are already given in [.env](.env) file.
Simply use 'dotenv/config' to read its content inside your Javascript file.
The collection used is named *tasks*.

### HTTP Server information

When starting your express app, use the server information *hostname* and *port* exposed in [.env](.env) file.
