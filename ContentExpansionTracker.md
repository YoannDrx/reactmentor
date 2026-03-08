# React Mentor Content Expansion Tracker

Derniere mise a jour: 8 mars 2026

## 1. Role du document

Ce document est la source de verite pour le programme d'enrichissement editorial de React Mentor.

Il sert a suivre:

- le benchmark externe pris comme reference de densite et de structure
- le contenu educatif deja livre dans React Mentor
- les familles de contenu encore absentes ou sous-couvertes
- le plan de production restant, vague par vague
- les checklists de qualite a respecter avant de marquer un lot comme termine

Regles de travail:

- GreatFrontEnd sert de benchmark de couverture, pas de texte a recopier
- chaque cours React Mentor doit rester original, plus pedagogique et plus progressif
- chaque question doit pouvoir etre comprise par un debutant sans jargon implicite
- chaque lot contenu doit vivre en FR puis en EN
- les checkboxes ne doivent etre cochees que quand le contenu est reellement produit et integre

## 2. Etat reel du produit learn

### 2.1 Ce qui est deja livre

- [x] surface publique `learn` avec page index
- [x] pages collection editoriales
- [x] pages detail question de type cours
- [x] navigation `question precedente / question suivante` a l'interieur d'une collection
- [x] CTA de pratique ciblee depuis une page cours
- [x] liens `Lire le cours` depuis modules, review, bookmarks, notes et mock recovery
- [x] structure editoriale longue sur les questions:
  - `tlDr`
  - `shortAnswer`
  - `lessonBody`
  - `commonMistakes`
  - `exampleTitle`
  - `exampleCode`
  - `exampleExplanation`
  - `verbalizePoints`
- [x] seed editorial bilingue FR/EN branche sur le nouveau modele

### 2.2 Ce qui est deja seme cote contenu

Modules actuellement poses dans le seed:

- `react-rendering-systems`
- `react-core-first-steps`
- `effects-without-superstition`
- `typescript-for-components`
- `react-native-interview-cases`
- `frontend-javascript-foundations`
- `frontend-javascript-coding-patterns`
- `frontend-html-css-essentials`
- `frontend-browser-runtime-fundamentals`
- `react-ui-coding-patterns`
- `react-answer-defense`
- `react-bug-hunt-lab`

Collections editoriales actuellement posees:

- [x] `react-interview-foundations`
- [x] `react-hooks-and-effects`
- [x] `react-answer-defense-starter`
- [x] `react-beginner-first-steps`
- [x] `react-debugging-and-race-conditions`
- [x] `react-state-and-forms-basics`
- [x] `react-refs-and-effect-lifecycle`
- [x] `typescript-react-boundaries`
- [x] `react-native-list-performance`
- [x] `react-list-identity-and-keys`
- [x] `javascript-foundations-for-react-learners`
- [x] `javascript-async-and-promises-core`
- [x] `javascript-coding-patterns-starter`
- [x] `frontend-html-css-interview-essentials`
- [x] `frontend-browser-runtime-and-events`
- [x] `frontend-foundations-beyond-react`
- [x] `react-coding-patterns-starter`
- [x] `react-interaction-and-accessibility-cases`

### 2.3 Ce que ce socle couvre deja

Couverture deja presente dans React Mentor:

- React debutant: JSX, props, state, controlled inputs, lifting state, context
- React hooks: `useEffect`, `useLayoutEffect`, `useRef`, custom hooks, deps arrays
- React debugging: stale async work, cleanup, bug hunts, identity issues
- React coding interview: immutable updates, tabs, modal, custom hook API, `useMemo`
- TypeScript applique a React: `unknown`, inference, frontieres de types
- React Native: `FlatList`, `keyExtractor`, listes longues
- JavaScript fondamental: references, copies, closures, async, promesses, collections
- Front-end systems: semantique HTML, labels, flexbox, specificite, box sizing, events, storage

### 2.4 Ce qui manque encore malgre ce socle

Le programme contenu reste encore incomplet sur:

- React advanced a grande echelle: reconciliation, fiber, suspense, hydration, portals, strict mode, SSR, static generation, HOC, render props, composition
- React Router: routing, nested routes, params, redirects, guards, query params
- React i18n: `react-intl`, `react-i18next`, locale formatting, placeholders
- React testing: Jest, React Testing Library, hooks testing, mocking API, context, Redux, snapshots
- JavaScript interview theorique plus large: hoisting, prototype chain, `this`, coercion, event loop avancee, classes, modules
- JavaScript coding library plus profonde: debounce/throttle, promises utilitaires, DOM helpers, data transforms
- frontend HTML/CSS/JS coverage beaucoup plus large pour atteindre le niveau benchmark
- volume editorial: il faut encore monter tres nettement le nombre de questions et de pages detaillees

## 3. Benchmark de reference GreatFrontEnd

GreatFrontEnd est la reference externe principale pour la densite et la structuration du programme. La page la plus structurante pour React est:

- https://www.greatfrontend.com/blog/100-react-interview-questions-straight-from-ex-interviewers

Sur cette page, la structure macro a reprendre cote React Mentor est claire:

- React fundamentals
- React Hooks
- Advanced concepts
- React Router
- React internationalization
- React testing

Direction retenue pour React Mentor:

- garder cette logique de familles, car elle est lisible pour l'etudiant
- aller plus loin sur la pedagogie debutant
- relier chaque question a un vrai mini-cours et a une pratique ciblee
- ajouter des exemples, des erreurs frequentes et des formulations d'entretien a verbaliser

## 4. Cartographie couverture actuelle vs couverture cible

### 4.1 React fundamentals

Etat:

- [x] socle pose
- [x] plusieurs collections deja en place
- [ ] couverture comparable au benchmark 100+ atteinte

Deja couvert:

- JSX
- props
- state
- controlled vs shared state
- context
- identity et keys

Encore a produire:

- virtual DOM
- reconciliation
- class vs function components
- `createElement` / `cloneElement`
- prop types
- controlled vs uncontrolled plus profond
- pure components / `React.memo`
- one-way data flow plus avance

### 4.2 React hooks

Etat:

- [x] socle pose
- [x] `useEffect`, `useLayoutEffect`, `useRef`, custom hooks deja presents
- [ ] coverage hooks complete atteinte

Encore a produire:

- rules of hooks en profondeur
- `useCallback`
- `useMemo`
- `useReducer`
- `useId`
- callback form de `setState`
- anti-patterns hooks
- strategie de dependencies et stale closures plus exhaustive

### 4.3 React advanced

Etat:

- [ ] encore largement sous-couvert

Priorites:

- Fiber
- Suspense
- hydration
- portals
- strict mode
- code splitting
- context performance
- Flux
- render props
- HOC
- composition
- concurrent rendering
- long tasks / UI responsiveness
- SSR / static generation

### 4.4 React Router

Etat:

- [ ] non commence comme vrai mini-curriculum

Priorites:

- `BrowserRouter` / `HashRouter`
- route params
- nested routes
- programmatic navigation
- guards / private routes
- active route state
- 404
- query params
- redirects

### 4.5 React i18n

Etat:

- [ ] non commence cote bibliotheque pedagogique, malgre l'i18n produit interne

Priorites:

- localiser une app React
- `react-intl`
- `FormattedMessage`
- acces locale courante
- formatage date / nombre
- comparaison `react-intl` / `react-i18next`

### 4.6 React testing

Etat:

- [ ] non commence comme programme learn dedie

Priorites:

- Jest
- React Testing Library
- tests async
- mocks API
- tests de hooks
- custom hooks
- context
- Redux
- snapshot testing
- shallow vs full DOM

### 4.7 JavaScript debutant et theorique

Etat:

- [x] premiere base livree
- [ ] profondeur encore loin du benchmark cumule GreatFrontEnd

Deja couvert:

- references
- shallow copy
- microtask vs timeout
- `Promise.all`
- `map` / `filter` / `reduce`
- closures

Encore a produire:

- hoisting
- scope
- `this`
- prototypes
- coercion
- equality operators
- array/object methods plus larges
- async/await pedagogy
- modules

### 4.8 JavaScript coding interview

Etat:

- [x] amorce livree
- [ ] vraie bibliotheque de coding interview encore a produire

Deja couvert:

- debounce mental model
- mutation imbriquee bug hunt

Encore a produire:

- throttle
- memoize
- event emitter
- Promise helpers
- DOM traversal helpers
- array/object utilities
- petits hooks JS utilitaires

### 4.9 HTML / CSS / Browser

Etat:

- [x] premiere base livree
- [ ] volume encore insuffisant

Deja couvert:

- semantique HTML
- labels
- flexbox
- specificite
- box sizing
- absolute positioning
- `defer`
- event bubbling
- `preventDefault` / `stopPropagation`
- `localStorage` / `sessionStorage`

Encore a produire:

- grid
- stacking context / z-index
- responsive design
- accessibility plus systematique
- forms HTML plus larges
- CSS inheritance / cascade layers / selectors
- browser rendering pipeline

## 5. Plan de production restant

Le plan restant doit etre pilote par vagues editoriales explicites.

### 5.1 Vague A - React fundamentals et hooks a densifier

Statut:

- [x] demarrage effectif
- [ ] vague complete

Livrables attendus:

- [ ] hub React fundamentals vraiment complet
- [ ] hub Hooks complet
- [ ] 40 a 60 questions React fundamentals/hooks au total
- [ ] deduplication entre toutes les sources React
- [ ] niveau `Starter`, `Junior`, `Mid`, `Senior` aligne partout

### 5.2 Vague B - React advanced, Router, i18n, testing

Statut:

- [ ] non commence

Livrables attendus:

- [ ] hub React advanced
- [ ] hub React Router
- [ ] hub React i18n
- [ ] hub React testing
- [ ] pages cours detaillees pour chaque sous-famille
- [ ] premiers exercices pratiques relies

### 5.3 Vague C - JavaScript fundamentals pour candidats React

Statut:

- [x] amorce livree
- [ ] vague complete

Livrables attendus:

- [ ] hub JavaScript fundamentals complet
- [ ] lot debutant / fresher complet
- [ ] lot theorie entretien complet
- [ ] pages cours tres progressives, sans jargon implicite

### 5.4 Vague D - JavaScript coding interview library

Statut:

- [ ] largement a produire

Livrables attendus:

- [ ] hub JavaScript coding
- [ ] exercices avec indice progressif
- [ ] solution courte
- [ ] solution detaillee pas a pas
- [ ] section "comment en parler en entretien"

### 5.5 Vague E - HTML, CSS et browser runtime

Statut:

- [x] amorce livree
- [ ] vague complete

Livrables attendus:

- [ ] hub HTML/CSS/JS essentials
- [ ] lot accessibilite
- [ ] lot layout et rendering browser
- [ ] lot events et forms
- [ ] lot performance navigateur

### 5.6 Vague F - React coding interview practice

Statut:

- [x] premier lot livre
- [ ] encore tres incomplet

Livrables attendus:

- [ ] bibliotheque d'exercices React coding de niveau debutant a senior
- [ ] corrections guidees par etapes
- [ ] design discussions pour chaque exercice
- [ ] reponses axe "tradeoffs" pour niveau senior

### 5.7 Vague G - Pedagogie et finition premium

Statut:

- [ ] non commence comme chantier structure

Livrables attendus:

- [ ] questions de verification en bas de chaque cours
- [ ] diagrams ou schemas textuels la ou utile
- [ ] liens "cours associes" et "questions associees"
- [ ] signaux "deja etudie", "a revoir", "recommande"
- [ ] QA pedagogique FR puis EN
- [ ] revue coherence entre learn, modules, sessions et playlists

## 6. Barriere de qualite obligatoire par question

Une question React Mentor ne doit pas etre consideree "terminee" sans ce bloc minimum:

- [x] prompt d'entretien clair
- [x] `tlDr`
- [x] reponse courte directement reutilisable en entretien
- [x] explication longue pensee pour debutant
- [x] liste d'erreurs frequentes
- [x] exemples de code quand le sujet s'y prete
- [x] points a verbaliser a l'oral
- [ ] mini-verification ou exercice de consolidation
- [ ] liens vers cours voisins ou parcours associes
- [ ] revue pedagogique FR
- [ ] mirror EN relu

## 7. Tracker des sources benchmark

### 7.1 Top 30 React Interview Questions and Answers

Source:

- https://www.greatfrontend.com/blog/top-30-reactjs-interview-questions-and-answers

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] themes principaux deja amorces dans React Mentor
- [ ] couverture equivalente atteinte

Themes cibles:

- fundamentals React
- props / state / JSX
- data flow
- premiers hooks

### 7.2 10 Must-know JavaScript Coding Interview Questions

Source:

- https://www.greatfrontend.com/blog/10-must-know-javascript-coding-interview-questions

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe JavaScript coding demarre
- [ ] couverture equivalente atteinte

### 7.3 Basic JavaScript Interview Questions and Answers For Freshers

Source:

- https://www.greatfrontend.com/blog/basic-javascript-interview-questions-and-answers-for-freshers

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe JavaScript debutant demarre
- [ ] couverture equivalente atteinte

### 7.4 Practice 50 React Coding Interview Questions with Solutions

Source:

- https://www.greatfrontend.com/blog/practice-50-react-coding-interview-questions-with-solutions

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe React coding demarre
- [ ] bibliotheque React coding mature atteinte

### 7.5 50 Essential React.js Interview Questions

Source:

- https://www.greatfrontend.com/blog/50-essential-reactjs-interviews-questions

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe React essentials demarre
- [ ] couverture equivalente atteinte

### 7.6 30 Essential React Hooks Interview Questions You Must Know

Source:

- https://www.greatfrontend.com/blog/30-essential-react-hooks-interview-questions-you-must-know

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe hooks demarre
- [ ] couverture equivalente atteinte

### 7.7 50 Must-know HTML, CSS and JavaScript Interview Questions

Source:

- https://www.greatfrontend.com/blog/50-must-know-html-css-and-javascript-interview-questions-by-ex-interviewers

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe frontend systems demarre
- [ ] couverture equivalente atteinte

### 7.8 30 Basic to Advanced React Interview Questions with Solutions

Source:

- https://www.greatfrontend.com/blog/30-basic-to-advanced-react-interview-questions-with-solutions

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] progression debutant -> avance deja amorcee
- [ ] progression complete atteinte

### 7.9 50 Must-know JavaScript Interview Questions

Source:

- https://www.greatfrontend.com/blog/50-must-know-javascript-interview-questions-by-ex-interviewers

Etat benchmark:

- [ ] source analysee ligne a ligne
- [x] axe JavaScript theorique demarre
- [ ] couverture equivalente atteinte

### 7.10 100+ React Interview Questions Straight from Ex-interviewers

Source:

- https://www.greatfrontend.com/blog/100-react-interview-questions-straight-from-ex-interviewers

Etat benchmark:

- [x] structure macro analysee
- [x] categories majeures extraites
- [ ] priorisation complete question par question
- [ ] couverture equivalente atteinte

Categories a couvrir cote React Mentor:

- [ ] fundamentals
- [ ] hooks
- [ ] advanced concepts
- [ ] router
- [ ] internationalization
- [ ] testing

## 8. Decision produit

La bonne direction n'est pas de cloner GreatFrontEnd.

La bonne direction est:

- reprendre le niveau d'ambition en volume
- garder une structure de bibliotheque simple a parcourir
- ajouter une couche pedagogique plus forte que le benchmark
- relier chaque question a un vrai apprentissage progressif
- transformer la bibliotheque en moteur de progression, pas seulement en liste d'articles
