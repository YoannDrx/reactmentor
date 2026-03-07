# React Mentor Roadmap

Derniere mise a jour: 7 mars 2026

## 1. Role du document

Ce document sert de ligne directrice produit, contenu et technique pour faire evoluer React Mentor d'une base SaaS premium deja tres bien posee vers une vraie plateforme de formation aux entretiens React, React Native, TypeScript et Frontend Systems.

Le but n'est pas seulement d'empiler des features. Le but est de construire un systeme d'apprentissage capable de:

- diagnostiquer les lacunes reelles d'un candidat
- transformer ces lacunes en plan d'entrainement concret
- entrainer a la fois la reconnaissance, la restitution et l'argumentation
- montrer une progression par competence, pas juste par completion
- donner une experience premium suffisamment forte pour devenir un vrai produit SaaS

Ce document doit etre utilise comme:

- reference produit
- backlog de haut niveau
- base de discussion avant chaque lot de developpement
- garde-fou contre le scope creep

Documents de pilotage associes:

- [ExecutionPlan.md](./ExecutionPlan.md)
- [BuildTracker.md](./BuildTracker.md)
- [Taxonomy.md](./Taxonomy.md)
- [ContentContract.md](./ContentContract.md)
- [DashboardReadModel.md](./DashboardReadModel.md)

## 2. Etat des lieux du projet

### 2.1 Ce qui existe deja

Le projet dispose maintenant d'une vraie base produit exploitable:

- landing page premium, brandee, bilingue FR/EN
- auth Better Auth avec email/password et provider Google si configure
- dashboard protege avec sidebar retractable, shell localise et recommandations dynamiques
- onboarding first-run et settings relies aux preferences utilisateur
- catalogue modules, detail module et couche contenu Prisma localisee FR/EN
- dashboard overview, progress, review et mock relies a de vraies agregations Prisma
- moteur de session v1 pour practice, review et mock interviews
- player single-choice avec correction immediate, recovery inline et progression persistante
- engine `QuestionProgress` et `SkillProgress` avec repetition espacee et score de maitrise pondere
- mocks chronometres avec timer live, auto-cloture, rapport de fin et historique reel
- Prisma schema solide pour utilisateurs, contenu bilingue, progression et training sessions
- seed editorial bilingue pour amorcer les premiers modules
- i18n pour l'ensemble de la couche UI actuelle
- tests unitaires domaine/auth, e2e auth/dashboard/practice/mock et CI GitHub Actions

### 2.2 Ce qui reste encore faux, partiel ou simule

Le projet n'est plus une simple demo, mais plusieurs zones restent inachevees:

- certains residus de `demo-data.ts` subsistent encore dans la couche marketing et quelques view models de transition
- le modele legacy monolingue reste encore present dans le schema et certains fallbacks
- le player reste limite au format single-choice; multi-choice, code output, bug hunt et open-ended ne sont pas encore jouables
- le builder mock s'appuie encore sur des presets single-choice et n'assemble pas encore de formats mixtes
- la calibration long terme de `SkillProgress` reste a enrichir par davantage de signaux et de seuils d'acceptation
- il n'existe pas encore d'admin de contenu exploitable, ni d'operations editoriales robustes
- notes, bookmarks, playlists et appropriation personnelle ne sont pas encore ouvertes
- il n'existe pas encore de billing, d'entitlements ou de plans d'abonnement
- les reponses ouvertes guidees et les rubrics mock ne sont pas encore disponibles

### 2.3 Conclusion de l'audit

React Mentor n'est plus seulement une fondation credible. C'est deja une vertical slice produit reelle.

Le chantier principal n'est donc plus "brancher les premieres vraies donnees". Le chantier principal devient:

- terminer la sortie du legacy demo / monolingue
- etendre les formats pedagogiques et les mocks au-dela du single-choice
- industrialiser la production de contenu et les operations editoriales
- ouvrir les couches d'appropriation personnelle et, plus tard, la monetisation

### 2.4 Points d'ancrage actuels du repo

Les futures evolutions doivent respecter les fondations deja posees:

- `src/features/landing/landing-page.tsx` pour la narration marketing
- `src/features/dashboard/dashboard-shell.tsx` pour la structure cockpit et la navigation
- `src/features/dashboard/dashboard-view-model.ts` comme zone de transition entre donnees de demo et vraies agregations
- `src/features/dashboard/dashboard-read-model.ts` et `src/features/dashboard/dashboard-shell-data.ts` pour les agregations dashboard et les recommandations
- `src/features/auth/*` pour les flows d'entree
- `src/features/onboarding/*`, `src/features/settings/*` et `src/features/sessions/*` pour les vertical slices deja live
- `src/i18n/messages/*` pour la logique de traduction UI
- `src/lib/auth.ts` et `src/lib/auth-client.ts` pour l'auth Better Auth
- `src/lib/content-repository.ts` comme couche d'acces au contenu localise
- `prisma/schema.prisma` comme base du modele metier
- `prisma/seed.ts` pour le seed editorial initial
- `__tests__/*`, `e2e/*`, `vitest.config.mjs` et `playwright.config.ts` pour la couverture de qualite

Implication:

- il faut faire evoluer le projet par extension de ces fondations
- il faut eviter les doublons de patterns
- il faut garder un alignement fort entre UX, schema Prisma, i18n et tests

## 3. These produit

React Mentor doit etre pense comme un cockpit d'entrainement, pas comme une banque de QCM.

La promesse centrale doit rester:

"Tu ne coches pas juste une bonne reponse. Tu apprends a expliquer pourquoi elle est bonne, pourquoi les autres sont fausses, et comment verbaliser tout ca en entretien."

## 4. Principes directeurs

### 4.1 Qualite du contenu avant tout

Le moat principal du produit n'est pas la techno.
Le moat principal, c'est la qualite editoriale:

- formulation des questions
- qualite des distracteurs
- profondeur des explications
- pertinence des takeaways
- capacite a reveler un mauvais modele mental

### 4.2 Progression par competence

Le dashboard ne doit jamais se resumer a:

- "tu as fait 62%"
- "tu as 8 jours de streak"

Il doit repondre a:

- sur quoi tu es solide
- sur quoi tu es fragile
- qu'est-ce qui doit etre revise aujourd'hui
- quel type de signal te penaliserait en entretien

### 4.3 Le bon niveau de realisme

Le produit doit evoluer par couches:

- d'abord recognition training
- ensuite recall training
- ensuite mock interview sous contrainte

Il ne faut pas lancer trop tot des features pseudo-IA si la base editoriale n'est pas encore excellente.

### 4.4 Premium sans surcharge

L'interface doit rester dense, design et premium, mais jamais confuse.

Chaque page doit repondre a un vrai besoin.
Si une carte n'aide pas a agir, elle ne merite pas sa place.

### 4.5 Bilingue by design

La plateforme doit continuer a traiter l'i18n comme une contrainte structurante.

Cela veut dire:

- UI localisable
- contenu pedagogique localisable
- emails localisables
- contenus marketing localisables

## 5. Personas et jobs to be done

### 5.1 Persona A - React Developer Junior

Profil:

- 0 a 2 ans d'experience
- besoin d'ancrer les fondamentaux
- stress fort en entretien

Jobs to be done:

- comprendre React sans folklore
- identifier les trous dans les bases
- pratiquer des questions typiques junior / mid

### 5.2 Persona B - Frontend Mid/Senior

Profil:

- experience reelle en prod
- reussit souvent les basics mais manque de precision sur les edge cases

Jobs to be done:

- solidifier perf, architecture, hooks, TypeScript avance
- passer du "je sais globalement" a "je peux le defendre en entretien"

### 5.3 Persona C - React Native Developer

Profil:

- bon niveau sur mobile
- besoin de preparation ciblee pour RN

Jobs to be done:

- revoir layout, navigation, perf de listes, specifics plateforme
- articuler les compromis entre RN et web

### 5.4 Persona D - Candidat en sprint de recherche

Profil:

- candidature imminente
- besoin d'un plan d'entrainement court et intense

Jobs to be done:

- savoir quoi reviser maintenant
- enchainer practice, review et mock rapidement

## 6. Experience cible de bout en bout

### 6.1 Parcours public

Un visiteur arrive sur la landing et comprend immediatement:

- a qui s'adresse React Mentor
- pourquoi ce n'est pas un simple quiz
- ce qu'il va gagner concretement
- comment commencer

La landing doit vendre:

- la profondeur pedagogique
- la progression par skill
- la simulation d'entretien
- la valeur premium du produit

### 6.2 Parcours d'entree

Apres signup ou sign-in:

- l'utilisateur arrive soit sur un mini onboarding, soit sur un dashboard preconfigure
- il choisit son role cible, son niveau cible, ses tracks, son rythme, sa deadline
- la plateforme lui propose une premiere session recommandee

### 6.3 Parcours d'entrainement

Le coeur du produit doit suivre cette boucle:

1. choisir ou recevoir une session
2. repondre
3. comprendre
4. memoriser les points importants
5. revoir plus tard
6. mesurer le gain reel

### 6.4 Parcours de diagnostic

Le dashboard doit servir a savoir:

- quelles skills sont fragiles
- quelles erreurs reviennent
- quels modules ont besoin de repetition
- quel type de mock lancer ensuite

### 6.5 Parcours de conversion

La version gratuite doit suffire a prouver la valeur.
La version payante doit debloquer:

- plus de contenu
- plus de mocks
- plus d'analyse
- plus de plans de revision

## 7. Architecture fonctionnelle cible

### 7.1 Surface publique

Routes cibles:

- `/`
- `/pricing`
- `/tracks`
- `/blog` ou `/resources`
- pages SEO par track / skill / concept

Mission:

- acquisition
- conversion
- education du marche

### 7.2 Surface authentifiee

Routes cibles:

- `/dashboard`
- `/dashboard/modules`
- `/dashboard/modules/[slug]`
- `/dashboard/session/[id]`
- `/dashboard/review`
- `/dashboard/mock-interviews`
- `/dashboard/progress`
- `/dashboard/settings`
- `/dashboard/notes`
- `/dashboard/bookmarks`

Mission:

- apprendre
- suivre
- reviser
- se preparer a parler

### 7.3 Surface admin/editoriale

Routes cibles:

- `/admin`
- `/admin/modules`
- `/admin/skills`
- `/admin/questions`
- `/admin/questions/new`
- `/admin/questions/[id]`
- `/admin/translations`
- `/admin/reviews`
- `/admin/import`

Mission:

- produire du contenu de qualite
- maintenir l'i18n
- eviter le chaos editorial

## 8. Architecture pedagogique cible

### 8.1 Tracks

Les tracks prioritaires doivent rester:

- React
- React Native
- TypeScript
- Frontend Systems

`Frontend Systems` doit couvrir:

- testing
- performance
- architecture front
- data fetching
- rendering pipeline
- state management patterns

### 8.2 Modules par track

Base recommandee:

- React Core
- Hooks and Effects
- State and Data Flow
- React Performance
- Testing React Applications
- TypeScript for React
- React Native Fundamentals
- React Native Performance
- Frontend Architecture
- Frontend System Design

### 8.3 Skills

Chaque module doit etre decoupe en skills precises.
Exemples:

- rendering and identity
- reconciliation and keys
- derived state
- stale closures
- dependency arrays
- refs and imperative escape hatches
- memoization strategy
- TypeScript inference
- discriminated unions
- polymorphic components
- FlatList performance
- React Testing Library mental model
- cache and invalidation

### 8.4 Formats de questions

Les formats a supporter:

- single choice
- multiple choice
- code output
- bug hunt
- open ended
- architecture choice
- explain this snippet

### 8.5 Structure editoriale obligatoire d'une question

Une question publiee ne doit pas etre un simple prompt avec une bonne reponse.
Elle doit contenir:

- enonce
- contexte
- niveau et difficulte
- skill principale
- skills secondaires
- format
- options si format ferme
- bonne reponse
- explication principale
- explication de chaque mauvaise reponse
- takeaways
- tags de pieges
- references eventuelles
- traduction FR/EN

### 8.6 Definition de la maitrise

Une question correctement repondue une fois n'est pas "maitrisee".

La maitrise doit dependre de:

- historique de reussite
- recence
- difficulte
- confiance eventuelle
- repetition sur plusieurs sessions

## 9. Gaps techniques a adresser avant les grosses features

### 9.1 Fin des donnees de demo

Le dashboard doit progressivement migrer de `demo-data.ts` vers des queries server-side reelles.

### 9.2 Localisation du contenu pedagogique

Le schema Prisma actuel localise bien la chrome UI via l'i18n applicative, mais pas encore le contenu vivant.

Il faudra introduire soit:

- des tables de traduction

ou

- des colonnes JSON localisees

Recommandation:

- tables de traduction dediees pour modules, skills, questions et options

### 9.3 Rich content

Les champs `prompt` et `explanation` devront probablement evoluer vers:

- markdown / mdx
- ou structure JSON de blocs

pour supporter:

- snippets de code
- listes
- callouts
- references
- exemples compares

### 9.4 Tracking produit

Il manque encore une couche d'evenements produit.
Il faudra suivre:

- session started
- question answered
- answer corrected
- review completed
- mock completed
- conversion events

## 10. Phases de roadmap

| Phase | Objectif | Resultat concret |
| --- | --- | --- |
| Phase 0 | Fondation deja en place | landing, auth, i18n UI, dashboard shell, schema, tests auth, CI |
| Phase 1 | Rendre le produit reel | onboarding, vrai catalogue, vraies requetes, vrai moteur de session |
| Phase 2 | Installer la pedagogie | player de questions, corrections profondes, review queue, mastery |
| Phase 3 | Installer la valeur premium | mock interviews, notes, recommandations, plan de revision |
| Phase 4 | Industrialiser le contenu | admin, import, traduction, QA editoriale, versioning |
| Phase 5 | Activer le business | billing, emails lifecycle, acquisition SEO, analytics |

## 11. Backlog detaille par epic et tickets

## EPIC RM-100 - Core Product Foundation

### RM-101 - Onboarding cible et preferences utilisateur [P0]

Objectif:
Transformer le premier login en configuration utile.

Fonctionnement attendu:

- l'utilisateur choisit son niveau cible
- l'utilisateur choisit ses tracks prioritaires
- l'utilisateur indique son objectif hebdomadaire
- l'utilisateur peut indiquer une deadline d'entretien ou de candidature
- l'utilisateur obtient un premier plan de travail

Donnees impliquees:

- `UserPreference`
- eventuelle table `StudyGoal` si on veut historiser

Criteres d'acceptation:

- onboarding visible au premier passage apres signup
- possibilite de le reprendre plus tard dans settings
- dashboard personalise a partir des choix
- recommandations de modules coherentes avec les tracks choisis

### RM-102 - Passage du dashboard de la demo aux vraies agregations [P0]

Objectif:
Faire du dashboard un vrai cockpit et non une projection statique.

Fonctionnement attendu:

- les stats overview viennent de la base
- la review queue vient de `QuestionProgress`
- les recent sessions viennent de `TrainingSession`
- les graphes viennent des vraies tentatives

Donnees impliquees:

- `Attempt`
- `QuestionProgress`
- `SkillProgress`
- `TrainingSession`

Criteres d'acceptation:

- suppression progressive de la dependance a `demo-data.ts`
- chargement server-side des vraies metriques
- comportement correct pour nouvel utilisateur sans donnees

### RM-103 - Gestion complete du cycle de vie du compte [P1]

Objectif:
Completer l'auth au-dela du simple sign-in/sign-up.

Fonctionnement attendu:

- reset password
- verification email si necessaire
- gestion du profil
- liaison / deliaison de providers sociaux
- suppression de compte

Notes produit:

- ne pas surinvestir avant que le coeur de l'app soit reel
- mais ne pas laisser une auth "moitie finie" si l'app devient publique

Criteres d'acceptation:

- flows testes
- messages localises
- UX claire en settings

### RM-104 - Modele de donnees bilingue pour le contenu [P0]

Objectif:
Permettre au contenu pedagogique d'exister proprement en FR et EN.

Recommandation de schema:

- `LearningModuleTranslation`
- `SkillTranslation`
- `QuestionTranslation`
- `QuestionOptionTranslation`

Chaque traduction doit contenir:

- `locale`
- `title`
- `summary`
- `description`
- `prompt`
- `explanation`
- `takeaways`

Criteres d'acceptation:

- aucune question n'est bloquee sur une seule langue
- fallback propre si une traduction manque
- admin capable de voir les statuts de traduction

## EPIC RM-200 - Catalogue et architecture de contenu

### RM-201 - Catalogue reel des modules [P0]

Objectif:
Faire de `/dashboard/modules` un vrai point d'entree pedagogique.

Fonctionnement attendu:

- listing reel des modules
- filtres par track, niveau, skill, format, statut
- progression reelle par module
- recommandation "quoi faire ensuite"

Contenu souhaite:

- titre
- summary
- niveau
- focus skills
- nombre de questions
- temps estime
- statut utilisateur

Criteres d'acceptation:

- un utilisateur peut trouver un module adapte sans friction
- les filtres sont persistants dans l'URL
- le catalogue fonctionne dans les deux langues

### RM-202 - Page detail module [P0]

Objectif:
Donner une vraie page de preparation avant de lancer une session.

Fonctionnement attendu:

- objectifs du module
- skills couvertes
- prerequis
- difficultes frequentes
- progression actuelle
- CTA pour lancer practice, review ou mock cible

Criteres d'acceptation:

- route `/dashboard/modules/[slug]`
- info pedagogique utile
- CTA de session fonctionnels

### RM-203 - Taxonomie editoriale verrouillee [P0]

Objectif:
Eviter que le contenu parte dans tous les sens.

Decisions a prendre et a figer:

- liste officielle des tracks
- liste officielle des modules
- convention de nommage des skills
- systeme de difficultes
- systeme de niveaux
- liste de tags de pieges

Criteres d'acceptation:

- document de taxonomie stable
- validation admin qui interdit les contenus hors convention

## EPIC RM-300 - Moteur de session d'entrainement

### RM-301 - Session builder [P0]

Objectif:
Permettre de composer une session utile a partir du contexte de l'utilisateur.

Fonctionnement attendu:

- choix du mode: practice, review, mock
- choix du nombre de questions
- choix de la difficulte
- choix des tracks / modules / skills
- prise en compte de la review queue

Donnees impliquees:

- `TrainingSession`
- `TrainingSessionItem`
- `Question`
- `QuestionProgress`

Criteres d'acceptation:

- une session peut etre creee depuis plusieurs points d'entree
- la session est reprise apres refresh
- les questions ne se repetent pas de maniere absurde

### RM-302 - Selection intelligente des questions [P0]

Objectif:
Faire en sorte que les sessions aient du sens pedagogiquement.

Logique attendue:

- melanger nouveaute, consolidation et revision
- ponderer selon la fragilite d'une skill
- limiter les doublons trop proches
- permettre des presets tres cibles

Approche:

- v1 regles deterministes
- v2 scoring plus intelligent base sur l'historique

Criteres d'acceptation:

- logique explicable
- session coherente pour debutant comme pour utilisateur avance

### RM-303 - Rapport de fin de session [P0]

Objectif:
Fermer proprement la boucle d'apprentissage.

Le rapport doit montrer:

- score
- temps
- skills touchees
- erreurs frequentes
- questions a revoir
- recommandation de prochaine action

Criteres d'acceptation:

- rapport distinct selon mode practice / review / mock
- liens directs vers review queue ou module recommande

## EPIC RM-400 - Player de questions et correction

### RM-401 - Player de question complet [P0]

Objectif:
Construire l'ecran le plus important du produit.

Le player doit gerer:

- affichage de l'enonce
- snippets de code propres
- choix de reponse
- validation
- progression dans la session
- pause / reprise
- etat loading et erreurs

UX attendue:

- clavier supporte
- lisibilite forte
- pas de bruit visuel
- sentiment premium et concentre

Criteres d'acceptation:

- experience stable desktop/mobile
- aucun rechargement brutal entre questions

### RM-402 - Correction profonde et standardisee [P0]

Objectif:
Faire de la correction le vrai coeur de valeur.

Chaque correction doit afficher:

- la bonne reponse
- pourquoi elle est correcte
- pourquoi chaque autre option est fausse
- les points a citer en entretien
- un mini exemple ou contre-exemple
- une action possible: revoir, noter, bookmarker

Criteres d'acceptation:

- aucune question publiee sans correction complete
- rendu clair dans les deux langues

### RM-403 - Support du contenu riche [P1]

Objectif:
Permettre des corrections de meilleure qualite.

Besoin:

- code blocks
- tableaux simples
- callouts
- liens de reference
- comparaisons avant / apres

Recommandation:

- markdown ou mdx safe
- renderer controle

Criteres d'acceptation:

- support des snippets React/TS/RN
- rendu homogene entre web et admin

## EPIC RM-500 - Review queue et spaced repetition

### RM-501 - Engine de repetition espacee [P0]

Objectif:
Faire revenir les bonnes questions au bon moment.

Logique v1 recommandee:

- `intervalDays`
- `streakCorrect`
- `ease`
- `lastAttemptAt`
- `nextReviewAt`

Comportements:

- bonne reponse: intervalle augmente
- mauvaise reponse: retour rapide
- questions difficiles ou ratees a repetition plus frequente

Criteres d'acceptation:

- comportement deterministe
- explication simple du systeme
- donnees exploitees par le dashboard

### RM-502 - Vraie page review [P0]

Objectif:
Faire de `/dashboard/review` un espace actionnable.

Fonctionnement attendu:

- liste priorisee des questions a revoir
- raison explicite de priorisation
- regroupement possible par skill ou module
- CTA "start review session"

Criteres d'acceptation:

- impossible de se perdre dans la queue
- les raisons de revision sont visibles et utiles

### RM-503 - Etats de maitrise robustes [P1]

Objectif:
Remplacer les pourcentages vides par des statuts credibles.

Etats recommandes:

- New
- Learning
- Reviewing
- Mastered

La transition ne doit pas dependre d'une seule bonne reponse.

Criteres d'acceptation:

- statut stable au niveau question
- agregation credible au niveau skill et module

## EPIC RM-600 - Progression, diagnostic et coaching

### RM-601 - Dashboard de progression reel [P0]

Objectif:
Transformer `/dashboard/progress` en tableau de bord pedagogique.

Le dashboard doit montrer:

- repartition des mastery states
- radar par skill
- evolution hebdomadaire
- skills stables vs fragiles
- tendance recente

Criteres d'acceptation:

- donnees reelles
- lecture immediate
- aucun graphique purement decoratif

### RM-602 - Weakness report [P1]

Objectif:
Identifier les confusions structurelles de l'utilisateur.

Exemples de signaux:

- confusion recurrente sur les deps arrays
- faiblesse sur les generics
- erreur frequente entre rerender et remount

Sortie attendue:

- liste des themes a traiter
- raisons
- modules ou sessions recommandes

Criteres d'acceptation:

- rapport lisible
- recommandations explicables

### RM-603 - Plan de revision hebdomadaire [P1]

Objectif:
Transformer le diagnostic en action.

Fonctionnement attendu:

- objectif hebdomadaire
- plan suggere en nombre de sessions
- repartition par tracks
- adaptation selon la deadline utilisateur

Criteres d'acceptation:

- le plan peut etre regenere
- l'utilisateur peut l'ajuster

## EPIC RM-700 - Mock interview

### RM-701 - Templates de mock interview [P0]

Objectif:
Faire des mocks une vraie proposition de valeur.

Templates initiaux recommandes:

- React Mid 30 min
- React Senior 45 min
- React Native Mid 30 min
- TypeScript for React 20 min
- Frontend Architecture 30 min

Chaque template doit definir:

- duree
- volume de questions
- types de formats
- niveau
- angle pedagogique

Criteres d'acceptation:

- templates selectionnables depuis dashboard et page dediee
- composition visible avant lancement

### RM-702 - Reponses ouvertes et rubrics [P1]

Objectif:
Sortir du pur QCM.

Fonctionnement attendu:

- certaines questions acceptent une reponse libre
- une rubric editoriale de correction existe
- le rapport indique les points attendus manquants

Recommandation:

- v1 par auto-evaluation guidee + rubric
- IA seulement plus tard, et seulement avec garde-fous

Criteres d'acceptation:

- rendu simple
- rubric exploitable
- rapport clair

### RM-703 - Rapport de defense orale [P1]

Objectif:
Entrainer le candidat a parler comme en entretien.

Le rapport doit indiquer:

- points a verbaliser
- objections probables du recruteur
- compromis a citer
- formulations courtes utiles

Criteres d'acceptation:

- utilite concrete apres mock
- pas de texte vague ni generique

## EPIC RM-800 - Outils de revision personnelle

### RM-801 - Bookmarks et favoris [P1]

Objectif:
Permettre a l'utilisateur de marquer les questions importantes.

Fonctionnement attendu:

- bookmark depuis correction
- vue filtree des bookmarks
- utilisation possible pour composer des sessions

Donnees impliquees:

- `Bookmark`

### RM-802 - Notes personnelles [P1]

Objectif:
Laisser l'utilisateur construire sa propre couche de comprehension.

Fonctionnement attendu:

- prise de notes par question
- edition et suppression
- notes visibles dans les futures revisions

Donnees impliquees:

- `Note`

Criteres d'acceptation:

- notes persistantes
- affichage clair dans le player et le dashboard

### RM-803 - Playlists et revision packs [P2]

Objectif:
Laisser composer des parcours rapides.

Exemples:

- "React Mid - 2 heures"
- "Last minute TypeScript review"
- "React Native perf sprint"

Schema futur possible:

- `Playlist`
- `PlaylistItem`

## EPIC RM-900 - CMS editoriale et operations contenu

### RM-901 - Admin de modules, skills et questions [P0]

Objectif:
Eviter que l'equipe produise le contenu a la main dans le code.

Le back-office doit permettre:

- CRUD modules
- CRUD skills
- CRUD questions
- CRUD options
- statut draft / review / published / archived

Criteres d'acceptation:

- RBAC admin
- interface exploitable sans toucher le repo

### RM-902 - Checklist qualite editoriale [P0]

Objectif:
Empecher la publication de contenu mediocre.

Checks recommandes:

- explication principale non vide
- distracteurs tous expliques
- skill principale renseignee
- niveau et difficulte renseignes
- traduction disponible ou statut explicite

Criteres d'acceptation:

- blocage publication si champs critiques manquants

### RM-903 - Import, export et seed editoriaux [P1]

Objectif:
Accelerer la production de contenu.

Besoin:

- import JSON/CSV/MDX
- export
- seed plus riche pour environnements de dev

Criteres d'acceptation:

- flux reproductible
- donnees valides

### RM-904 - Versioning de contenu [P1]

Objectif:
Eviter de casser la coherence historique.

Probleme:

- une question peut evoluer
- les anciennes tentatives doivent rester comprehensibles

Approche:

- versionner les revisions
- ou historiser les champs critiques a la soumission

Criteres d'acceptation:

- ancienne tentative interpretable meme apres update de question

## EPIC RM-1000 - Pricing, monetisation et lifecycle

### RM-1001 - Entitlements et plans [P1]

Objectif:
Transformer la landing "pricing-ready" en vrai systeme produit.

Plans recommandes:

- Starter
- Mentor Pro
- Hiring Sprint

Les entitlements doivent controler:

- nombre de modules accessibles
- nombre de mocks
- niveau d'analyse
- playlists premium

Criteres d'acceptation:

- couche d'entitlements claire
- UX lisible si limite atteinte

### RM-1002 - Billing Stripe [P1]

Objectif:
Rendre les plans activables.

Fonctionnement attendu:

- checkout
- customer portal
- webhooks
- synchronisation abonnements

Tables futures possibles:

- `Subscription`
- `ProductEntitlement`
- `InvoiceSnapshot`

### RM-1003 - Lifecycle emails avec Resend [P1]

Objectif:
Maintenir l'engagement et accompagner l'usage.

Emails prioritaires:

- welcome
- review due
- weekly summary
- nudge apres inactivite
- upgrade prompt intelligent

Criteres d'acceptation:

- emails localises
- segmentation simple
- desactivation possible

## EPIC RM-1100 - Marketing et acquisition

### RM-1101 - Landing V2 orientee conversion [P1]

Objectif:
Continuer a faire monter la valeur percue du produit.

Ajouts souhaites:

- preview reelle de questions
- preuves de qualite editoriale
- sections par track
- FAQ entretien
- CTA vers diagnostic gratuit

### RM-1102 - Ressources SEO et pages satellites [P2]

Objectif:
Construire une acquisition organique durable.

Pages cibles:

- "React interview questions"
- "useEffect interview questions"
- "TypeScript for React interview guide"
- "React Native interview prep"

Condition:

- contenu utile, pas du SEO vide

### RM-1103 - Lead magnet et diagnostic gratuit [P2]

Objectif:
Creer une passerelle entre contenu public et compte.

Exemples:

- mini assessment gratuit
- checklist de preparation
- plan 7 jours pour entretien React

## EPIC RM-1200 - Analytics, qualite et excellence plateforme

### RM-1201 - Product analytics [P0]

Objectif:
Savoir ce qui marche vraiment.

Evenements indispensables:

- account created
- onboarding completed
- session created
- question answered
- review completed
- mock completed
- upgrade clicked
- subscription started

Outils possibles:

- PostHog
- ou stack analytics plus legere

### RM-1202 - Observabilite et erreurs [P1]

Objectif:
Voir les regressions avant les utilisateurs.

Besoin:

- error tracking
- performance monitoring
- alertes sur endpoints critiques

Outil recommande:

- Sentry

### RM-1203 - Matrice de tests complete [P0]

Objectif:
Faire grandir le produit sans le casser.

Couverture cible:

- unit tests sur utils critiques
- component tests sur forms et player
- integration tests sur server actions
- e2e sur auth, onboarding, sessions, review, billing

Le minimum a ajouter apres l'auth:

- e2e onboarding
- e2e demarrage session
- e2e completion practice
- e2e review queue
- e2e settings

### RM-1204 - Accessibilite, performance et robustesse [P1]

Objectif:
Ne pas sacrifier la qualite percue a cause de la complexite croissante.

Exigences:

- navigation clavier
- contrastes suffisants
- temps de chargement maitrise
- support mobile reel
- skeletons et etats d'erreur propres

### RM-1205 - Securite et hygiene [P1]

Objectif:
Eviter les erreurs de jeunesse typiques des SaaS.

Points a traiter:

- RBAC admin
- sanitization du contenu riche
- rate limiting sur auth et endpoints sensibles
- protection webhooks
- audit des callbacks OAuth
- politiques de retention des donnees

## 12. Tickets de schema et d'API a prevoir

Ces tickets ne sont pas des features visibles, mais ils conditionnent la suite.

### RM-1301 - Traductions de contenu

Ajouter les tables ou structures de traduction pour modules, skills, questions et options.

### RM-1302 - Statuts editoriaux en enum

Remplacer les `status` string par de vrais enums pour les entites de contenu.

### RM-1303 - Tags de pieges et signaux de confusion

Ajouter des relations pour classifier:

- stale closure
- rerender vs remount
- reference equality
- generic constraint
- bridge RN / native

### RM-1304 - Stockage des reponses ouvertes

Prevoir une structure dediee:

- `OpenAnswerAttempt`
- `AttemptFeedback`
- `RubricPoint`

### RM-1305 - Entitlements et abonnements

Preparer la couche billing sans la coupler trop tot au coeur pedagogique.

## 13. Ordre de developpement recommande

Si on optimise pour le ratio valeur / effort, l'ordre recommande est:

1. onboarding utilisateur et preferences
2. vraies requetes dashboard
3. catalogue reel des modules
4. page detail module
5. session builder
6. question player
7. correction profonde
8. review queue reelle
9. engine de spaced repetition
10. progression reelle
11. templates mock
12. notes et bookmarks
13. admin de contenu
14. localisation du contenu
15. billing et lifecycle

## 14. Ce qu'il faut explicitement ne pas faire trop tot

Pour garder un cap propre, il faut retarder:

- generation IA massive de questions
- chat assistant omnipresent partout
- community features et profils publics
- video courses et LMS complet
- gamification agressive et superficielle

Ces sujets peuvent venir plus tard, mais ils ne doivent pas retarder le coeur de valeur:

- entrainer
- corriger
- reviser
- diagnostiquer

## 15. Definition du succes produit

React Mentor sera sur la bonne voie quand:

- un utilisateur peut s'inscrire et recevoir un plan de travail pertinent
- il peut lancer une session reelle en moins de 30 secondes
- chaque correction lui apprend vraiment quelque chose
- la review queue lui dit clairement quoi faire aujourd'hui
- les mocks l'entrainent a argumenter
- le dashboard l'aide a prioriser, pas juste a contempler des stats
- le contenu peut etre produit et maintenu sans toucher au code
- le produit fonctionne avec le meme niveau de qualite en FR et EN

## 16. Vision cible a 6-12 mois

La version cible de React Mentor n'est pas juste "un joli dashboard d'apprentissage".
C'est un produit ou:

- la landing donne envie
- l'auth et l'onboarding mettent en confiance
- le catalogue permet de choisir intelligemment
- le player rend l'apprentissage dense et satisfaisant
- la correction fait office de vrai mentor
- la review queue cree une habitude utile
- les mocks preparent a parler comme un candidat solide
- le contenu bilingue permet d'adresser un marche plus large
- la couche SaaS rend le projet economiquement viable

En une phrase:

React Mentor doit devenir le produit qui transforme des lacunes diffuses en preparation front-end structuree, mesurable et defendable en entretien.
