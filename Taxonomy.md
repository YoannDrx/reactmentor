# React Mentor Taxonomy

Derniere mise a jour: 6 mars 2026

Statut: source officielle pour `L0-01`

## 1. Role du document

Ce document fixe la taxonomie officielle v1 de React Mentor.

Il sert a verrouiller:

- les tracks
- les modules
- les skills
- les tags de pieges
- les conventions de nommage
- les niveaux et difficultes
- les formats de questions

Ce document doit etre considere comme la reference officielle pour:

- le schema Prisma
- le seed de contenu
- les filtres catalogue
- les pages modules
- l'admin de contenu
- la progression par skill

## 2. Principes de taxonomie

### 2.1 Structure

La hierarchie officielle est:

1. Track
2. Module
3. Skill
4. Question
5. Option / correction / pitfall tags

### 2.2 Regles de design

La taxonomie doit:

- refleter les vrais signaux d'entretien
- rester assez compacte pour etre maintenable
- eviter les doublons entre skills
- permettre une progression par competence
- fonctionner aussi bien en FR qu'en EN

### 2.3 Conventions de slug

Regles:

- slugs en anglais uniquement
- kebab-case uniquement
- pas d'abbreviations ambigues
- un slug doit rester stable dans le temps

Exemples:

- `react-rendering-systems`
- `effect-mental-model`
- `stale-closures`

## 3. Tracks officiels v1

Les tracks officiels v1 sont:

1. `REACT`
2. `REACT_NATIVE`
3. `TYPESCRIPT`
4. `FRONTEND_SYSTEMS`

### 3.1 REACT

But:

- renforcer les modeles mentaux React
- preparer aux questions de rendu, state, hooks, perf et architecture de composants

### 3.2 REACT_NATIVE

But:

- preparer aux specifics mobile et RN
- couvrir layout, navigation, performance et plateformes

### 3.3 TYPESCRIPT

But:

- preparer aux questions de typage React et TypeScript avance
- couvrir inference, generics, constraints et design d'APIs

### 3.4 FRONTEND_SYSTEMS

But:

- couvrir testing, architecture front, performance globale et system design front-end

## 4. Modules officiels v1

Les modules ci-dessous sont la liste officielle v1.

`Priority`

- `P0`: module coeur a produire d'abord
- `P1`: module v1 etendu

### 4.1 Track REACT

#### Module 1

- slug: `react-rendering-systems`
- title: `React Rendering Systems`
- priority: `P0`
- level: `MID`
- purpose: comprendre rendering, identity, reconciliation et causes de rerender

Skills officielles:

- `rendering-and-identity`
- `reconciliation-and-keys`
- `rerender-causes`
- `derived-state`
- `context-boundaries`

#### Module 2

- slug: `effects-without-superstition`
- title: `Effects Without Superstition`
- priority: `P0`
- level: `SENIOR`
- purpose: sortir des reponses floues sur `useEffect`, les deps, les closures et la synchronisation

Skills officielles:

- `effect-mental-model`
- `dependency-arrays`
- `stale-closures`
- `synchronization-vs-events`
- `refs-and-escape-hatches`

#### Module 3

- slug: `state-and-data-flow`
- title: `State and Data Flow`
- priority: `P1`
- level: `MID`
- purpose: raisonner proprement sur local state, shared state, derived state et state architecture

Skills officielles:

- `local-vs-shared-state`
- `state-normalization`
- `derived-vs-source-of-truth`
- `controlled-vs-uncontrolled-inputs`
- `context-state-architecture`

#### Module 4

- slug: `react-performance-systems`
- title: `React Performance Systems`
- priority: `P1`
- level: `SENIOR`
- purpose: parler performance de maniere precise au lieu de citer `useMemo` partout

Skills officielles:

- `memoization-strategy`
- `profiling-and-bottlenecks`
- `list-performance`
- `expensive-render-paths`
- `server-client-boundaries`

### 4.2 Track TYPESCRIPT

#### Module 5

- slug: `typescript-for-components`
- title: `TypeScript for Components`
- priority: `P0`
- level: `MID`
- purpose: typer proprement les composants, props et APIs React

Skills officielles:

- `props-typing`
- `children-and-composition-typing`
- `generic-components`
- `polymorphic-components`
- `event-and-ref-typing`

#### Module 6

- slug: `typescript-type-systems-for-ui`
- title: `TypeScript Type Systems for UI`
- priority: `P1`
- level: `SENIOR`
- purpose: couvrir le niveau avance de TS utile en entretien front

Skills officielles:

- `narrowing-and-control-flow`
- `conditional-types`
- `mapped-and-utility-types`
- `constraints-and-inference`
- `api-surface-design`

### 4.3 Track REACT_NATIVE

#### Module 7

- slug: `react-native-interview-cases`
- title: `React Native Interview Cases`
- priority: `P0`
- level: `MID`
- purpose: couvrir les questions RN les plus probables en entretien

Skills officielles:

- `rn-layout-and-flexbox`
- `rn-navigation-flows`
- `rn-lists-and-flatlist`
- `rn-platform-specifics`
- `rn-screen-architecture`

#### Module 8

- slug: `react-native-performance-and-platforms`
- title: `React Native Performance and Platforms`
- priority: `P1`
- level: `SENIOR`
- purpose: traiter la perf RN, les bridges et les compromis mobiles

Skills officielles:

- `rn-performance-diagnostics`
- `rn-gesture-and-animation-tradeoffs`
- `rn-native-interop`
- `rn-memory-and-rendering`
- `rn-offline-and-device-constraints`

### 4.4 Track FRONTEND_SYSTEMS

#### Module 9

- slug: `frontend-testing-systems`
- title: `Frontend Testing Systems`
- priority: `P1`
- level: `MID`
- purpose: preparer aux questions de tests React et de strategie de verification

Skills officielles:

- `testing-library-mental-model`
- `integration-vs-unit-tests`
- `mocks-and-boundaries`
- `async-ui-testing`
- `hooks-and-component-test-strategy`

#### Module 10

- slug: `frontend-architecture-and-system-design`
- title: `Frontend Architecture and System Design`
- priority: `P1`
- level: `SENIOR`
- purpose: preparer aux questions d'architecture, data flows et system design front

Skills officielles:

- `ui-boundaries-and-composition`
- `frontend-state-architecture`
- `data-fetching-and-cache`
- `error-loading-and-resilience`
- `frontend-system-tradeoffs`

## 5. Skills officielles v1

Cette section regroupe la liste aplatie des skills officielles.
Une skill appartient a un module principal, meme si elle peut etre referencee secondairement ailleurs.

### 5.1 Skills React

- `rendering-and-identity`
- `reconciliation-and-keys`
- `rerender-causes`
- `derived-state`
- `context-boundaries`
- `effect-mental-model`
- `dependency-arrays`
- `stale-closures`
- `synchronization-vs-events`
- `refs-and-escape-hatches`
- `local-vs-shared-state`
- `state-normalization`
- `derived-vs-source-of-truth`
- `controlled-vs-uncontrolled-inputs`
- `context-state-architecture`
- `memoization-strategy`
- `profiling-and-bottlenecks`
- `list-performance`
- `expensive-render-paths`
- `server-client-boundaries`

### 5.2 Skills TypeScript

- `props-typing`
- `children-and-composition-typing`
- `generic-components`
- `polymorphic-components`
- `event-and-ref-typing`
- `narrowing-and-control-flow`
- `conditional-types`
- `mapped-and-utility-types`
- `constraints-and-inference`
- `api-surface-design`

### 5.3 Skills React Native

- `rn-layout-and-flexbox`
- `rn-navigation-flows`
- `rn-lists-and-flatlist`
- `rn-platform-specifics`
- `rn-screen-architecture`
- `rn-performance-diagnostics`
- `rn-gesture-and-animation-tradeoffs`
- `rn-native-interop`
- `rn-memory-and-rendering`
- `rn-offline-and-device-constraints`

### 5.4 Skills Frontend Systems

- `testing-library-mental-model`
- `integration-vs-unit-tests`
- `mocks-and-boundaries`
- `async-ui-testing`
- `hooks-and-component-test-strategy`
- `ui-boundaries-and-composition`
- `frontend-state-architecture`
- `data-fetching-and-cache`
- `error-loading-and-resilience`
- `frontend-system-tradeoffs`

## 6. Pitfall tags officiels v1

Ces tags servent a qualifier les confusions frequentes, pas a classer le sujet principal.

Liste officielle v1:

- `rerender-vs-remount`
- `reference-equality`
- `identity-instability`
- `derived-state-misuse`
- `stale-closure`
- `dependency-array-confusion`
- `effect-vs-event`
- `premature-memoization`
- `context-overreach`
- `generic-constraint-confusion`
- `type-inference-leak`
- `union-narrowing-gap`
- `testing-implementation-detail`
- `async-assertion-flakiness`
- `flatlist-performance`
- `navigation-state-confusion`
- `platform-specific-assumption`
- `cache-invalidation-gap`
- `error-boundary-confusion`
- `architecture-overengineering`

## 7. Niveaux officiels

Les niveaux officiels pour les questions et modules:

- `JUNIOR`
- `MID`
- `SENIOR`

### 7.1 Definition par niveau

`JUNIOR`

- fondamentaux
- vocabulaire correct
- comprehension de base des mecanismes

`MID`

- bonne precision
- capacite a expliquer des compromis
- moins d'erreurs de modele mental

`SENIOR`

- precision technique forte
- explication des tradeoffs
- gestion des edge cases
- articulation architecture + performance + DX

## 8. Difficultes officielles

La difficulte est separee du niveau.

Echelle officielle:

- `1`: recall simple
- `2`: comprehension simple
- `3`: application courante
- `4`: piege recurrent ou edge case
- `5`: tradeoff complexe ou precision senior

## 9. Formats de question officiels v1

Formats officiels:

- `SINGLE_CHOICE`
- `MULTIPLE_CHOICE`
- `CODE_OUTPUT`
- `BUG_HUNT`
- `OPEN_ENDED`

Formats editoriaux autorises mais mappes sur les formats ci-dessus:

- architecture choice -> `OPEN_ENDED` ou `MULTIPLE_CHOICE`
- explain this snippet -> `CODE_OUTPUT` ou `OPEN_ENDED`

## 10. Status editoriaux officiels

Statuts de contenu recommandes:

- `DRAFT`
- `IN_REVIEW`
- `PUBLISHED`
- `ARCHIVED`

Statuts de traduction recommandes:

- `MISSING`
- `IN_PROGRESS`
- `REVIEW`
- `READY`

## 11. Regles de mapping question -> taxonomie

Chaque question doit avoir:

- 1 module principal obligatoire
- 1 skill principale obligatoire
- 0..n skills secondaires optionnelles
- 0..n pitfall tags
- 1 niveau
- 1 difficulte
- 1 format

Regles:

- une question ne change pas de module sans vraie raison editoriale
- une skill principale doit refleter l'intention pedagogique centrale
- les pitfall tags servent a expliquer les erreurs, pas a remplacer la skill principale

## 12. Priorite de production contenu

Ordre recommande de production:

1. `react-rendering-systems`
2. `effects-without-superstition`
3. `typescript-for-components`
4. `react-native-interview-cases`
5. `state-and-data-flow`
6. `frontend-testing-systems`
7. `react-performance-systems`
8. `frontend-architecture-and-system-design`
9. `typescript-type-systems-for-ui`
10. `react-native-performance-and-platforms`

## 13. Regles de maintenance

Toute evolution de taxonomie doit:

- etre documentee ici
- preciser si elle casse un slug existant
- preciser l'impact sur seed, filtres, admin et analytics
- etre accompagnee d'un plan de migration si necessaire

## 14. Decision lot 0

`L0-01 - Figer la taxonomie officielle`

Statut: `DONE`

Decision:

- les 4 tracks sont confirmes
- les 10 modules v1 sont officialises
- les skills prioritaires sont listees
- les pitfall tags v1 sont fixes
- les conventions de slug, niveau, difficulte et format sont verrouillees
