# React Mentor Training Session Contract

Derniere mise a jour: 7 mars 2026

## 1. Role du document

Ce document fige le contrat v1 de `TrainingSession`.

Il sert a aligner:

- le session builder
- les pages de lancement
- le player
- les attempts
- les futures evolutions review et mock

## 2. Entite centrale

`TrainingSession`

Champs utilises en v1:

- `id`
- `userId`
- `mode`
- `config`
- `score`
- `startedAt`
- `endedAt`

Relations:

- `items[]`
- `attempts[]`

## 3. Lifecycle v1

Une session passe par ces etats derives:

- `active`: `endedAt = null`
- `completed`: `endedAt != null`

En v1, il n'y a pas encore d'etat `paused` explicite en base.

La reprise s'appuie sur:

- la session existante
- la liste ordonnee des `items`
- les `attempts` deja persistées pour cette session

## 4. Config JSON v1

`config` doit contenir un objet stable et exploitable cote app:

- `source`
- `locale`
- `questionCount`
- `moduleSlug?`
- `tracks?`
- `level?`
- `templateKey?`

### 4.1 `source`

Valeurs v1:

- `module`
- `mock_template`

### 4.2 `locale`

Locale de construction de la session:

- `fr`
- `en`

### 4.3 `questionCount`

Nombre cible de questions a composer.

Regle v1:

- on peut composer moins si la base disponible est plus petite
- on ne cree jamais une session vide

### 4.4 `moduleSlug`

Present si la session est lancee depuis une page module.

### 4.5 `tracks`

Liste des tracks prioritaires utilises pour la selection.

### 4.6 `level`

Niveau cible de la session.

### 4.7 `templateKey`

Present si la session vient d'un preset mock.

## 5. Selection de questions v1

V1 reste simple et defendable:

- uniquement des questions `SINGLE_CHOICE`
- filtres par module / track / niveau
- pas de doublons dans une meme session
- priorite aux questions jamais tentees puis aux signaux faibles

Ordre de priorisation v1:

1. question jamais tentee
2. question `NEW` ou `LEARNING`
3. question la plus ancienne cote `lastAttemptAt`
4. difficulte legerement plus haute pour les mocks

## 6. Score v1

Le score final vaut:

- `round(correctAnswers / totalQuestions * 100)`

Le score n'est calcule qu'a la fin:

- au moment ou la derniere tentative de la session est persistée

## 7. Resume d'une session active

Pour reprendre une session:

- on charge `items` ordonnes
- on charge les `attempts` de cette session
- la question courante = premier item sans tentative persistée

Si tous les items ont une tentative:

- la session est consideree terminee
- `endedAt` et `score` doivent etre renseignes

## 8. Hors scope v1

Pas encore inclus:

- multi-select complet
- reponse ouverte
- pause explicite
- abandon de session
- scoring multi-dimensionnel
- rapport detaille de fin de session
