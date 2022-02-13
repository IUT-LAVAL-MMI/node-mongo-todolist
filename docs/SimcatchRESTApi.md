# Description de l'API REST de traces mobile

Pour tous les services proposés, les erreurs retournées respectent le modèle d'erreur décrit dans [ErrorModel.md](ErrorModel.md)

## Recherche, obtention, modification et suppression

### GET /api/simcatches

- Retourne la liste des traces, triées par date de création décroissante. Retourne toutes les informations contenues dans les traces. Si le paramètre de requête *limit* n'est pas fourni ou est invalide, retourne les 10 premiers résultats.
- Paramètres de requête, **tous optionnels** :
  - *limit*: nombre entier, unique et optionnel. Limite le nombre maximal de résultats à retourner. Si *limit* = 0, retourne tous les résultats.
  - *username*: chaine de caractères, unique et optionnel. Filtre les traces d'après la valeur de la propriété username.
  - *minor*: booléen, unique et optionnel. Filtre les traces dont l'age de l'utilisateur était, au moment de la trace, inférieur à 18 ans.
  - *month*: chaine de caractères, unique et optionnel. Représente un mois et une année au format "yyyy-mm" (année-mois). Filtre les traces dont le mois et l'année du timestamp correspondent à ce qui a été fourni.
  - *locX*, *locY* : Number, unique et optionnel. Cordonnées GPS. Filtre les traces situées à moins de *locDist* mètres du point de coordonées [locX, locY]. locX et locY doivent être renseignées toutes les deux.
  - *locDist* : Number, unique et optionnel. distance de filtrage géographique en mètres. Valeur par défaut : 100.
  - *count*: booléen, unique et optionnel. Si fourni, retourne le nombre de traces correspondant à la requête en prenant en compte tous les autres filtre sauf *limit*
- Données de réponse : liste de traces contenant toutes les propriétés.
- Codes de réponse possibles:
  - **200** : OK
  - **400** : Paramètre de requête invalide
  - **5xx** : Erreur du serveur

#### Exemple d'une url de requête

```
GET http://localhost:3000/api/simcatches?username=apuccino&minor=true&limit=2
```

#### Exemple d'une réponse

```
[
  {
    "_id": "62083e28fb993d50ebfa38b8",
    "timestamp": "2020-03-31T23:11:38.913Z",
    "username": "apuccino",
    "userInfos": {
      "firstname": "   Azédine   ",
      "lastname": "Puccino   ",
      "age": 15
    },
    "location": {
      "type": "Point",
      "coordinates": [
        47.41978920699469,
        0.7676645257987804
      ]
    },
    "phoneInfo": {
      "signal": 18.67095814086497,
      "data": false,
      "extra": [],
      "model": null
    }
  },
  {
    "_id": "62083dfafb993d50ebf4a492",
    "timestamp": "2020-03-31T23:11:06.756Z",
    "username": "apuccino",
    "userInfos": {
      "firstname": "Aniès   ",
      "lastname": "   Puccino",
      "age": 15
    },
    "location": {
      "type": "Point",
      "coordinates": [
        50.47421832604022,
        1.7558977550335553
      ]
    },
    "phoneInfo": {
      "signal": 9.855990740470588,
      "data": false,
      "model": "Nokia_3310"
    }
  }
]
```

#### Exemple d'une url de requête de comptage

```
GET http://localhost:3000/api/simcatches?month=2020-03&locX=48.643969&locY=-1.870400&locDist=500&limit=5&count=true
```

#### Exemple d'une réponse de comptage

```
{
  "count": 4287
}
```

### GET /api/simcatches/:id

- Retourne une trace particulière d'identifiant :id.
- Données de réponse : la trace avec toutes ses propriétés.
- Codes de réponse possibles:
  - **200** : OK, la tâche a été créé
  - **404** : La tâche n'existe pas
  - **5xx** : Erreur du serveur

#### Exemple d'une requête

```
GET http://localhost:3000/api/simcatches/62083dfafb993d50ebf4a492
```

#### Exemple d'une réponse

```
{
  "_id": "62083dfafb993d50ebf4a492",
  "timestamp": "2020-03-31T23:11:06.756Z",
  "username": "apuccino",
  "userInfos": {
    "firstname": "Aniès   ",
    "lastname": "   Puccino",
    "age": 15
  },
  "location": {
    "type": "Point",
    "coordinates": [
      50.47421832604022,
      1.7558977550335553
    ]
  },
  "phoneInfo": {
    "signal": 9.855990740470588,
    "data": false,
    "model": "Nokia_3310"
  }
}
```

### PATCH /api/simcatches/:id

- Modifie les informations de la trace d'identifiant :id. Seuls les champs présents sont mis à jour.
- Ne peut modifier que les champs *username*, *userInfos.firstname*, *userInfos.lastname*, *userInfos.age*, *phoneInfo.model*, *phoneInfo.signal*, *phoneInfo.data* et *phoneInfo.extra*.
- Seuls les champs suivant peuvent être positionné à null : *userInfos.age*, *phoneInfo.model*, *phoneInfo.extra*.
- si le champ *userInfos.age* ou *phoneInfo.extra* est mis à null, il sera supprimé du document.
- si le champ *phoneInfo.model* est mis à null, si sera mis à null dans le document.
- Données de réponse : la trace mise à jour.
- Codes de réponse possibles:
  - **200** : OK, la tâche a été modifiée.
  - **400** : données invalides (données au mauvais format, json invalide, positionnement à null d'un champs interdit...)
  - **404** : La tâche n'existe pas
  - **5xx** : Erreur du serveur

#### Exemple d'une requête

```
PATCH http://localhost:3000/api/simcatches/6208437a483e5f7b4afcb25e
```

#### Exemple d'un corps de requête
```
{
  "username": "jbroisin",
  "userInfos": {
    "firstname": "Julien",
    "lastname": "Broisin",
    "age": null
  },
  "phoneInfo": {
    "signal": 68,
    "data": true,
    "extra": ["WebcamON", "unlocked"],
    "model": null
  }
}
```

#### Exemple d'une réponse

```
{
  "_id": "6208437a483e5f7b4afcb25e",
  "timestamp": "2020-03-31T23:59:55.833Z",
  "username": "jbroisin",
  "userInfos": {
    "firstname": "Julien",
    "lastname": "Broisin"
  },
  "location": {
    "type": "Point",
    "coordinates": [
      44.92472825862379,
      4.870988328863038
    ]
  },
  "phoneInfo": {
    "signal": 68,
    "data": true,
    "extra": [
      "WebcamON",
      "unlocked"
    ],
    "model": null
  }
}
```

### DELETE /api/simcatches/:id

- Supprime une trace d'identifiant :id.
- Données de réponse : la tâche mise à jour.
- Données de réponse : aucune.
- Codes de réponse possibles:
  - **204** : OK, La tâche a été supprimée
  - **404** : la tâche d'id :id n'existe pas
  - **5xx** : Erreur du serveur

#### Exemple d'une requête

```
DELETE http://localhost:3000/api/simcatches/62083dfafb993d50ebf4a492
```

## Statistiques

### GET /api/simcatches-stats/num-by-users-and-date

- Calcule les nombres de traces par nom d'utilisateur et par date (au format année-mois-jour).
- les statistiques sont triées par nom d'utilisateur croissant puis par date décroissant.
- Paramètres de requête, **tous optionnels** :
  - *dateMin*: String, unique & optionnel, valeur par défaut : aucune. Chaine de caractères représentant une date au format "yyyy-mm-dd" (année-mois-jour). Si fourni, les statistiques ne prennent en compte que les traces dont la date est posterieure ou égale à dateMin.
  - *dateMax*: String, unique & optionnel, valeur par défaut : aucune. Chaine de caractères représentant une date au format "yyyy-mm-dd" (année-mois-jour). Si fourni, les statistiques ne prennent en compte que les traces dont la date est antérieure ou égale à dateMax.
- Codes de réponse possibles :
  - **200** : OK
  - **400** : Paramètre de requête invalide
  - **5xx** : Erreur du serveur

#### Exemple d'une url de requête

```
GET http://localhost:3000/api/simcatches-stats/num-by-users-and-date?dateMin=2020-03-15&dateMax=2020-03-31
```

#### Exemple d'une réponse

```
[
  {
    "numSimcatches": 738,
    "username": "acotentin",
    "date": "2020-03-30T00:00:00.000Z"
  },
  {
    "numSimcatches": 712,
    "username": "acotentin",
    "date": "2020-03-29T00:00:00.000Z"
  },
  {
    "numSimcatches": 776,
    "username": "acotentin",
    "date": "2020-03-28T00:00:00.000Z"
  },
  {
    "numSimcatches": 704,
    "username": "acotentin",
    "date": "2020-03-27T00:00:00.000Z"
  },
  {
    "numSimcatches": 762,
    "username": "ade suza",
    "date": "2020-03-17T00:00:00.000Z"
  },
  {
    "numSimcatches": 734,
    "username": "ade suza",
    "date": "2020-03-16T00:00:00.000Z"
  },
  {
    "numSimcatches": 732,
    "username": "ade suza",
    "date": "2020-03-15T00:00:00.000Z"
  },
  {
    "numSimcatches": 759,
    "username": "adiarra",
    "date": "2020-03-30T00:00:00.000Z"
  },
]
```

### GET /api/simcatches-stats/num-by-phone-model-and-age

- Calcule les nombres de traces par modèle de téléphone et par "catégorie d'age" (age arrondi à la dizaine).
- Les documents avec un modèle de téléphone à null ou sans age ne sont pas pris en compte.
- Les statistiques sont triées par modèles de téléphone croissants puis par catégories d'age croissantes.
- Codes de réponse possibles :
  - **200** : OK
  - **5xx** : Erreur du serveur

#### Exemple d'une url de requête

```
GET http://localhost:3000/api/simcatches-stats/num-by-phone-model-and-age
```

#### Exemple d'une réponse

```
[
  {
    "numSimcatches": 23710,
    "phoneModel": "Galaxy_note_29",
    "age": 20
  },
  {
    "numSimcatches": 3956,
    "phoneModel": "Galaxy_note_29",
    "age": 30
  },
  {
    "numSimcatches": 3993,
    "phoneModel": "Galaxy_note_29",
    "age": 50
  },
  {
    "numSimcatches": 69941,
    "phoneModel": "Iphone_5",
    "age": 20
  },
  {
    "numSimcatches": 11543,
    "phoneModel": "Iphone_5",
    "age": 30
  },
  {
    "numSimcatches": 11608,
    "phoneModel": "Iphone_5",
    "age": 50
  },
  {
    "numSimcatches": 23370,
    "phoneModel": "Iphone_7",
    "age": 20
  },
  {
    "numSimcatches": 3811,
    "phoneModel": "Iphone_7",
    "age": 30
  },
  {
    "numSimcatches": 3759,
    "phoneModel": "Iphone_7",
    "age": 50
  },
  {
    "numSimcatches": 23554,
    "phoneModel": "Nokia_3310",
    "age": 20
  },
  {
    "numSimcatches": 3934,
    "phoneModel": "Nokia_3310",
    "age": 30
  },
  {
    "numSimcatches": 3845,
    "phoneModel": "Nokia_3310",
    "age": 50
  },
  {
    "numSimcatches": 23446,
    "phoneModel": "Samsung_S4",
    "age": 20
  },
  {
    "numSimcatches": 3942,
    "phoneModel": "Samsung_S4",
    "age": 30
  },
  {
    "numSimcatches": 3968,
    "phoneModel": "Samsung_S4",
    "age": 50
  },
  {
    "numSimcatches": 23385,
    "phoneModel": "Samsung_S5",
    "age": 20
  },
  {
    "numSimcatches": 3857,
    "phoneModel": "Samsung_S5",
    "age": 30
  },
  {
    "numSimcatches": 3931,
    "phoneModel": "Samsung_S5",
    "age": 50
  }
]
```

### GET /api/simcatches-stats/avg-signal-by-username-and-month

- Calcule le signal moyen des traces par nom d'utilisateur et pas mois (année-mois).
- Les statistiques sont triées par nom d'utilisateur croissant puis par mois décroissant.
- Paramètres de requête, **tous optionnels** :
  - *username*: String, multiple & optionnel, valeur par défaut : aucune. Si présent, ne calcule les statistiques que pour le/les utilisateurs dont le username a été donné.
- Codes de réponse possibles :
  - **200** : OK
  - **400** : Paramètre de requête invalide
  - **5xx** : Erreur du serveur

#### Exemple d'une url de requête

```
GET http://localhost:3000/api/simcatches-stats/avg-signal-by-username-and-month?username=acotentin&username=kde%20suza
```

#### Exemple d'une réponse

```
[
  {
    "avgSignal": 50.05719081204313,
    "username": "acotentin",
    "month": "2020-03-01T00:00:00.000Z"
  },
  {
    "avgSignal": 49.887117486688865,
    "username": "acotentin",
    "month": "2020-02-01T00:00:00.000Z"
  },
  {
    "avgSignal": 49.81085898081282,
    "username": "acotentin",
    "month": "2020-01-01T00:00:00.000Z"
  },
  {
    "avgSignal": 50.130236577333754,
    "username": "kde suza",
    "month": "2020-03-01T00:00:00.000Z"
  },
  {
    "avgSignal": 50.38484174981257,
    "username": "kde suza",
    "month": "2020-02-01T00:00:00.000Z"
  },
  {
    "avgSignal": 50.07949022712342,
    "username": "kde suza",
    "month": "2020-01-01T00:00:00.000Z"
  }
]
```

### GET /api/simcatches-stats/min-distance-by-user

- Calcule pour chaque utilisateur la distance minimale connue à un point de référence donné en paramètre de requête ([locX, locY]).
- La distance minimale est retournée arrondie au centimètre.
- Les statistiques sont triées par distance la plus proche à la plus éloignée du point donnée
- Si le paramètre distMax est fourni, seuls les traces dont la distance au point de référence est inférieure ou égale à ce paramètre seront prises en compte pour le calcul statistique.
- Paramètres de requête :
  - *locX*, *locY* : Number, unique & **obligatoire**. Cordonnées GPS de référence pour le calcul des statistiques.
  - *distMax* : Number, unique & optionnel. Valeur par défaut : aucune. distance maximal à prendre en compte.
- Codes de réponse possibles :
  - **200** : OK
  - **400** : Paramètre de requête invalide
  - **5xx** : Erreur du serveur

#### Exemple d'une url de requête

```
GET http://localhost:3000/api/simcatches-stats/min-distance-by-user?locX=48.643969&locY=-1.870400&distMax=20
```

#### Exemple d'une réponse

```
[
  {
    "username": "sde suza",
    "minDistance": 6.32
  },
  {
    "username": "npuccino",
    "minDistance": 7.56
  },
  {
    "username": "nlaston",
    "minDistance": 8.91
  },
  {
    "username": "acotentin",
    "minDistance": 13.1
  },
  {
    "username": "adiarra",
    "minDistance": 14.67
  },
  {
    "username": "kcotentin",
    "minDistance": 15.69
  },
  {
    "username": "ycotentin",
    "minDistance": 16.69
  },
  {
    "username": "kde suza",
    "minDistance": 17.19
  },
  {
    "username": "kpuccino",
    "minDistance": 18.12
  },
  {
    "username": "ylaston",
    "minDistance": 19.4
  }
]
```
