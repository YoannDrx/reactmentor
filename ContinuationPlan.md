# React Mentor Continuation Plan

Derniere mise a jour: 7 mars 2026

Document parent:

- [Roadmap.md](./Roadmap.md)
- [ExecutionPlan.md](./ExecutionPlan.md)
- [BuildTracker.md](./BuildTracker.md)
- [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)

## 1. Role du document

Ce document transforme l'etat actuel du repo en plan de continuation directement executable.

Il sert a:

- prioriser ce qui reste vraiment critique
- decouper la suite en chantiers courts et coherents
- expliciter les dependances entre produit, schema, contenu et UI
- preparer un backlog utilisable sans refaire l'analyse du projet

Ce document ne remplace pas la roadmap.
Il complete `ExecutionPlan.md` avec une vue "prochains lots et prochains sprints".
Le detail exhaustif des epics, tickets, dependances et besoins anticipes se trouve dans `MasterDevelopmentPlan.md`.

## 2. Resume executif

Le projet n'est plus une demo.
Le coeur produit existe deja en version defendable:

- auth, onboarding et settings relies a de vraies preferences
- dashboard, review, progress et mocks relies a Prisma
- moteur de session live pour `PRACTICE`, `REVIEW` et `MOCK_INTERVIEW`
- progression persistante `QuestionProgress` et `SkillProgress`
- i18n FR/EN et socle de tests deja en place

Le chemin recommande n'est donc plus de "rajouter des pages".
Le vrai chemin critique devient:

1. sortir totalement du legacy demo et monolingue
2. ouvrir le moteur pedagogique au-dela du `SINGLE_CHOICE`
3. rendre la progression plus robuste et plus explicable
4. faire des mocks multi-formats vraiment utiles
5. ouvrir l'appropriation personnelle
6. construire un admin contenu leger mais exploitable

## 3. Priorites absolues

### P0

- clore la migration legacy contenu/i18n
- finaliser l'architecture multi-format du player
- recalibrer proprement la progression par question et par skill
- etendre les mocks a des compositions mixtes
- poser le contrat fonctionnel de l'admin contenu

### P1

- bookmarks et notes
- playlists par role cible ou sprint d'entretien
- analytics produit et observabilite
- billing et entitlements

## 4. Chantiers recommandes

## 4.1 Chantier A - Cleanup legacy et sortie complete du mode demo

### Objectif

Supprimer les derniers points de confusion entre:

- donnees localisees reelles
- fallbacks legacy monolingues
- previews marketing encore basees sur `demo-data.ts`

### Pourquoi maintenant

Ce chantier a une forte valeur de clarification.
Il reduit les decisions floues sur les prochains lots et evite de construire les nouveaux formats sur une couche de contenu encore ambigue.

### Tickets recommandes

#### A1 - Cartographier les champs legacy encore necessaires

But:

- decider si `title`, `description`, `summary`, `prompt`, `explanation` et `label` restent sources de verite temporaires ou simples fallbacks techniques

Fichiers principaux:

- [prisma/schema.prisma](/Users/yoannandrieux/Projets/react-mentor/prisma/schema.prisma)
- [src/lib/content-repository.ts](/Users/yoannandrieux/Projets/react-mentor/src/lib/content-repository.ts)
- [prisma/seed.ts](/Users/yoannandrieux/Projets/react-mentor/prisma/seed.ts)

Definition of done:

- decision documentee sur chaque champ racine legacy
- regles de fallback explicites dans les services
- impact migration liste

#### A2 - Purger les residus `demo-data.ts` hors landing si possible

But:

- garder la landing libre de faire de la mise en scene
- supprimer toute ambiguite dans les surfaces produit connectees

Fichiers principaux:

- [src/features/dashboard/dashboard-view-model.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/dashboard/dashboard-view-model.ts)
- [src/features/landing/landing-page.tsx](/Users/yoannandrieux/Projets/react-mentor/src/features/landing/landing-page.tsx)
- [src/app/auth/layout.tsx](/Users/yoannandrieux/Projets/react-mentor/src/app/auth/layout.tsx)

Definition of done:

- aucun composant de dashboard authentifie ne depend de `demo-data.ts`
- les previews marketing restantes sont assumees comme marketing

#### A3 - Clore `L1-05` avec migration et tests

But:

- aligner schema, seed, repository et tests sur la decision retenue

Definition of done:

- migration Prisma creee si necessaire
- seed aligne
- tests repository mis a jour
- `BuildTracker.md` passe `L1-05` a `DONE`

## 4.2 Chantier B - Player multi-format v1

### Objectif

Sortir du player monolithique implicitement `SINGLE_CHOICE` pour aller vers un moteur de rendu par format.

### Pourquoi maintenant

Tant que le player reste mono-format, la promesse pedagogique reste limitee et l'admin contenu ne peut pas etre correctement dessine.

### Ordre recommande

1. `MULTIPLE_CHOICE`
2. `CODE_OUTPUT`
3. `BUG_HUNT`
4. `OPEN_ENDED`

### Tickets recommandes

#### B1 - Refondre le contrat du player par format

But:

- introduire un renderer par format
- eviter que `SessionPlayer` continue a porter toute la logique de tous les formats

Fichiers principaux:

- [src/features/sessions/session-player.tsx](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-player.tsx)
- [src/features/sessions/session-view.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-view.ts)
- [src/features/sessions/session-attempt.state.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-attempt.state.ts)

Definition of done:

- structure de props stable par format
- `SessionPlayer` devient orchestrateur, pas implemention detaillee unique

#### B2 - Support end-to-end `MULTIPLE_CHOICE`

But:

- rendre jouable le premier format au-dela du single-choice

Fichiers principaux:

- [src/features/sessions/session.action.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session.action.ts)
- [src/features/sessions/session-builder.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-builder.ts)
- [prisma/seed.ts](/Users/yoannandrieux/Projets/react-mentor/prisma/seed.ts)
- [__tests__/session-builder.test.ts](/Users/yoannandrieux/Projets/react-mentor/__tests__/session-builder.test.ts)
- [e2e/practice.spec.ts](/Users/yoannandrieux/Projets/react-mentor/e2e/practice.spec.ts)

Definition of done:

- UI multi-select
- validation serveur correcte
- correction immediate correcte
- contenu seed au format multi-select
- tests unitaires et e2e ajoutes

#### B3 - Support v1 `CODE_OUTPUT`

But:

- couvrir les questions "quel est le resultat" sans ouvrir trop tot un editeur complet

Definition of done:

- contrat de contenu minimal fixe
- rendu jouable sans dette UX excessive
- rapport de correction clair

#### B4 - Support v1 `BUG_HUNT`

But:

- introduire des questions de lecture critique de code, proches de vrais entretiens

Definition of done:

- contrat editorial documente
- surface de rendu lisible mobile et desktop
- seed et tests minimaux presents

#### B5 - Cadrer `OPEN_ENDED` avant implementation

But:

- ne pas livrer un pseudo-format ouvert vide de sens

Definition of done:

- contrat fonctionnel de reponse guidee
- modele de rubric mock v1
- decision claire: notation manuelle, semi-guidee ou auto-evaluee localement

## 4.3 Chantier C - Progression et calibration long terme

### Objectif

Faire passer la progression d'une heuristique correcte a un signal produit defendable.

### Risque actuel

Le moteur actuel est coherent, mais encore trop compact pour expliquer clairement:

- pourquoi un skill monte ou baisse
- quel niveau de confiance on a dans le score
- a partir de quel volume on considere un signal solide

### Tickets recommandes

#### C1 - Enrichir `SkillProgress` en persistance

But:

- stocker plus que `masteryScore` et `correctRate`

Champs a considerer:

- `coverageCount`
- `difficultyCoverage`
- `recentFailureCount`
- `confidenceScore`
- `lastAttemptAt`

Fichiers principaux:

- [prisma/schema.prisma](/Users/yoannandrieux/Projets/react-mentor/prisma/schema.prisma)
- [src/features/sessions/skill-progress.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/skill-progress.ts)
- [src/features/sessions/session.action.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session.action.ts)

Definition of done:

- schema et calcul alignes
- read models capables d'expliquer la maitrise

#### C2 - Revoir `QuestionProgress` pour une repetition espacee moins naive

But:

- sortir d'une simple logique "si correct alors intervalle x2"

Fichiers principaux:

- [src/features/sessions/session-progress.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-progress.ts)
- [__tests__/session-progress.test.ts](/Users/yoannandrieux/Projets/react-mentor/__tests__/session-progress.test.ts)

Definition of done:

- regles de progression explicables
- tests sur cas limites et recidive d'erreurs

#### C3 - Expliquer la progression dans le dashboard

But:

- transformer les scores en signaux actionnables

Fichiers principaux:

- [src/features/dashboard/dashboard-read-model.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/dashboard/dashboard-read-model.ts)
- [src/app/dashboard/progress/page.tsx](/Users/yoannandrieux/Projets/react-mentor/src/app/dashboard/progress/page.tsx)
- [src/i18n/messages/fr.ts](/Users/yoannandrieux/Projets/react-mentor/src/i18n/messages/fr.ts)
- [src/i18n/messages/en.ts](/Users/yoannandrieux/Projets/react-mentor/src/i18n/messages/en.ts)

Definition of done:

- l'utilisateur comprend pourquoi une skill est fragile
- l'UI montre la confiance ou la couverture du score

## 4.4 Chantier D - Mock interviews v2

### Objectif

Transformer le mock d'un timed quiz serieux en vraie simulation d'entretien.

### Tickets recommandes

#### D1 - Ouvrir le builder mock a des compositions mixtes

But:

- composer par objectifs et signaux plutot que par preset mono-format

Fichiers principaux:

- [src/features/sessions/session-builder.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-builder.ts)
- [src/features/sessions/session-contract.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/sessions/session-contract.ts)
- [TrainingSessionContract.md](/Users/yoannandrieux/Projets/react-mentor/TrainingSessionContract.md)

Definition of done:

- au moins un template mixte reel
- priorisation coherente des formats et difficultes

#### D2 - Ajouter des scorecards par skill et par format

But:

- mieux qualifier les performances de mock

Definition of done:

- score global
- score par skill
- score ou verdict par format
- risques majeurs mieux classes

#### D3 - Poser la rubric v1 pour les formats ouverts

But:

- permettre un futur `OPEN_ENDED` utile en mock

Definition of done:

- criteres simples et repetables
- restitution dans le rapport final

#### D4 - Durcir la couverture e2e mock

But:

- verrouiller les regressions sur timer, expiration, reprise et rapport

Fichiers principaux:

- [e2e/mock-interviews.spec.ts](/Users/yoannandrieux/Projets/react-mentor/e2e/mock-interviews.spec.ts)
- [e2e/dashboard.spec.ts](/Users/yoannandrieux/Projets/react-mentor/e2e/dashboard.spec.ts)

## 4.5 Chantier E - Appropriation personnelle

### Objectif

Ouvrir les primitives qui transforment l'entrainement en systeme de travail personnel.

### Tickets recommandes

#### E1 - Bookmarks v1

But:

- permettre de sauvegarder une question a revisiter

Fichiers principaux:

- [prisma/schema.prisma](/Users/yoannandrieux/Projets/react-mentor/prisma/schema.prisma)
- pages et composants session/progress/review a identifier au moment du build

Definition of done:

- toggle bookmark
- vue liste ou filtre saved
- persistance et empty state

#### E2 - Notes v1

But:

- permettre une appropriation personnelle minimale par question

Definition of done:

- edition de note simple
- lecture dans la question et dans une vue recap si utile

#### E3 - Playlists v1

But:

- regrouper questions ou modules pour une preparation courte ciblee

Decision recommande:

- ne commencer qu'apres validation de bookmarks + notes

## 4.6 Chantier F - Admin contenu leger

### Objectif

Permettre la production editoriale sans construire un CMS generaliste trop tot.

### Principes

- UI admin minimale
- edition structuree par contrat
- checklist de publication
- operations bilingues de premiere classe

### Tickets recommandes

#### F1 - Definir le contrat fonctionnel admin

But:

- figer ce que l'outil doit faire en v1 et ce qu'il ne doit pas faire

Sources:

- [ContentContract.md](/Users/yoannandrieux/Projets/react-mentor/ContentContract.md)
- [Taxonomy.md](/Users/yoannandrieux/Projets/react-mentor/Taxonomy.md)

Definition of done:

- workflows module, skill, question, traduction, publication explicites

#### F2 - CRUD minimal modules et skills

But:

- ouvrir le socle editorial sans bloquer sur les questions

#### F3 - CRUD question + options + traductions

But:

- rendre le contenu jouable et publiable depuis l'admin

#### F4 - Checklist de publication

But:

- traduire le contrat editorial en gardes concrets

#### F5 - Import/export seed-compatible

But:

- garder la possibilite de produire ou corriger du contenu en dehors de l'UI admin

## 5. Plan de sprints recommande

## Sprint 1 - Cleanup legacy

Resultat vise:

- `L1-05` termine
- residus `demo-data.ts` clarifies ou supprimes
- tracker et execution plan remis en coherence

## Sprint 2 - Multi-choice end-to-end

Resultat vise:

- premier format jouable au-dela du single-choice
- architecture player extensible

## Sprint 3 - Calibration progression

Resultat vise:

- `L7-03` proche de `DONE`
- dashboard capable d'expliquer la confiance du score

## Sprint 4 - Mock mixed-format

Resultat vise:

- `L8-02` passe a `DONE`
- rapport mock enrichi

## Sprint 5 - Bookmarks et notes

Resultat vise:

- premiere couche d'appropriation personnelle en production

## Sprint 6 - Admin contenu v1

Resultat vise:

- edition de base modules/skills/questions/traductions

## 6. Backlog de tickets immediats

Ordre strict recommande:

1. fermer `L1-05` migration legacy monolingue
2. supprimer ou isoler completement les derniers usages produit de `demo-data.ts`
3. refondre `SessionPlayer` en architecture par format
4. livrer `MULTIPLE_CHOICE` end-to-end
5. enrichir `SkillProgress` en persistance et read model
6. reviser `QuestionProgress` avec des regles plus defendables
7. etendre le builder mock a des sessions mixtes
8. definir la rubric `OPEN_ENDED` et le contrat admin v1
9. ouvrir bookmarks
10. ouvrir notes

## 7. Risques de delivery

### Risque 1 - Ouvrir l'admin trop tot

Impact:

- rework important si les formats et contrats changent encore

Mitigation:

- attendre au moins l'architecture player multi-format et le contrat `OPEN_ENDED`

### Risque 2 - Complexifier trop vite la progression

Impact:

- score illisible et difficile a expliquer au user

Mitigation:

- garder des heuristiques simples mais explicites
- toujours exposer "pourquoi ce score" dans les read models

### Risque 3 - Lancer des formats ouverts sans rubric

Impact:

- UX floue et faible valeur pedagogique

Mitigation:

- imposer un contrat rubric avant implementation UI

### Risque 4 - Diluer l'effort sur billing/growth trop tot

Impact:

- coeur produit encore incomplet

Mitigation:

- ne lancer le business stack qu'apres fermeture des chantiers B, C, D et amorce de F

## 8. Definition of Done additionnelle pour la suite

En plus de `ExecutionPlan.md`, chaque ticket des chantiers B a F doit verifier:

- contrat de contenu ou de session mis a jour si le domaine change
- impacts i18n FR/EN listes explicitement
- seed ou fixtures adaptes si le format introduit de nouveaux cas
- au moins un test domaine et un test integration/e2e sur tout nouveau format jouable
- `BuildTracker.md` mis a jour le jour meme

## 9. Recommendation finale

Si un seul axe doit etre attaque tout de suite, ce doit etre:

1. cleanup legacy
2. player multi-format
3. calibration progression

Cet ordre maximise:

- la coherence du produit
- la valeur pedagogique reelle
- la capacite a produire du contenu ensuite sans rework majeur
