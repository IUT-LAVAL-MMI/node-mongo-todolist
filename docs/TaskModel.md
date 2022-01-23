# Modèle de document d'une tâche

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
