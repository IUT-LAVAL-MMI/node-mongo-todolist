# Description de l'API REST de gestion des tâches

Pour tous les services proposés, les erreurs retournées respectent le modèle d'erreur décrit dans [ErrorModel.md](ErrorModel.md)

## GET /api/tasks

- Retourne la liste des tâches, triées par date de création décroissante. N'inclue pas les détails d'une tâche.
- Paramètres de requête :
  - *achieved*: booléen, unique & optionnel, valeur par défaut : aucun. Si true, inclue dans les résultat uniquement les tâches terminée. Si false, inclue dans les résultat uniquement les tâche non terminée ;
  - *lateOnly*: booléen, unique & optionnel, valeur par défaut : false. Si true, n'inclue dans les résultat que les tâches en retard : tâches dont la date de fin (deadline) est antérieur à la date du jour ;
  - *keyword*: String, multiple & optionnel, valeur par défaut : aucune. Si présent, recherche les tâche contenant ce mot clé dans leurs titre (sans respect de la casse ni des accents).
- Données de réponse : liste de tâches contenant les propriétés *id*, *creation*, *deadline*, *author*, *title* et *achieved*.
- Codes de réponse possibles:
  - **200** : OK
  - **5xx** : Erreur du serveur

### Exemple d'une url de requête

```
GET http://localhost:8080/api/tasks?lateOnly=true&keyword=achat&keyword=legume
```

### Exemple d'une réponse

```
[
  {
    "_id": "xxxx-xxxx-xxxx",
    "creation": "2020-11-12T00:00:00",
    "deadline": "2020-12-01T00:00:00",
    "author": "Rémi",
    "title": "Acheter légumes",
    "achieved": null
  },
  {
    "_id": "yyyy-yyyy-yyyy",
    "creation": "2020-12-14T00:00:00",
    "deadline": null,
    "author": "Jules",
    "title": "Acheter légumes",
    "achieved": null
  },
  {
    "_id": "zzzz-zzzz-zzzz",
    "creation": "2020-11-01T00:00:00",
    "deadline": "2020-12-01T00:00:00",
    "author": "Rémi",
    "title": "Corriger copies",
    "achieved": "2020-12-03T00:00:00"
  }
]
```

## POST /api/tasks

- Créer une nouvelle tâche. La propriété *creation* est automatiquement positionnée à la date actuelle si elle n'est pas fournie. Les propriétés *deadline* et *details* sont positonnées à *null* si elles ne sont pas fournies. La propriété *achieved* est toujours positionnée à *null*. Les propriétés *author* et *title* doivent obligatoirement être renseignées (différentes de *null*) et non vides (différentes de *""*).
- Données de réponse : la tâche créée, avec toutes ses propriétés.
- Codes de réponse possibles:
  - **201** : OK
  - **400** : données invalides (données obligatoire manquante, données au mauvais format, json invalide...)
  - **5xx** : Erreur du serveur

### Exemple d'un corps de requête
```
{
  "deadline": "2022-03-04T14:00:00",
  "author": "Remi",
  "title": "Acheter légumes",
  "details": "Des carottes, des pommes de terre et des panais"
}
```

### Exemple d'une réponse

```
{
  "_id": "xxxx-xxxx-xxxx",
  "creation": "2022-01-10T10:52:32",
  "deadline": "2022-03-04T14:00:00",
  "achieved": null,
  "author": "Remi",
  "title": "Acheter légumes",
  "details": "Des carottes, des pommes de terre et des panais"
}
```

## GET /api/tasks/:id

- Retourne une tâche particulière d'identifiant :id.
- Données de réponse : la tâche avec toutes ses propriétés.
- Codes de réponse possibles:
  - **200** : OK, la tâche a été créé
  - **404** : La tâche n'existe pas
  - **5xx** : Erreur du serveur

### Exemple d'une requête

```
GET http://localhost:8080/api/tasks/xxxx-xxxx-xxxx
```

### Exemple d'une réponse

```
{
  "_id": "xxxx-xxxx-xxxx",
  "creation": "2022-01-10T10:52:32",
  "deadline": "2022-03-04T14:00:00",
  "achieved": null,
  "author": "Remi",
  "title": "Acheter légumes",
  "details": "Des carottes, des pommes de terre et des panais"
}
```

## PATCH /api/tasks/:id

- Modifie les infos de la tâche d'identifiant :id. Seuls les champs présents sont mis à jour. Ne peut modifier que les champs *creation*, *deadline*, *achieved*, *author*, *title* et *details*.
- Données de réponse : la tâche mise à jour.
- Codes de réponse possibles:
  - **200** : OK, la tâche a été créé.
  - **400** : données invalides (données au mauvais format, json invalide...)
  - **404** : La tâche n'existe pas
  - **5xx** : Erreur du serveur

### Exemple d'une requête

```
PATCH http://localhost:8080/api/tasks/xxxx-xxxx-xxxx
```

### Exemple d'un corps de requête
```
{
  "title": "Acheter saint-pierre",
  "details": null,
  "achieved": "2022-01-17T00:00:32"
}
```

### Exemple d'une réponse

```
{
  "_id": "xxxx-xxxx-xxxx",
  "creation": "2022-01-10T10:52:32",
  "deadline": "2022-03-04T14:00:00",
  "achieved": "2022-01-17T00:00:32"
  "author": "Remi",
  "title": "Acheter saint-pierre",
  "details": null
}
```

## DELETE /api/tasks/:id

- Supprime une tâche d'identifiant :id.
- Données de réponse : la tâche mise à jour.
- Données de réponse : aucune.
- Codes de réponse possibles:
  - **204** : OK, La tâche a été supprimée
  - **404** : la tâche d'id :id n'existe pas
  - **5xx** : Erreur du serveur

### Exemple d'une requête

```
DELETE http://localhost:8080/api/tasks/xxxx-xxxx-xxxx
```
