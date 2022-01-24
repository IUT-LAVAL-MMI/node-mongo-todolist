# Modèle de document d'une tâche

Ce modèle est celui des documents de la base de données, mais également celui utilisé en JSON pour l'interaction entre l'API REST et les clients.

## Exemple de document JSON
```
{
  "_id": "xxxx-xxxx-xxxx"
  "creation": "2020-12-01T10:00:00",
  "deadline": "2020-12-13T14:00:00",
  "achieved": "2020-12-10T12:50:05",
  "author": "Remi",
  "title": "Acheter légumes",
  "details": "Des carottes, des pommes de terre et des panais"
}
```

## Description

- **_id** *[String]* : L'identifiant
- **creation** *[ISODate]* : Date de création
- **deadline** *[ISODate | null]* : Date de fin attendue
- **achieved** *[ISODate | null]* : Date d'achêvement
- **author** *[String]* : Auteur
- **title** *[String]* : Titre
- **details** *[String | null]* : Détails
