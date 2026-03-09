# React Mentor Execution Plan

Derniere mise a jour: 9 mars 2026

Document parent: [Roadmap.md](./Roadmap.md)

Documents de suivi:

- [BuildTracker.md](./BuildTracker.md)
- [ContinuationPlan.md](./ContinuationPlan.md)
- [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)
- [Taxonomy.md](./Taxonomy.md)
- [ContentContract.md](./ContentContract.md)
- [DashboardReadModel.md](./DashboardReadModel.md)

## 1. Role du document

Ce document transforme `Roadmap.md` en plan d'execution concret.

La roadmap dit:

- quoi construire
- pourquoi le construire
- dans quelle direction aller

Ce plan dit:

- dans quel ordre construire
- quelles dependances respecter
- quelles taches ouvrir ensuite
- ce qui doit etre termine avant de passer au lot suivant

Ce document doit etre utilise comme:

- plan de delivery
- backlog de build
- support de decoupage en tickets
- reference pour les prochains sprints

## 2. Hypothese de delivery

Ce plan est optimise pour un contexte "founder-led build", donc:

- une personne principale sur le developpement
- une production de contenu progressive
- une exigence de qualite elevee
- un besoin de livrer de la valeur visible rapidement

Consequence:

- on privilegie les vertical slices
- on retarde les couches business non critiques
- on ne construit pas d'admin lourd avant d'avoir un vrai coeur produit

## 2.1 Statut actuel

- `Lots 0 a 11`: essentiellement `DONE` dans le repo reel
- `Lot 12`: `PARTIAL`
- `Lot 13`: `IN_PROGRESS`
- le projet n'est plus dans une phase "ouvrir les premieres vertical slices"
- le chemin critique courant est maintenant:
  1. finir la sortie du reliquat `demo-data` cote surfaces authentifiees
  2. relier `learn` a une boucle cours -> checkpoint -> practice -> review
  3. enrichir le tracking d'apprentissage avec des signaux de lecture / comprehension / restitution
  4. transformer le workspace personnel en vraie surface d'apprentissage
  5. industrialiser QA editoriale, dedup benchmark et freshness review
  6. fermer les derniers trous telemetry / observabilite / e2e produit

Note:

- les sections historiques des lots plus bas restent utiles pour comprendre l'ordre de build initial
- l'etat courant et la priorisation active sont portes par [BuildTracker.md](./BuildTracker.md), [ContinuationPlan.md](./ContinuationPlan.md), [ContentExpansionTracker.md](./ContentExpansionTracker.md) et [LearningSystemImprovements.md](./LearningSystemImprovements.md)

Plan de continuation detaille:

- [ContinuationPlan.md](./ContinuationPlan.md)
- [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)

## 3. Strategie generale d'execution

Le chemin recommande est:

1. sortir du mode demo
2. rendre la data et le contenu exploitables
3. construire le moteur de session
4. construire le player et la correction
5. brancher la progression et la review
6. construire les mocks
7. industrialiser le contenu via l'admin
8. activer billing, lifecycle et acquisition

Regle forte:

- chaque lot doit rendre le produit plus reel
- aucun lot ne doit etre purement "infrastructure sans effet visible" trop longtemps

## 4. Workstreams a suivre en parallele

### WS-A Core Product

Contient:

- onboarding
- dashboard reel
- catalogue modules
- player
- sessions
- review
- progression
- mock interviews

### WS-B Content System

Contient:

- taxonomie
- schema bilingue
- seed
- modeles de question
- admin
- import/export
- checklist qualite

### WS-C Platform Quality

Contient:

- tests
- CI/CD
- analytics
- observabilite
- securite
- accessibilite

### WS-D Growth and Business

Contient:

- pricing
- entitlements
- billing
- lifecycle emails
- SEO
- landing conversion

## 5. Chemin critique

Le chemin critique est:

1. schema contenu bilingue
2. vraies queries dashboard
3. onboarding et preferences
4. catalogue modules reel
5. session builder
6. player de questions
7. persistence des attempts
8. engine de review
9. progression reelle
10. admin de contenu

Sans ces etapes, le produit reste une demo premium.

## 6. Definition of Ready

Une tache est "ready" si:

- le but produit est clair
- les donnees impactees sont identifiees
- les routes ou composants concernes sont connus
- les textes i18n a ajouter sont listes
- les tests a ecrire sont definis

## 7. Definition of Done

Un ticket n'est termine que si:

- le code compile
- `pnpm lint` passe
- `pnpm typecheck` passe
- les tests concernes existent et passent
- la feature est localisee FR/EN
- la feature gere loading, empty state et error state
- le schema et les seeds sont alignes si necessaire
- le comportement est coherent mobile et desktop

## 8. Ordre de build recommande par lots

| Lot | Nom | Priorite | Resultat attendu |
| --- | --- | --- | --- |
| 0 | Stabilisation de base | P0 | conventions, backlog, taxonomie, decisions de schema |
| 1 | Data model v2 et contenu bilingue | P0 | modele de contenu exploitable en prod |
| 2 | Onboarding et preferences | P0 | utilisateur personnalise des le premier login |
| 3 | Dashboard reel v1 | P0 | overview, progress, review et recent sessions reelles |
| 4 | Catalogue modules et pages detail | P0 | vrai point d'entree pedagogique |
| 5 | Session engine | P0 | creation, reprise et composition de sessions |
| 6 | Question player et attempts | P0 | experience d'entrainement complete |
| 7 | Review queue et mastery | P0 | repetition espacee et progression exploitable |
| 8 | Mock interviews | P1 | simulations sous contrainte et rapport |
| 9 | Notes, bookmarks, playlists | P1 | appropriation personnelle et parcours rapides |
| 10 | Admin et operations contenu | P0 | production editoriale scalable |
| 11 | Billing et entitlements | P1 | monetisation reelle |
| 12 | Growth, analytics et plateforme | P1 | acquisition, fiabilite, observabilite |

## 9. Immediate Next Build Queue

Ce sont les premiers tickets a executer sans attendre.

### Queue immediate - ordre strict

1. sortir `demo-data` des surfaces produit authentifiees encore dependantes
2. ajouter un premier lot `learn -> signal -> action`:
   - marquer un cours comme etudie
   - auto-check oral / checkpoint
   - ajout rapide a la review
   - questions associees et micro-practice
3. etendre `QuestionProgress` ou la couche de tracking adjacente pour porter ces signaux d'apprentissage
4. rendre ces signaux visibles dans les read models et les surfaces `learn` / dashboard / review
5. etendre playlists, bookmarks et notes au-dela du seul axe "question jouee"
6. renforcer QA editoriale avec freshness review, dedup benchmark et garde-fous bulk
7. completer la telemetry produit sur les evenements `learn`
8. fiabiliser la matrice e2e sur `learn`, `admin`, `playlists` et le setup DB local

Etat au 9 mars 2026:

- `dashboard/learn` est ouvert comme workspace protege
- le public `learn` reste accessible comme teaser et redirige les utilisateurs connectes
- les signaux `learn` sont deja visibles dans dashboard/review/playlists
- un premier spec Playwright couvre le split public/auth `learn`
- l'admin editorial remonte deja une queue freshness et un watch de doublons de prompts

Le prochain sous-lot prioritaire devient donc:

1. micro-exercices non-QCM, prerequis et suites de cours dans `dashboard/learn`
2. actions bulk admin pour traiter freshness/dedup
3. fermeture des trous `test:e2e:ci` complets et telemetry `learn`

## 10. Lot 0 - Stabilisation de base

### Objectif

Poser les conventions et les decisions structurantes avant d'ouvrir les gros chantiers.

### Deliverables

- taxonomie v1 figee
- conventions de contenu
- conventions de schema
- conventions de status
- conventions i18n contenu

### Tickets

#### L0-01 - Figer la taxonomie officielle [P0] [DONE]

Taches:

- lister les tracks definitifs v1
- lister les modules definitifs v1
- lister les skills prioritaires par module
- lister les tags de pieges v1
- valider la convention de slug

Sortie attendue:

- document de taxonomie versionne dans le repo

Reference:

- [Taxonomy.md](./Taxonomy.md)

#### L0-02 - Figer les enums de statut [P0] [DONE]

Taches:

- remplacer les `status: String` libres par des enums Prisma quand pertinent
- definir `draft`, `in_review`, `published`, `archived`
- definir les statuts eventuels de traduction

Sortie attendue:

- decision de schema sans ambiguite

Reference:

- [Taxonomy.md](./Taxonomy.md)

#### L0-03 - Definir le contrat editorial d'une question [P0] [DONE]

Taches:

- figer la liste des champs obligatoires
- separer clairement prompt, explanation, takeaways, distractor explanations
- decider si `prompt` reste string ou passe en rich content
- definir les champs FR/EN obligatoires

Sortie attendue:

- spec editoriale exploitable pour seed et admin

Reference:

- [ContentContract.md](./ContentContract.md)

#### L0-04 - Definir les read models du dashboard [P0] [DONE]

Taches:

- specifier les metriques overview
- specifier la review queue
- specifier la logique des graphes
- specifier les empty states

Sortie attendue:

- contrats de donnees du dashboard

Reference:

- [DashboardReadModel.md](./DashboardReadModel.md)

### Exit criteria du lot

- aucune ambiguite majeure sur le modele metier
- decisions critiques documentees
- lot 1 pret a etre implemente sans retour arriere probable

Statut:

- `DONE`

## 11. Lot 1 - Data model v2 et contenu bilingue

### Objectif

Rendre le schema compatible avec un vrai produit pedagogique localisable.

### Dependances

- lot 0 termine

### Deliverables

- migrations Prisma
- tables de traduction
- enrichissement du seed
- services de lecture localises

### Tickets

#### L1-01 - Ajouter les traductions de modules [P0]

Taches:

- creer `LearningModuleTranslation`
- relier au module
- ajouter `locale`, `title`, `description`, `summary`
- contraindre unicite `(moduleId, locale)`

Tests:

- migration OK
- seed OK
- query localisee OK

#### L1-02 - Ajouter les traductions de skills [P0]

Taches:

- creer `SkillTranslation`
- ajouter `title` et `description`
- unicite `(skillId, locale)`

#### L1-03 - Ajouter les traductions de questions [P0]

Taches:

- creer `QuestionTranslation`
- ajouter `prompt`, `explanation`, `takeaways`
- prevoir extensibilite pour rich content

#### L1-04 - Ajouter les traductions de question options [P0]

Taches:

- creer `QuestionOptionTranslation`
- ajouter `label`, `explanation`
- contraindre unicite

#### L1-05 - Remplacer les champs de contenu actuellement monolingues [P0]

Taches:

- identifier les champs a garder en base racine
- deplacer le texte pedagogique dans les tables de traduction
- garder sur l'entite racine uniquement le metier non localise

Statut:

- `IN_PROGRESS`

#### L1-06 - Introduire les tags de pieges [P1]

Taches:

- creer un modele `PitfallTag` ou structure equivalente
- creer la relation question <-> pitfall
- pre-seeder les tags prioritaires

#### L1-07 - Introduire les statuses editoriaux [P0]

Taches:

- migrer les statuts string vers enums
- adapter seed
- adapter queries

#### L1-08 - Refondre `prisma/seed.ts` [P0]

Taches:

- seeded modules bilingues
- seeded skills bilingues
- seeded questions bilingues
- seeded options bilingues
- seeded pitfall tags

#### L1-09 - Creer les repository functions localisees [P0]

Taches:

- `getModules(locale)`
- `getModuleBySlug(locale, slug)`
- `getQuestionById(locale, id)`
- `getReviewQueue(userId, locale)`

Statut:

- `DONE`

#### L1-10 - Ajouter les tests schema et seed [P1]

Taches:

- tests de lecture localisee
- tests de fallback de traduction
- tests de seed minimal

Statut:

- `DONE`

### Exit criteria du lot

- le contenu peut exister proprement en FR et EN
- le seed cree une base credible
- les futures features ne dependent plus de texte hardcode dans les entites de contenu

## 12. Lot 2 - Onboarding et preferences

### Objectif

Personnaliser l'experience des le premier login.

### Dependances

- lot 1 termine ou assez avance pour les modules/tracks

### Deliverables

- flow d'onboarding
- settings relies aux preferences
- recommandations initiales

### Tickets

#### L2-01 - Auditer `UserPreference` et completer le schema [P0] [DONE]

Taches:

- verifier que les champs suffisent
- ajouter `targetTrackSet` si besoin
- ajouter `applicationDeadline` si necessaire
- ajouter `experienceBand` si utile

#### L2-02 - Construire le flux first-run [P0] [DONE]

Taches:

- detecter utilisateur sans preferences
- rediriger vers onboarding
- prevoir reprise si flow interrompu

#### L2-03 - Ecran onboarding step 1: objectif [P0] [DONE]

Taches:

- choix role cible
- choix niveau cible
- choix deadline optionnelle

#### L2-04 - Ecran onboarding step 2: tracks [P0] [DONE]

Taches:

- selection React / RN / TS / Frontend Systems
- aide contextuelle
- sauvegarde incrementalement

#### L2-05 - Ecran onboarding step 3: cadence [P0] [DONE]

Taches:

- weekly goal
- posture de travail
- intensite eventuelle

#### L2-06 - Persist and redirect [P0] [DONE]

Taches:

- server action ou route handler de sauvegarde
- redirect vers dashboard personnalise

#### L2-07 - Settings relies aux preferences [P0] [DONE]

Taches:

- rendre la page settings editable
- formulaire bilingue
- sauvegarde et feedback

#### L2-08 - Recommandation initiale [P1] [DONE]

Taches:

- choisir les premiers modules
- choisir la premiere session
- afficher un bloc "recommended next"

### Exit criteria du lot

- un utilisateur nouvellement inscrit voit une experience personnalisee
- settings ne sont plus une page statique

## 13. Lot 3 - Dashboard reel v1

### Objectif

Remplacer les cartes demo par de vraies agregations.

### Dependances

- lots 1 et 2 termines

### Deliverables

- overview reel
- progress reel
- review reel
- recent sessions reelles

### Tickets

#### L3-01 - Definir les aggregates SQL/Prisma [P0] [DONE]

Taches:

- stats overview
- recent sessions
- due reviews
- skill readiness
- mastery distribution

#### L3-02 - Creer un service `dashboard-read-model` [P0] [DONE]

Taches:

- isoler la logique server-side
- retourner un objet pret pour les pages
- supprimer progressivement `demo-data.ts`

#### L3-03 - Brancher `/dashboard` sur de vraies donnees [P0] [DONE]

Taches:

- remplacer reviewQueue demo
- remplacer recentSessions demo
- remplacer mock templates par version mixte ou reelle
- gerer nouvel utilisateur sans historique

#### L3-04 - Brancher `/dashboard/progress` sur de vraies donnees [P0] [DONE]

Taches:

- radar reelle
- distribution mastery reelle
- notes stable/fragile issues de seuils reel

#### L3-05 - Brancher `/dashboard/review` sur de vraies donnees [P0] [DONE]

Taches:

- file priorisee
- motifs de priorisation
- compteur d'items dus

#### L3-06 - Brancher `/dashboard/modules` sur de vraies donnees [P0] [DONE]

Taches:

- modules reels
- progression reelle
- metriques reelles

#### L3-07 - Empty states et first-use UX [P0] [DONE]

Taches:

- dashboard vide lisible
- CTAs utiles
- pas de cartes absurdes a zero

#### L3-08 - Tests d'integration dashboard [P1] [DONE]

Taches:

- tests read model
- tests rendering server components

### Exit criteria du lot

- les pages dashboard principales ne reposent plus sur la demo
- un utilisateur voit sa vraie situation

## 14. Lot 4 - Catalogue modules et detail pages

### Objectif

Faire des modules la vraie entree pedagogique du produit.

### Dependances

- lot 3 assez avance

### Deliverables

- catalogue filtre
- page module detail
- CTA sessions

### Tickets

#### L4-01 - Route detail module [P0]

Taches:

- creer `/dashboard/modules/[slug]`
- charger module, skills, progression, stats

Statut:

- `DONE`

#### L4-02 - Filtres catalogue [P0]

Taches:

- track
- level
- skill
- format
- status
- persistence via URL search params

#### L4-03 - UX cards modules reelles [P0]

Taches:

- completion
- question count
- estimated time
- focus skills
- next recommended action

#### L4-04 - Page module detail: contenu pedagogique [P0]

Taches:

- objectifs
- prerequis
- faiblesses frequentes
- skills couvertes
- stats utilisateur

#### L4-05 - CTA de lancement [P0]

Taches:

- start practice
- start review on module
- start module-specific mock

#### L4-06 - Tests catalogue et detail [P1]

Taches:

- e2e filtres
- e2e navigation vers detail

### Exit criteria du lot

- un utilisateur peut choisir intelligemment quoi travailler

## 15. Lot 5 - Session engine

### Objectif

Introduire le coeur applicatif qui compose et pilote les sessions.

### Dependances

- lot 4 termine

### Deliverables

- creation de session
- reprise de session
- selection de questions
- mode practice v1

### Tickets

#### L5-01 - Specifier le contrat `TrainingSession` [P0] [DONE]

Taches:

- clarifier `config`
- clarifier score
- clarifier lifecycle started/paused/completed

#### L5-02 - Creer le service de session builder [P0] [DONE]

Taches:

- inputs: mode, filters, count, locale, user
- output: session + ordered items

#### L5-03 - Implementer la selection de questions v1 [P0] [DONE]

Taches:

- filtrer par module / track / skill / level
- eviter doublons evidents
- prendre en compte le statut utilisateur si disponible

#### L5-04 - Route ou server action `createTrainingSession` [P0] [DONE]

Taches:

- creation session
- creation items
- redirect vers player

#### L5-05 - Reprise de session [P0] [DONE]

Taches:

- retrouver la progression courante
- reprendre au bon item

#### L5-06 - Fin de session [P0] [DONE]

Taches:

- marquer `endedAt`
- enregistrer score
- redirection vers rapport

#### L5-07 - Tests engine [P1] [DONE]

Taches:

- unit tests selection questions
- integration tests session creation

### Exit criteria du lot

- on peut creer, reprendre et terminer une session

## 16. Lot 6 - Question player et attempts

### Objectif

Construire l'ecran central d'apprentissage.

### Dependances

- lot 5 termine

### Deliverables

- player complet
- persistence des attempts
- practice mode fonctionnel

### Tickets

#### L6-01 - Creer la route `/dashboard/session/[id]` [P0] [DONE]

Taches:

- charger session
- identifier item courant
- verifier authorisation utilisateur

#### L6-02 - Construire `QuestionPlayer` [P0] [PARTIAL]

Taches:

- affichage prompt
- affichage code blocks
- affichage options
- submit
- next
- pause

#### L6-03 - Persist attempts [P0] [DONE]

Taches:

- creation `Attempt`
- associer `sessionId`
- stocker selected options
- stocker isCorrect
- stocker timeSpentMs

#### L6-04 - Brancher la correction immediate [P0] [DONE]

Taches:

- bonne reponse
- explication
- distractor explanations
- takeaways

#### L6-05 - Navigation player [P0] [DONE]

Taches:

- progression visuelle
- next question
- keyboard support
- sauvegarde avant navigation

#### L6-06 - Error and recovery states [P0] [DONE]

Taches:

- perte de reseau
- soumission en double
- session invalide

#### L6-07 - e2e practice flow [P0] [DONE]

Taches:

- create session
- answer questions
- finish session

### Exit criteria du lot

- un utilisateur peut enfin faire une vraie session practice

## 17. Lot 7 - Review queue et mastery

### Objectif

Donner au produit son moteur de retention pedagogique.

### Dependances

- lot 6 termine

### Deliverables

- engine de repetition espacee
- question progress
- skill progress
- review queue vraie

### Tickets

#### L7-01 - Implementer l'engine `QuestionProgress` [P0] [DONE]

Taches:

- calcul intervalDays
- calcul streakCorrect
- calcul nextReviewAt
- calcul masteryState

#### L7-02 - Mettre a jour `QuestionProgress` apres chaque attempt [P0] [DONE]

Taches:

- brancher sur persistence attempt
- prendre en compte correct / incorrect

#### L7-03 - Agreger `SkillProgress` [P0] [PARTIAL]

Taches:

- score par skill
- poids par difficulte
- penalite si echec recent

#### L7-04 - Construire la review queue priorisee [P0] [DONE]

Taches:

- items `nextReviewAt <= now`
- tri par urgence
- motifs textuels

#### L7-05 - Mode review [P0] [DONE]

Taches:

- session builder avec queue de review
- UX adaptee
- feedback adapte

#### L7-06 - Brancher `/dashboard/review` et `/dashboard/progress` [P0] [DONE]

Taches:

- vue a jour
- badges reelles
- progression par skill

#### L7-07 - Tests de logique mastery [P1] [DONE]

Taches:

- unit tests engine
- integration tests review queue

### Exit criteria du lot

- le produit dit enfin quoi reviser et pourquoi

## 18. Lot 8 - Mock interviews

### Objectif

Ajouter la couche "entretien sous contrainte", pas seulement quiz.

### Dependances

- lot 7 termine

### Deliverables

- templates de mock
- sessions timed
- rapport mock

### Tickets

#### L8-01 - Definir les templates de mock [P0] [DONE]

Taches:

- React Mid 30 min
- React Senior 45 min
- RN Mid 30 min
- TS React 20 min
- Frontend Architecture 30 min

#### L8-02 - Etendre le session builder au mode mock [P0] [PARTIAL]

Taches:

- contraintes de temps
- composition de formats
- scoring specifique

#### L8-03 - UI de timer et de pression [P0] [DONE]

Taches:

- chronometre
- progress bar
- fin de session automatique si besoin

#### L8-04 - Rapport de mock [P0] [DONE]

Taches:

- score
- temps
- skills testees
- erreurs majeures
- points a verbaliser

#### L8-05 - Historique de mocks [P1] [DONE]

Taches:

- listing
- comparaison simple
- tendances

#### L8-06 - Reponses ouvertes v1 ou rubric guidee [P1]

Taches:

- decider le niveau d'ouverture v1
- stocker texte libre si active
- afficher points attendus

#### L8-07 - e2e mock mode [P1] [DONE]

Taches:

- lancer mock
- finir mock
- consulter rapport

### Exit criteria du lot

- React Mentor prepare vraiment au contexte d'entretien

## 19. Lot 9 - Notes, bookmarks et playlists

### Objectif

Permettre l'appropriation personnelle du contenu.

### Dependances

- lot 6 minimum

### Deliverables

- bookmarks
- notes
- playlists v1

### Tickets

#### L9-01 - Bookmarks question [P1]

Taches:

- bouton bookmark
- persistance
- vue liste

#### L9-02 - Notes personnelles [P1]

Taches:

- editeur simple
- persistance
- affichage dans correction
- affichage dans review

#### L9-03 - Pages `/dashboard/bookmarks` et `/dashboard/notes` [P1]

Taches:

- listing
- filtres
- recherche simple

#### L9-04 - Playlists v1 [P2]

Taches:

- modele de playlist
- creation manuelle
- reutilisation pour lancer une session

### Exit criteria du lot

- l'utilisateur peut se construire son propre espace de revision

## 20. Lot 10 - Admin et operations contenu

### Objectif

Rendre la production de contenu viable a l'echelle.

### Dependances

- lots 1, 4, 6 termines au minimum

### Deliverables

- admin modules/skills/questions
- checklist qualite
- import/export

### Tickets

#### L10-01 - RBAC admin [P0]

Taches:

- definir role admin
- proteger routes admin
- proteger actions admin

#### L10-02 - Admin modules [P0]

Taches:

- liste
- create
- edit
- publish

#### L10-03 - Admin skills [P0]

Taches:

- liste par module
- create/edit

#### L10-04 - Admin questions [P0]

Taches:

- liste
- filtres
- create/edit
- options
- tags
- niveau/difficulte

#### L10-05 - UI bilingue d'edition [P0]

Taches:

- onglets FR/EN
- statut de traduction
- validation des champs critiques

#### L10-06 - Checklist qualite editoriale [P0]

Taches:

- explication obligatoire
- distractors obligatoires
- skill principale obligatoire
- traduction ou statut explicite

#### L10-07 - Import/export [P1]

Taches:

- import JSON
- export JSON
- template de format

#### L10-08 - Versioning contenu [P1]

Taches:

- strategy minimale
- historiser revisions ou snapshots critiques

#### L10-09 - Tests admin [P1]

Taches:

- tests acces
- tests create/edit/publish

### Exit criteria du lot

- on peut produire et maintenir du contenu sans editer le code

## 21. Lot 11 - Billing et entitlements

### Objectif

Transformer la proposition SaaS en vrai business model.

### Dependances

- coeur produit deja utile

### Deliverables

- entitlements
- Stripe billing
- UX de limitation

### Tickets

#### L11-01 - Modeliser les entitlements [P1]

Taches:

- lister les limites par plan
- implementer une couche de verification produit

#### L11-02 - Ajouter le schema billing [P1]

Taches:

- subscription
- customer id
- plan id
- status

#### L11-03 - Checkout Stripe [P1]

Taches:

- bouton upgrade
- session checkout
- retour succes/cancel

#### L11-04 - Customer portal [P1]

Taches:

- gestion abonnement
- upgrade/downgrade
- annulation

#### L11-05 - Webhooks [P1]

Taches:

- checkout completed
- subscription updated
- subscription canceled

#### L11-06 - Gating produit [P1]

Taches:

- limits modules
- limits mocks
- limits analytics

#### L11-07 - Tests billing [P1]

Taches:

- unit tests entitlements
- integration tests webhook logic

### Exit criteria du lot

- les plans affiches sur la landing sont activables et controls par le produit

## 22. Lot 12 - Growth, analytics et plateforme

### Objectif

Fiabiliser, observer et faire croitre le produit.

### Dependances

- lots coeur deja en production beta

### Deliverables

- analytics
- observabilite
- lifecycle emails
- landing conversion v2
- SEO resources

### Tickets

#### L12-01 - Product analytics [P0]

Taches:

- choisir outil
- instrumenter events critiques
- dashboard analytics minimal

#### L12-02 - Observabilite et alerting [P1]

Taches:

- Sentry
- server errors
- auth errors
- session errors

#### L12-03 - Lifecycle emails [P1]

Taches:

- welcome
- review due
- weekly summary
- inactivity

#### L12-04 - Landing V2 [P1]

Taches:

- preview de vraies questions
- preuve de profondeur editoriale
- sections par track
- CTA diagnostic gratuit

#### L12-05 - Pages ressources / SEO [P2]

Taches:

- structure pages publiques
- templates article/guide
- premiers contenus SEO

#### L12-06 - Accessibilite et performance pass [P1]

Taches:

- audits lighthouse
- contrastes
- navigation clavier
- optimisation bundles

#### L12-07 - Securite pass [P1]

Taches:

- rate limiting
- sanitization rich content
- audit admin
- audit callbacks OAuth

### Exit criteria du lot

- le produit n'est plus seulement fonctionnel, il devient exploitable serieusement

## 23. Cross-cutting quality backlog

Ces taches doivent vivre tout au long du projet.

### CQ-01 - i18n discipline

Pour chaque feature:

- aucun texte dur en UI
- traductions FR/EN ajoutees en meme temps
- tests si logique dependante de la locale

### CQ-02 - Test matrix progressive

Apres chaque lot critique:

- unit tests business logic
- component tests UI sensibles
- e2e parcours principaux

### CQ-03 - Seed strategy

Toujours maintenir:

- seed minimal dev
- seed demo riche si besoin
- seed test deterministe

### CQ-04 - Documentation continue

A mettre a jour au fil des lots:

- README
- Roadmap
- ExecutionPlan
- docs techniques internes

## 24. Ticket queue detaillee pour les 3 premiers lots

Cette section est la plus actionnable a court terme.

### Sprint A - Schema et contenu

Ordre recommande:

1. L0-01 taxonomie
2. L0-02 statuses
3. L0-03 contrat editorial
4. L1-01 translations modules
5. L1-02 translations skills
6. L1-03 translations questions
7. L1-04 translations options
8. L1-07 statuses editoriaux
9. L1-08 seed refactor
10. L1-09 repository functions

### Sprint B - Personnalisation et dashboard

Ordre recommande:

1. L2-01 audit `UserPreference`
2. L2-02 first-run gate
3. L2-03 onboarding objectif
4. L2-04 onboarding tracks
5. L2-05 onboarding cadence
6. L2-06 persist and redirect
7. L2-07 settings editables
8. L3-01 aggregates dashboard
9. L3-02 dashboard read model
10. L3-03 overview reel
11. L3-05 review reel
12. L3-04 progress reel

### Sprint C - Modules et sessions

Ordre recommande:

1. L3-06 modules reel
2. L4-01 page detail module
3. L4-02 filtres catalogue
4. L4-04 contenu pedagogique detail
5. L4-05 CTA sessions
6. L5-01 contrat `TrainingSession`
7. L5-02 session builder
8. L5-03 selection questions
9. L5-04 creation session
10. L6-01 route player

## 25. Risques majeurs a surveiller

### R-01 - Construire trop de chrome avant le coeur

Danger:

- continuer a enrichir le dashboard sans vrai moteur de pratique

Mitigation:

- prioriser lots 5, 6 et 7 rapidement apres le passage du dashboard en reel

### R-02 - Se perdre dans le schema de traduction

Danger:

- sur-complexifier l'i18n du contenu

Mitigation:

- faire simple et strict
- definir un pattern unique

### R-03 - Construire l'admin trop tot

Danger:

- investir beaucoup dans l'outillage avant d'avoir valide le coeur produit

Mitigation:

- seed + JSON import temporaires au debut
- admin complet seulement apres player/review

### R-04 - Lancer trop tot des questions ouvertes IA

Danger:

- experience floue
- correction peu fiable

Mitigation:

- commencer par closed formats excellents
- ajouter rubric avant IA

### R-05 - Mauvaise fiabilite des metriques de progression

Danger:

- score trompeur
- dashboard peu credible

Mitigation:

- regles explicables
- seuils simples
- tests metier forts

## 26. Checklist de release beta interne

Avant une vraie beta, il faut au minimum:

- onboarding operationnel
- dashboard reel
- catalogue modules reel
- au moins 3 modules solides
- player practice complet
- correction profonde
- review queue reelle
- progression reelle
- auth stable
- tests e2e sur parcours critiques

## 27. Checklist de release beta publique

Avant ouverture publique:

- admin minimum
- lifecycle emails minimum
- observabilite
- politique de pricing claire
- settings completes
- accessibilite passable
- mobile passable
- support produit minimum

## 28. Recommandation finale d'enchainement

Si l'objectif est de faire avancer React Mentor de la meilleure maniere possible, l'enchainement recommande est:

1. lot 0 complet
2. lot 1 complet
3. lot 2 complet
4. lot 3 partiel puis lot 4
5. lot 5
6. lot 6
7. lot 7
8. beta interne
9. lot 8
10. lot 10
11. lot 11
12. lot 12

En pratique:

- ne pas attendre la fin du lot 10 pour commencer a enrichir le contenu
- ne pas attendre le billing pour tester la valeur produit
- ne pas retarder le player pour des sujets marketing

## 29. Premier ticket a ouvrir maintenant

Le tout premier ticket recommande est:

`L0-01 - Figer la taxonomie officielle`

Pourquoi:

- il conditionne le seed
- il conditionne les traductions
- il conditionne les filtres catalogue
- il conditionne l'admin
- il conditionne la logique de progression

Le deuxieme ticket est:

`L1-01 a L1-05 - Data model bilingue`

Le troisieme ticket est:

`L2-02 a L2-06 - First-run onboarding`

Si on suit cet ordre, on transforme rapidement React Mentor en produit reel sans se disperser.
