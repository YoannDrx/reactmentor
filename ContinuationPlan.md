# React Mentor Continuation Plan

Derniere mise a jour: 9 mars 2026

Document parent:

- [Roadmap.md](./Roadmap.md)
- [ExecutionPlan.md](./ExecutionPlan.md)
- [BuildTracker.md](./BuildTracker.md)
- [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)
- [ContentExpansionTracker.md](./ContentExpansionTracker.md)
- [LearningSystemImprovements.md](./LearningSystemImprovements.md)

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
- `learn` public conserve comme teaser, avec le detail complet maintenant pousse dans `dashboard/learn`
- notes, bookmarks, playlists, billing Stripe, lifecycle email, telemetry et admin contenu v1 deja ouverts
- i18n FR/EN et socle de tests deja en place

Le chemin recommande n'est donc plus de "rajouter des pages".
Le vrai chemin critique devient:

1. sortir totalement du legacy demo et monolingue
2. densifier fortement le contenu `learn`
3. relier cours, verification, pratique, review et recommandations
4. rendre la progression plus robuste, plus explicable et plus visible par concept
5. transformer notes, bookmarks et playlists en vrai workspace d'apprentissage
6. industrialiser la production, la QA et la maintenance editoriale

## 3. Priorites absolues

### P0

- sortir le reliquat `demo-data` des surfaces produit authentifiees
- densifier la bibliotheque `learn` sur React, JavaScript et Frontend Systems
- brancher des checkpoints de comprehension et de pratique autour des cours
- enrichir le tracking d'apprentissage au-dela de la seule tentative
- clarifier les recommandations et recovery plans par concept

### P1

- workspace personnel d'apprentissage
- QA editoriale, deduplication benchmark et production en volume
- analytics pedagogiques et observabilite plus fines
- billing, lifecycle et retention plus intelligents

## 3.1 Ce qui est deja livre et qu'il ne faut plus planifier comme "a faire"

- player multi-format v1 deja livre sur `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT`
- mocks mixed-format deja relies avec timer, reporting et review
- notes, bookmarks et playlists deja exposes
- admin contenu v1 deja exploitable via `/dashboard/admin`
- entitlements, checkout Stripe, portal billing et lifecycle email deja relies

## 3.2 Chantiers actifs recommandes a partir de maintenant

### A. Content scale

- produire des lots editoriaux plus denses dans `prisma/seed.ts`
- suivre la couverture benchmark dans [ContentExpansionTracker.md](./ContentExpansionTracker.md)
- prioriser React advanced, Router, i18n, testing, JavaScript coding et Frontend Systems

### B. Learning system

- relier chaque cours a un mini checkpoint, une pratique ciblee et un plan de recovery
- faire remonter des signaux distincts de lecture, comprehension, restitution et rechute
- expliciter davantage les recommandations du dashboard
- enrichir les formats non-QCM et les prerequis / suites de cours dans `dashboard/learn`

### C. Learning workspace

- faire de notes, bookmarks, playlists et recovery plans une surface personnelle coherente
- permettre de sauvegarder des parcours, des questions a retravailler et des points de blocage

### D. Editorial operations

- industrialiser QA, deduplication benchmark, relecture et maintenance du contenu
- mieux piloter le coverage par niveau, format, surface et famille
- ajouter les actions bulk manquantes autour des nouvelles queues freshness/dedup de l'admin

## 4. Chantiers recommandes

## 4.1 Chantier A - Sortie complete du mode demo cote produit

### Objectif

Supprimer les derniers points de confusion entre:

- donnees localisees reelles
- previews marketing encore basees sur `demo-data.ts`

### Pourquoi maintenant

Ce chantier a une forte valeur de clarification.
Il reduit les decisions floues sur les prochains lots et evite de brancher `learn` et les nouveaux signaux sur une couche UI encore ambigue.

### Tickets recommandes

#### A1 - Sortir `demo-data` des surfaces authentifiees

But:

- garder la landing libre de faire de la mise en scene
- supprimer toute ambiguite dans overview, mock et autres surfaces connectees

Fichiers principaux:

- [src/features/dashboard/dashboard-view-model.ts](/Users/yoannandrieux/Projets/react-mentor/src/features/dashboard/dashboard-view-model.ts)
- [src/app/dashboard/page.tsx](/Users/yoannandrieux/Projets/react-mentor/src/app/dashboard/page.tsx)
- [src/app/dashboard/mock-interviews/page.tsx](/Users/yoannandrieux/Projets/react-mentor/src/app/dashboard/mock-interviews/page.tsx)

Definition of done:

- aucun composant produit authentifie ne depend encore de `demo-data.ts`
- les usages restants sont limites a la landing / auth marketing
- la documentation le dit explicitement

#### A2 - Realigner la documentation centrale

But:

- faire de `README.md`, `ExecutionPlan.md` et `ContinuationPlan.md` des documents compatibles avec l'etat reel du repo

Fichiers principaux:

- [README.md](/Users/yoannandrieux/Projets/react-mentor/README.md)
- [ExecutionPlan.md](/Users/yoannandrieux/Projets/react-mentor/ExecutionPlan.md)
- [ContinuationPlan.md](/Users/yoannandrieux/Projets/react-mentor/ContinuationPlan.md)
- [BuildTracker.md](/Users/yoannandrieux/Projets/react-mentor/BuildTracker.md)

Definition of done:

- l'etat du produit n'est plus decrit comme une fondation demo
- la phase active est clairement `learning system + content scale + QA/ops`

#### A3 - Fiabiliser le setup de verification produit

But:

- eviter que le lot `learn` arrive sur une base de test instable ou ambigue

Definition of done:

- `pnpm typecheck` et `pnpm test:ci` restent verts
- le prochain lot e2e cible explicitement `learn` et les surfaces manquantes
- le `BuildTracker.md` mentionne ces garde-fous

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
