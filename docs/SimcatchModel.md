# Modèle de document d'une trace de sim

Ce modèle est celui des documents de la base de données, mais également celui utilisé en JSON pour l'interaction entre l'API REST et les clients.

## Exemple de document JSON
```
{
  "_id": "xxxx-xxxx-xxxx"
  "timestamp": "2020-12-01T10:00:00",
  "username": "jean",
  "userInfos": {
    "firstname": "Jean",
    "lastname": "Lastgon",
    "age": 10
  },
  "location": {
    "type": "Point",
    "coordinates": [ 48.643969, -1.870400 ]
  },
  "phoneInfo": {
    "model": "Samsung_S4",
    "signal": 54.44,
    "data": true,
    "extra": [ "Wifi Enabled", "Unlocked" ]
  }
}
```

## Description

- **_id** *[String]* : Identifiant unique de trace
- **timestamp** *[ISODate]* : Date de création de la trace
- **username** *[String]* : Nom d'utilisateur, unique pour chaque utilisateur
- **userInfos** *[Object]* : Informations sur l'utilisateur
  - **lastname** *[String]* : Nom de famille d'utilisateur
  - **firstname** *[String]* : Prénom de l'utilisateur
  - **age** *[Number]* : Age de l'utilisateur. Cet attribut peut ne pas exister.
- **location** *[Object]* : Localisation de la trace
  - **type** *[String]* : type de localisation ; vaut toujours "Point"
  - **coordinates** *[[Number, Number]]* : tableau de 2 coordonées GPS (lat., long.)
- **phoneInfo** *[Object]* : Informations sur le téléphone
  - **model** *[String | null]* : Modèle du téléphone
  - **signal** *[Number]* : Qualité de signal du téléphone (pourcentage)
  - **data** *[Boolean]* : Indicateur d'activation des données mobiles
  - **extra** *[[...String]]?* : Informations supplémentaires, sous la forme d'un tableau de chaînes de caractères. Cet attribut peut ne pas exister.

## Propreté des données

Certains documents comportent quelques écarts au modèle, à savoir :

- **userInfos.firstname, userInfos.lastname** : il peut y avoir des espaces devant ou derrière, et certains documents ont le prénom/nom écrit en majuscules, ou à l’inverse, tout en minuscules.
- **userInfos.age** : le champ n’existe pas dans certain documents.
- **phoneInfo.model** : le champ est parfois à null
- **phoneInfo.extra** : le champ n’existe pas dans certain document
