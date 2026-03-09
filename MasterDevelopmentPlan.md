# React Mentor Master Development Plan

Derniere mise a jour: 9 mars 2026

Documents parents:

- [Roadmap.md](./Roadmap.md)
- [ExecutionPlan.md](./ExecutionPlan.md)
- [BuildTracker.md](./BuildTracker.md)
- [ContinuationPlan.md](./ContinuationPlan.md)
- [ContentExpansionTracker.md](./ContentExpansionTracker.md)
- [LearningSystemImprovements.md](./LearningSystemImprovements.md)
- [Taxonomy.md](./Taxonomy.md)
- [ContentContract.md](./ContentContract.md)
- [DashboardReadModel.md](./DashboardReadModel.md)
- [TrainingSessionContract.md](./TrainingSessionContract.md)

## 1. Role du document

Ce document est le plan maitre de tout ce qu'il reste a construire dans React Mentor.

Il doit servir a:

- decouper la suite en epics, tickets et sous-taches
- anticiper les besoins produit, schema, contenu, admin, business et qualite
- eviter les angles morts entre les lots deja ouverts et les lots futurs
- preparer un backlog durable pour les prochains mois de build

Il complete:

- `Roadmap.md` pour la vision
- `ExecutionPlan.md` pour les lots
- `ContinuationPlan.md` pour l'ordre de suite recommande
- `BuildTracker.md` pour le suivi d'avancement

## 2. Hypotheses de travail

Le plan suppose:

- un mode de delivery founder-led avec une vitesse d'execution elevee
- une priorite forte sur le coeur pedagogique avant la monetisation
- une production de contenu progressive, pas un import massif d'un coup
- une bibliotheque `learn` deja ouverte qu'il faut maintenant densifier et mieux relier au reste du produit
- une exigence de coherence entre Prisma, i18n, seed, tests et UX

Regle forte:

- chaque nouvelle couche doit rendre le produit plus vrai, pas seulement plus large

## 3. Etat actuel du produit

### 3.1 Ce qui est deja solide

- auth email/password + provider optionnels
- onboarding et preferences utilisateur
- dashboard overview/progress/review/mock relies aux vraies aggregations
- catalogue modules et detail module relies au repository localise
- moteur de session pour `PRACTICE`, `REVIEW` et `MOCK_INTERVIEW`
- player multi-format v1 stable sur `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT`
- progression `QuestionProgress` et `SkillProgress` persistante
- premiers signaux `learn` persistants sur `QuestionProgress` et loop de base `cours -> checkpoint -> review/practice`
- mocks v1 avec timer, expiration, rapport et historique reel
- `learn` public comme teaser editorial, prolonge par `dashboard/learn` pour le workspace detaille authentifie
- notes, bookmarks, playlists et workspace personnel v1 exposes
- admin contenu v1 exploitable via `/dashboard/admin`
- billing Stripe, entitlements, lifecycle email, telemetry produit et Sentry relies
- i18n FR/EN UI et contenu
- seed bilingue deja significativement enrichi sur React, JavaScript, React Native et Frontend Systems
- tests domaine, integration et e2e sur les slices principales

### 3.2 Ce qui est encore partiel ou absent

- cleanup legacy monolingue incomplet
- structure pedagogique des cours encore tres textuelle et peu interactive
- tracking d'apprentissage encore trop centre sur la tentative malgre un premier lot de signaux de cours; comprehension, restitution et rechute restent encore sous-exploitees
- recovery plans et recommandations encore pas assez relies a la consommation des cours
- QA editoriale, deduplication benchmark et operations bulk encore partielles, malgre une premiere queue freshness et un watch de doublons deja branches dans l'admin
- analytics de performance et mesure de l'efficacite pedagogique encore incomplets
- entonnoirs de retention, reactivation et usage long terme encore a renforcer

### 3.3 Dettes structurelles a anticiper

Ces dettes doivent apparaitre dans le plan, meme si elles ne sont pas visibles en UI aujourd'hui:

- migration des `status` string vers enums Prisma
- enrichissement du schema contenu avec metadonnees editoriales
- enrichissement du tracking pour distinguer lecture, comprehension, restitution et rechute
- preparation a du rich content ou markdown structure pour `prompt`, `explanation` et `lessonBody`
- separation claire entre previews marketing et donnees produit authentifiees
- mesure plus fiable des recommandations, des plans de recovery et de l'efficacite du contenu

## 4. Contraintes transverses

Chaque ticket futur doit prendre en compte:

- i18n FR/EN
- mobile et desktop
- empty states, loading states et error states
- alignement schema / seed / repository / UI
- couverture tests minimale
- mise a jour du `BuildTracker.md`

Pour toute evolution schema:

- migration Prisma
- seed adapte
- tests adaptes
- audit des read models impactes

Pour tout nouveau format de question:

- contrat de contenu
- seed ou fixture de reference
- rendu UI
- persistence de la reponse
- correction
- progression
- tests unitaires
- au moins un test integration ou e2e

## 5. Carte des dependances

Ordre structurel recommande:

1. cleanup legacy + hardening schema contenu
2. content scale sur `learn`
3. boucle cours -> checkpoint -> pratique -> review
4. tracking d'apprentissage et recommandations par concept
5. workspace personnel d'apprentissage
6. admin contenu, QA editoriale et deduplication benchmark
7. analytics pedagogiques, observabilite et performance
8. retention, lifecycle et billing intelligence
9. growth, conversion et SEO

Travaux parallelisables:

- enrichissement du seed
- definition des contrats editoriaux
- durcissement des tests
- pre-travail analytics/observabilite
- spec admin contenu
- instrumentation learning / recommendation

Travaux a ne pas lancer trop tot:

- SEO/growth a grande echelle tant que la densite pedagogique n'est pas suffisante
- automatisations "IA" trop ambitieuses si les boucles pedagogiques de base restent floues
- sophistication retention au-dela du signal pedagogique reel

## 4.1 Phase active au 8 mars 2026

Le repo n'est plus dans une phase "ouvrir les premieres vertical slices".
La phase active est maintenant:

- densifier le contenu `learn`
- augmenter la profondeur pedagogique des reponses et mini-cours
- mieux relier contenu, pratique, review et recommandations
- rendre le tracking d'apprentissage plus lisible et plus utile
- outiller l'admin pour traiter freshness review et deduplication a plus grande echelle

Documents directeurs de cette phase:

- [ContentExpansionTracker.md](./ContentExpansionTracker.md)
- [LearningSystemImprovements.md](./LearningSystemImprovements.md)

## 6. Macro-plan par phases

## Phase 0 - Hygiene et realignement du pilotage

### Objectif

Rendre le systeme de pilotage aussi precis que le repo reel.

### Tickets

#### P0-01 - Reconciliation docs / schema / tracker

Taches:

- verifier que les tickets notes `DONE` sont reels dans le code
- lister les tickets documentes mais pas encore implementes
- corriger les incoherences de statut dans `BuildTracker.md`
- ajouter les references vers le plan maitre

Dependances:

- aucune

Livrables:

- tracker coherent
- docs pilotes relies entre eux

#### P0-02 - Template standard pour tickets futurs

Taches:

- definir un format court pour les tickets d'implementation
- inclure objectif, dependances, fichiers, tests, DoD

Pourquoi:

- reduire le temps de decomposition des prochains lots

## Phase 1 - Cleanup legacy et hardening du modele contenu

### Objectif

Terminer la migration vers un modele contenu bilingue clair et preparer le schema a la suite.

### Epic 1.1 - Cleanup legacy monolingue

#### P1-01 - Auditer les champs racine legacy encore necessaires

Taches:

- auditer `LearningModule.title/description/summary`
- auditer `Skill.title/description`
- auditer `Question.prompt/explanation/takeaways`
- auditer `QuestionOption.label/explanation`
- documenter la source de verite et le fallback de chaque champ

Fichiers principaux:

- [prisma/schema.prisma](./prisma/schema.prisma)
- [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- [prisma/seed.ts](./prisma/seed.ts)

Acceptance:

- chaque champ legacy a une decision explicite
- les fallbacks implicites disparaissent

#### P1-02 - Migrer ou formaliser les fallbacks restants

Taches:

- choisir entre suppression, conservation transitoire ou denormalisation volontaire
- mettre a jour le repository
- aligner les tests de localisation

Acceptance:

- `L1-05` peut passer a `DONE`

### Epic 1.2 - Statuts editoriaux et schema metier

#### P1-03 - Introduire un enum Prisma `ContentStatus`

Taches:

- creer l'enum `DRAFT`, `IN_REVIEW`, `PUBLISHED`, `ARCHIVED`
- migrer `LearningModule.status`
- migrer `Skill.status`
- migrer `Question.status`
- mettre a jour seed et services

Pourquoi:

- la dette est explicitement documentee mais pas encore resolue

Acceptance:

- aucun `status: String` libre sur les entites contenu principales

#### P1-04 - Ajouter les metadonnees editoriales minimales

Champs a evaluer:

- `estimatedTimeSec`
- `sourceType`
- `version`
- eventuellement `editorNotes`

Pourquoi:

- ces champs sont deja prevus par `ContentContract.md`
- ils aideront l'admin, les mocks et la qualite editoriale

Acceptance:

- schema cible fige
- seuls les champs utiles v1 sont introduits

### Epic 1.3 - Taxonomie et signaux de faiblesse

#### P1-05 - Introduire les pitfall tags dans le schema

Taches:

- creer `PitfallTag`
- creer la relation question <-> pitfall tags
- brancher seed minimal
- preparer l'usage futur dans le dashboard weakness report

Pourquoi:

- le contrat de contenu les prevoit deja
- le `DashboardReadModel.md` anticipe un `weaknessReport`

Acceptance:

- tags exploitables par question
- au moins un premier jeu de tags seedes

### Epic 1.4 - Isolation demo vs produit

#### P1-06 - Purger `demo-data.ts` des surfaces produit authentifiees

Taches:

- identifier tous les usages de `demo-data.ts`
- conserver seulement les usages marketing ou auth preview si volontaire
- remplacer les view models de transition par de vraies donnees ou des fixtures explicites

Fichiers principaux:

- [src/lib/demo-data.ts](./src/lib/demo-data.ts)
- [src/features/dashboard/dashboard-view-model.ts](./src/features/dashboard/dashboard-view-model.ts)
- [src/features/landing/landing-page.tsx](./src/features/landing/landing-page.tsx)
- [src/app/auth/layout.tsx](./src/app/auth/layout.tsx)

Acceptance:

- aucune page dashboard authentifiee ne depend de `demo-data.ts`
- les previews restantes sont marquees comme marketing

### Epic 1.5 - Seed et couverture contenu v1

#### P1-07 - Etendre le seed aux modules P0 manquants

Priorites:

- `state-and-data-flow`
- `react-performance-systems`
- `typescript-type-systems-for-ui`
- `react-native-performance-and-platforms`
- `frontend-testing-systems`

Taches:

- creer les modules
- creer les skills associees
- creer des questions bilingues de qualite minimale

Acceptance:

- chaque track a au moins une trajectoire pedagogique defendable

#### P1-08 - Definir une cible minimale de densite de contenu

Exemple de cible v1:

- 4 a 6 modules P0 jouables
- 4 a 5 skills par module
- 8 a 12 questions par module minimum

Pourquoi:

- les mocks et la review deviennent faibles si la base est trop petite

## Phase 2 - Refonte du runtime de session pour le multi-format

### Objectif

Refactorer le systeme de session pour qu'il puisse supporter plusieurs formats sans accumulation de dette.

### Epic 2.1 - Nouveau contrat de reponse

#### P2-01 - Redesign du modele `Attempt`

Probleme actuel:

- `Attempt.selectedOptionIds` suffit pour les formats fermes
- il n'est pas adapte a `CODE_OUTPUT`, `BUG_HUNT` ou `OPEN_ENDED`

Options a etudier:

- `responsePayload Json`
- champs separes par format
- combinaison `selectedOptionIds` + `responsePayload`

Taches:

- definir le payload cible
- migrer le schema
- mettre a jour les services et tests

Acceptance:

- le schema supporte au moins un format ferme et un format semi-ouvert

#### P2-02 - Versionner le contrat de session si necessaire

Taches:

- verifier si `TrainingSession.config` doit porter une `version`
- verifier si les formats de session doivent etre explicites dans `config`

Pourquoi:

- eviter les ambiguites de reprise quand les formats divergent

### Epic 2.2 - Player par renderer de format

#### P2-03 - Scinder `SessionPlayer` en orchestrateur + renderers

Sous-taches:

- definir des props communes
- isoler navigation, progression, timer et feedback globaux
- creer un renderer single-choice
- preparer les interfaces pour les renderers suivants

Fichiers principaux:

- [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)
- [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)

Acceptance:

- le player n'encode plus en dur le single-select comme forme unique

#### P2-04 - Revoir la validation de soumission par format

Taches:

- sortir la validation des soumissions du schema unique actuel
- brancher des validateurs par format
- harmoniser les erreurs de format, d'expiration, d'invalidite et de reprise

Acceptance:

- la server action peut traiter plusieurs formes de payload

### Epic 2.3 - Builder plus expressif

#### P2-05 - Decoupler selection des questions et type de format

Taches:

- permettre au builder de filtrer par format(s)
- permettre un mix de formats dans une session
- garder un mode simple pour la practice v1

Acceptance:

- le builder peut retourner une session mono-format ou mixte

#### P2-06 - Ajouter les fixtures et helpers de test multi-format

Pourquoi:

- sans fixtures dediees, chaque nouveau format sera trop cher a tester

## Phase 3 - Formats jouables au-dela du single-choice

### Objectif

Etendre l'apprentissage au-dela du QCM simple.

### Epic 3.1 - `MULTIPLE_CHOICE`

#### P3-01 - Contrat editorial multi-select

Taches:

- definir les regles de correction
- definir les cas d'erreur
- definir les takeaways et explications attendus

#### P3-02 - UI multi-select

Taches:

- selection multiple
- etat soumis
- correction
- recovery
- clavier si utile

#### P3-03 - Persistence et scoring multi-select

Taches:

- calcul de `isCorrect`
- branchement progression
- impact review

#### P3-04 - Seed et tests multi-select

Tests minimum:

- unite sur le scoring
- integration sur la server action
- e2e practice sur une question multi-select

### Epic 3.2 - `CODE_OUTPUT`

#### P3-05 - Contrat editorial `CODE_OUTPUT`

Taches:

- definir le format de snippet
- definir les options de reponse ou la forme d'entree
- definir les explications attendues

Decision recommandee:

- commencer par du `CODE_OUTPUT` ferme ou semi-ferme avant tout champ libre

#### P3-06 - Renderer `CODE_OUTPUT`

Taches:

- affichage code lisible
- contraste et lisibilite
- support mobile

#### P3-07 - Tests et contenu `CODE_OUTPUT`

Acceptance:

- au moins un module contient des questions jouables de ce format

### Epic 3.3 - `BUG_HUNT`

#### P3-08 - Contrat editorial `BUG_HUNT`

Taches:

- definir le type de bug attendu
- definir la forme de correction
- definir la granularite de notation

#### P3-09 - Renderer `BUG_HUNT`

Taches:

- lecture de snippet ou pseudo-diff
- options ou selection guidee
- affichage des distracteurs

#### P3-10 - Seed et tests `BUG_HUNT`

Acceptance:

- au moins une trajectoire d'entretien plus proche du reel existe

### Epic 3.4 - `OPEN_ENDED`

#### P3-11 - Cadrer l'open-ended guide

Questions a fermer:

- quelle forme de reponse utilisateur
- quel niveau de correction
- quel niveau de rubric
- quel feedback v1 sans IA externe

Decision recommande:

- livrer d'abord une reponse guidee par points attendus
- ne pas promettre une notation riche trop tot

#### P3-12 - Ajouter le support schema minimal

Champs a evaluer:

- `expectedPoints`
- `rubric`
- `verbalizeChecklist`

#### P3-13 - Renderer `OPEN_ENDED` v1

Taches:

- saisie libre ou semi-guidee
- auto-evaluation assistee
- affichage des points attendus

#### P3-14 - Brancher le mock sur l'open-ended seulement apres rubric

Regle:

- pas de mock ouvert sans contrat d'evaluation defendable

## Phase 4 - Progression, review et signaux pedagogiques v2

### Objectif

Faire passer la progression de "coherente" a "pedagogiquement defendable".

### Epic 4.1 - `QuestionProgress` v2

#### P4-01 - Revoir l'algorithme de repetition espacee

Probleme actuel:

- regle simple de doublement de l'intervalle

Taches:

- definir des seuils plus fins
- distinguer apprentissage, consolidation et maintien
- prendre en compte la recidive d'erreurs
- mieux exploiter `ease`

Acceptance:

- l'algorithme reste simple a expliquer
- les tests couvrent les cas limites

#### P4-02 - Ajouter des tests de non-regression sur les scenarios d'apprentissage

Scenarios:

- premiere reponse correcte
- enchainement de succes
- echec apres succes
- reussite apres plusieurs echecs
- question due puis ignoree plusieurs jours

### Epic 4.2 - `SkillProgress` v2

#### P4-03 - Enrichir le schema `SkillProgress`

Champs a considerer:

- `coverageCount`
- `uniqueQuestionCount`
- `uniqueDifficultyCount`
- `recentFailureCount`
- `confidenceScore`
- `lastAttemptAt`

Pourquoi:

- mieux expliquer le score au user
- mieux alimenter le dashboard et les recommandations

#### P4-04 - Revoir le calcul de maitrise

Taches:

- distinguer precision, couverture et recence
- eviter les faux positifs de maitrise
- mieux penaliser les chutes recentes en mock ou review

#### P4-05 - Exposer les raisons de fragilite au dashboard

Taches:

- enrichir le read model `progress`
- ajouter une surface de diagnostic comprehensible
- montrer la confiance du signal

### Epic 4.3 - Review queue v2

#### P4-06 - Enrichir les raisons de review

Taches:

- distinguer overdue, repeated-failure, weak-skill, mock-fallout
- adapter les CTA

#### P4-07 - Ajouter des raccourcis de review specialises

Exemples:

- review due now
- review after failed mock
- review by weak skill

## Phase 5 - Mock interviews v2

### Objectif

Faire des mocks une vraie simulation utile, pas seulement un quiz chronometre.

### Epic 5.1 - Builder mixed-format

#### P5-01 - Etendre les templates mock

Taches:

- autoriser plusieurs formats par template
- definir des ratios par format
- definir une logique d'escalade de difficulte

#### P5-02 - Ajouter des templates par module et par persona

Exemples:

- React mid fundamentals
- React senior tradeoffs
- React Native sprint
- TypeScript defense
- Frontend testing systems

### Epic 5.2 - Scoring mock plus riche

#### P5-03 - Definir un score multidimensionnel

Dimensions possibles:

- precision
- completion
- time discipline
- stability under pressure
- verbalization quality

#### P5-04 - Ajouter des scorecards par skill et par format

Acceptance:

- le rapport final aide a choisir la suite

### Epic 5.3 - Rubrics et verbalization

#### P5-05 - Introduire une rubric v1

Usage:

- `OPEN_ENDED`
- certains `BUG_HUNT`
- futures sessions mock defense

#### P5-06 - Enrichir le rapport avec des actions concretes

Exemples:

- points a verbaliser
- erreurs recurrentes
- modules a retravailler
- prochaines reviews recommandees

### Epic 5.4 - Historique et trend mock

#### P5-07 - Trend long terme par template

Taches:

- moyenne mobile
- meilleur score
- regressions
- temps moyen

#### P5-08 - Lien mock -> plan de rattrapage

Taches:

- generer des CTA de review ou practice selon les chutes

### Epic 5.5 - Couverture test mock

#### P5-09 - Durcir les e2e mock

Scenarios:

- lancement template indisponible
- expiration de session
- completion mixed-format
- rapport final
- historique
- reprise de session si applicable

## Phase 6 - Experience catalogue, diagnostics et recommandations v2

### Objectif

Rendre le cockpit plus utile a mesure que le contenu grandit.

### Epic 6.1 - Catalogue v2

#### P6-01 - Ajouter des signaux par module

Exemples:

- volume de contenu
- formats disponibles
- progression par skill
- readiness estimee

#### P6-02 - Ajouter filtres et tri

Exemples:

- track
- level
- status de progression
- type de format

### Epic 6.2 - Module detail v2

#### P6-03 - Ajouter objectifs, prerequis et erreurs courantes

Pourquoi:

- deja recommandes par `ContentContract.md`

#### P6-04 - Ajouter launchers plus fins

Exemples:

- practice module
- review module
- mini-mock module

### Epic 6.3 - Recommandations plus intelligentes

#### P6-05 - Faire evoluer le moteur de recommendation

Nouveaux signaux:

- mocks rates
- confidence score de skill
- recent failures
- proximity to target role
- sprint mode deadline

#### P6-06 - Ajouter des recommandations contextualisees

Exemples:

- "tu prepares un entretien senior"
- "ta perf mock baisse sur X"
- "tu as des cartes dues sur Y"

## Phase 7 - Appropriation personnelle

### Objectif

Donner a l'utilisateur des primitives d'organisation personnelle.

### Epic 7.1 - Bookmarks

#### P7-01 - Toggle bookmark

Surfaces cibles:

- session
- review
- progress si pertinent
- rapport mock si question liee

#### P7-02 - Vue saved questions

Taches:

- route ou sous-page dediee
- tri
- empty state
- CTA pour relancer une session a partir des bookmarks

### Epic 7.2 - Notes

#### P7-03 - Note simple par question

Taches:

- create/update/delete
- lecture pendant ou apres la correction
- date de derniere mise a jour

#### P7-04 - Vue recap des notes

Exemples:

- notes recentes
- notes par module
- notes sur skill fragile

### Epic 7.3 - Playlists

#### P7-05 - Definir le modele playlist

Choix a faire:

- playlist manuelle
- playlist auto-generatee
- playlist mixte

#### P7-06 - Playlists v1

Cas d'usage:

- sprint d'entretien
- role cible
- reactivation de skill fragile

#### P7-07 - Launchers de session depuis playlist

Acceptance:

- l'utilisateur peut transformer sa curation en entrainement

## Phase 8 - Admin contenu et operations editoriales

### Objectif

Industrialiser la creation et la maintenance du contenu sans construire un CMS generique inutilement lourd.

### Epic 8.1 - Cadrage admin

#### P8-01 - Spec fonctionnelle admin v1

Workflows a couvrir:

- creer module
- creer skill
- creer question
- gerer traductions
- brouillon -> review -> published
- checklist publication
- import/export

#### P8-02 - Design des roles et permissions

Roles a evaluer:

- founder admin
- editor
- reviewer

### Epic 8.2 - Back-office minimal

#### P8-03 - Route admin + guard auth

Taches:

- definir zone admin
- restreindre aux roles admin/editor
- tracer les pages et layouts

#### P8-04 - CRUD modules et skills

Taches:

- liste
- create/edit
- status
- ordre
- traduction

#### P8-05 - CRUD questions et options

Taches:

- type de question
- metadata
- prompt/explanation/takeaways
- options
- skill links
- pitfall tags

### Epic 8.3 - Workflow editorial bilingue

#### P8-06 - Gestion de traduction et statut par locale

Taches:

- visualiser ce qui manque
- marquer `MISSING`, `IN_PROGRESS`, `REVIEW`, `READY`
- empecher `PUBLISHED` si la checklist n'est pas valide

#### P8-07 - Checklist de publication

Taches:

- traduire `ContentContract.md` en validations concretes
- afficher les blocages de publication

### Epic 8.4 - Operations contenu

#### P8-08 - Import/export seed-compatible

Pourquoi:

- garder une voie de travail hors UI

#### P8-09 - Vue editorial quality dashboard

Exemples:

- trous de traduction
- questions trop faibles
- modules sans assez de volume
- couverture par track/level/format

## Phase 9 - Lifecycle, emails et supports de retention

### Objectif

Introduire les mecanismes de reactivation et de communication produit.

### Epic 9.1 - Infrastructure email

#### P9-01 - Choisir et brancher le provider transactionnel

Contexte:

- `RESEND_API_KEY` est deja prevu dans la config locale

Taches:

- definir l'abstraction
- envoyer au minimum emails systeme utiles

#### P9-02 - Templates email localises

Templates minimum:

- bienvenue
- verification eventuelle si utile
- review reminder
- resume de progression hebdo plus tard

### Epic 9.2 - Retention et reminders

#### P9-03 - Reminders review et reprise de preparation

Taches:

- definir les triggers
- eviter le spam
- tenir compte des preferences

## Phase 10 - Billing et entitlements

### Objectif

Monetiser sans casser le coeur produit.

### Epic 10.1 - Modele business

#### P10-01 - Definir plans, quotas et entitlements

Decisions a fermer:

- free vs paid
- limites de mocks
- limites de playlists
- limites d'admin ou exports si besoin

#### P10-02 - Schema entitlements

Champs a envisager:

- plan
- status abonnement
- expiration
- quotas

### Epic 10.2 - Integration billing

#### P10-03 - Integrer le provider de paiement

Taches:

- checkout
- customer portal
- webhooks
- gestion des echecs de paiement

#### P10-04 - Gating produit

Surfaces cibles:

- mocks premium
- historique avance
- playlists
- futur open-ended avance

## Phase 11 - Analytics, observabilite, securite et accessibilite

### Objectif

Donner au produit un socle de pilotage et de fiabilite.

### Epic 11.1 - Analytics produit

#### P11-01 - Instrumenter les evenements critiques

Evenements minimum:

- signup completed
- onboarding completed
- session started
- session completed
- mock completed
- review launched
- bookmark created
- note created
- checkout completed

#### P11-02 - Funnel et activation

Metriques:

- visitor -> signup
- signup -> onboarding
- onboarding -> first practice
- first practice -> second session
- first mock

### Epic 11.2 - Observabilite

#### P11-03 - Error tracking et logs structures

Taches:

- erreurs serveur
- erreurs client
- traces sur server actions critiques

#### P11-04 - Monitoring des jobs et webhooks

Taches:

- emails
- billing
- imports

### Epic 11.3 - Accessibilite

#### P11-05 - Audit accessibilite des flows principaux

Priorites:

- auth
- onboarding
- session player
- dashboard

#### P11-06 - Keyboard support et semantics

Pourquoi:

- deja partiellement present dans le player
- a generaliser au reste du produit

### Epic 11.4 - Securite

#### P11-07 - Audit des gardes auth et admin

Taches:

- routes protegees
- server actions
- futur espace admin

#### P11-08 - Limites et protections

Exemples:

- rate limits auth
- rate limits actions sensibles
- verification des payloads volumineux

## Phase 12 - Growth, landing et SEO

### Objectif

Faire evoluer la surface publique une fois le coeur produit plus mature.

### Epic 12.1 - Landing v2

#### P12-01 - Aligner la landing sur les vraies features livrees

Taches:

- retirer les promesses trop avancees
- promouvoir les vraies forces du produit

#### P12-02 - Ajouter des preuves produit

Exemples:

- capture du dashboard reel
- schema d'entrainement
- parcours practice -> review -> mock

### Epic 12.2 - SEO

#### P12-03 - Meta, structured data et pages indexables

Taches:

- metadata
- open graph
- robots et sitemap

#### P12-04 - Strategie de contenu acquisition

Exemples:

- pages par track
- pages par module
- guides entretien

## 7. Backlog immediat recommande

Ordre strict des 15 prochains tickets:

1. P1-01 auditer les champs legacy encore necessaires
2. P1-03 introduire `ContentStatus`
3. P1-05 introduire les pitfall tags
4. P1-06 purger `demo-data.ts` des surfaces produit
5. P2-01 redesign du modele `Attempt`
6. P2-03 scinder `SessionPlayer`
7. P2-05 builder compatible multi-format
8. P3-01 a P3-04 livrer `MULTIPLE_CHOICE`
9. P4-01 revoir `QuestionProgress`
10. P4-03 enrichir `SkillProgress`
11. P4-05 expliquer la progression dans le dashboard
12. P5-01 etendre les templates mock
13. P5-03 definir le score mock multidimensionnel
14. P7-01 ouvrir bookmarks
15. P8-01 spec admin v1

## 8. Sequence de delivery recommandee

## Bloc A - Foundation hardening

Contenu:

- Phase 0
- Phase 1
- debut Phase 2

Resultat:

- schema et repository prets pour le vrai multi-format

## Bloc B - Multi-format product core

Contenu:

- fin Phase 2
- Phase 3
- debut Phase 4

Resultat:

- practice et review depassent le single-choice

## Bloc C - Pedagogical depth

Contenu:

- fin Phase 4
- Phase 5
- Phase 6

Resultat:

- vraie boucle diagnostic -> entrainement -> mock -> rattrapage

## Bloc D - Retention and operations

Contenu:

- Phase 7
- Phase 8
- Phase 9

Resultat:

- produit plus durable et contenu industrialisable

## Bloc E - Business and scale

Contenu:

- Phase 10
- Phase 11
- Phase 12

Resultat:

- monetisation, pilotage, acquisition et fiabilite

## 9. Travail parallelisable

Peut avancer en parallele du core product:

- extension du seed
- definition des rubrics `OPEN_ENDED`
- spec admin v1
- instrumentation analytics minimale
- audit accessibilite
- storyboard lifecycle emails

Ne doit pas bloquer le coeur produit:

- billing
- growth SEO
- emails avances

## 10. Definition of Done additionnelle par categorie

### Pour le schema

- migration reversible ou defendable
- seed adapte
- tests schema/services adaptes

### Pour le contenu

- FR et EN renseignes ou statut explicite
- checklist editoriale respectee

### Pour le player

- navigation
- correction
- reprise
- persistence
- comportement mobile

### Pour la progression

- formule explicable
- read model comprehensible
- tests de scenario

### Pour les mocks

- template reel
- rapport utile
- CTA post-session

### Pour l'admin

- guard auth
- workflow publication
- validation utile

## 11. Risques majeurs et mitigations

### Risque A - Empiler des formats sans refondre `Attempt`

Impact:

- dette grave et regressions rapides

Mitigation:

- traiter `Attempt` avant `MULTIPLE_CHOICE` end-to-end

### Risque B - Ouvrir l'admin avant le contrat multi-format

Impact:

- rework important du back-office

Mitigation:

- lancer la spec admin tot
- lancer l'implementation admin apres la stabilisation du runtime multi-format

### Risque C - Augmenter le volume de contenu sans taxonomie exploitable

Impact:

- dilution de la qualite

Mitigation:

- introduire status, pitfall tags, checklist et quality dashboard

### Risque D - Faire des mocks trop intelligents avant d'avoir assez de contenu

Impact:

- experience creuse et repetive

Mitigation:

- fixer des cibles minimales de contenu avant mock mixed-format

### Risque E - Passer trop tot au business stack

Impact:

- coeur produit encore incomplet

Mitigation:

- monetisation seulement apres bookmarks/notes et amorce admin

## 12. Recommandation finale

Si l'objectif est de faire "tout le developpement restant" dans le bon ordre, la bonne lecture est:

1. phase 1 pour clarifier le domaine
2. phase 2 et 3 pour ouvrir le moteur pedagogique
3. phase 4 et 5 pour rendre la progression et les mocks vraiment convaincants
4. phase 7 et 8 pour rendre le produit durable et content-scalable
5. phase 10 a 12 seulement quand le coeur pedagogique est fort

En pratique, le plus important n'est pas d'ajouter beaucoup de pages.
Le plus important est de verrouiller:

- le modele de contenu
- le modele de reponse
- le moteur de progression
- le contrat des mocks
- la capacite a produire du contenu de qualite
