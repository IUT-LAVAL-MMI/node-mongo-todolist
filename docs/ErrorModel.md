# Modèle d'une erreur

Ce modèle est celui d'une erreur HTTP retournée au client.

## Exemple d'erreur JSON
```
{
  "error": "Une erreur"
}
```

## Description

- **erreur** *[String]* : Message de l'erreur (si l'erreur est une instance d'Error),
ou à défaut l'erreur elle-même
