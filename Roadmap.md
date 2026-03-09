# React Mentor Roadmap

Derniere mise a jour: 9 mars 2026

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
- [ContinuationPlan.md](./ContinuationPlan.md)
- [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)
- [BuildTracker.md](./BuildTracker.md)
- [ContentExpansionTracker.md](./ContentExpansionTracker.md)
- [LearningSystemImprovements.md](./LearningSystemImprovements.md)
- [Taxonomy.md](./Taxonomy.md)
- [ContentContract.md](./ContentContract.md)
- [DashboardReadModel.md](./DashboardReadModel.md)

Note:

- [ContentExpansionTracker.md](./ContentExpansionTracker.md) est la source de verite pour le programme editorial `learn`, le benchmark GreatFrontEnd et le backlog detaille du contenu pedagogique a produire
- [LearningSystemImprovements.md](./LearningSystemImprovements.md) est la source de verite pour les ameliorations cross-surface du systeme d'apprentissage, du tracking et de la partie cours

## 2. Etat des lieux du projet

### 2.1 Ce qui existe deja

Le projet dispose maintenant d'une vraie base produit exploitable:

- landing page premium, brandee, bilingue FR/EN
- auth Better Auth avec email/password et provider Google si configure
- dashboard protege avec sidebar retractable, shell localise et recommandations dynamiques
- `learn` public comme teaser editorial, avec `dashboard/learn` comme workspace protege pour la boucle complete cours -> checkpoint -> review/practice
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

- le reliquat `demo-data.ts` est maintenant cantonne a la couche marketing / auth et a quelques helpers de transition, plus aux surfaces produit authentifiees principales
- le modele legacy monolingue reste encore present dans le schema et certains fallbacks
- le player couvre deja `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT`, mais pas encore les formats plus riches du type `architecture choice` ou `explain this snippet`
- le builder mock est deja mixed-format, et `learn` dispose maintenant d'un premier loop `cours -> signal -> practice/review`, mais la boucle pedagogique complete reste encore inachevee
- la calibration long terme de `SkillProgress` reste a enrichir par davantage de signaux et de seuils d'acceptation
- l'admin de contenu v1 existe et expose deja une queue de freshness review et un watch de doublons de prompts, mais les operations editoriales bulk, la deduplication benchmark et la QA pedagogique complete restent a industrialiser
- notes, bookmarks et playlists sont ouverts, mais ne forment pas encore un vrai workspace d'apprentissage personnel et recommande
- billing Stripe, entitlements, lifecycle emails, telemetry produit et Sentry sont poses, mais la couche ops/performance reste encore partielle
- les reponses ouvertes guidees, la review structuree et les rubrics mock existent deja, mais leur exploitation dans les recommandations et le coaching reste encore trop limitee

### 2.3 Conclusion de l'audit

React Mentor n'est plus seulement une fondation credible. C'est deja une vertical slice produit reelle.

Le chantier principal n'est donc plus "brancher les premieres vraies donnees". Le chantier principal devient:

- terminer la sortie du legacy demo / monolingue
- densifier fortement le contenu `learn` et la profondeur pedagogique question par question
- relier plus etroitement la bibliotheque `learn`, les sessions, la review et les recommandations
- industrialiser la production de contenu et les operations editoriales
- renforcer le tracking, l'observabilite et la qualite produit sur les surfaces deja live

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

### 2.5 Etat du programme contenu

Le chantier contenu n'est plus theorique.

Il existe deja:

- un modele editorial assez riche pour porter de vrais mini-cours par question
- une premiere bibliotheque `learn` publique exploitable
- plusieurs familles de contenu deja semees sur React, JavaScript, React Native et Frontend Systems

Ce qui reste a faire maintenant n'est pas d'inventer la structure.
Ce qui reste a faire, c'est d'augmenter fortement:

- le volume
- la couverture des familles React avancees
- la profondeur pedagogique question par question
- la deduplication editoriale entre sources benchmark

Le plan detaille de ce programme est maintenu dans [ContentExpansionTracker.md](./ContentExpansionTracker.md).

### 2.6 Etat consolide au 8 mars 2026

Vue produit:

- fondation SaaS solide et exploitable en public
- vertical slices onboarding, dashboard, practice, review, mock, notes, bookmarks, playlists, billing et admin deja ouvertes
- bibliotheque `learn` publique reelle comme teaser d'acquisition, prolongee par `dashboard/learn` pour l'experience detaillee connectee

Vue contenu:

- couverture `learn` deja semee sur React fundamentals, hooks, advanced, router, i18n, testing, JavaScript, React Native et Frontend Systems
- benchmark GreatFrontEnd cartographie et suivi dans [ContentExpansionTracker.md](./ContentExpansionTracker.md)
- principal manque actuel: volume, profondeur et reliaisons pedagogiques entre cours, verification, practice et review

Vue plateforme:

- telemetry produit, logs operationnels, lifecycle emails et Sentry sont branches
- la matrice e2e est en place
- principal manque actuel: monitoring performance plus profond, alertes endpoint et fermeture des derniers trous analytics

Vue apprentissage:

- le produit sait deja recommander, scorer, reviser et prioriser
- il ne sait pas encore assez bien transformer la consommation de cours en plan adaptatif, en checkpoints de comprehension et en progression visible par concept

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

- `/dashboard/admin`
- `/dashboard/admin?tab=modules`
- `/dashboard/admin?tab=skills`
- `/dashboard/admin?tab=questions`
- `/dashboard/admin?tab=imports`
- `/dashboard/admin?tab=analytics`
- `/dashboard/admin?tab=operations`

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

## 9. Gaps techniques a adresser avant les prochaines grosses features

### 9.1 Fin du legacy demo et cleanup final du monolingue

Le projet est deja majoritairement branche sur de vraies donnees, mais il reste:

- quelques residus de `demo-data.ts`
- des champs legacy monolingues encore presents pour compatibilite
- des zones de transition a simplifier dans certains read models

### 9.2 Rich content et structure pedagogique plus forte

Le contenu `learn` est deja assez riche, mais il reste encore limite par une structure essentiellement textuelle.

Evolutions probables:

- markdown / mdx ou structure bloc plus riche
- callouts pedagogiques standardises
- mini checks integres dans les pages cours
- references croisees entre cours, questions et exercices

### 9.3 Tracking d'apprentissage plus fin

Le produit suit deja sessions, attempts, `QuestionProgress`, `SkillProgress`, analytics produit et evenements ops.

Le gap actuel n'est plus "avoir du tracking".
Le gap actuel est:

- mieux distinguer consommation de cours, comprehension, memorisation et restitution
- relier la lecture d'un cours a un veritable signal d'apprentissage
- expliciter davantage le "pourquoi" derriere les recommandations et les plans de review

### 9.4 Analytics, observabilite et performance

Les fondations sont la:

- `ProductAnalyticsEvent`
- `OperationalEvent`
- Sentry
- monitoring jobs/webhooks
- matrice e2e CI

Les vrais gaps restants sont:

- monitoring performance plus pousse
- alertes endpoint / cron plus robustes
- quelques trous analytics de surface
- meilleure lecture produit de l'efficacite pedagogique

### 9.5 Industrialisation editoriale

L'admin contenu v1 existe deja, mais il faut encore:

- batcher la production et la QA
- dedupliquer proprement le benchmark externe
- mieux piloter la couverture par famille, niveau et format
- faciliter les mises a jour editoriales a grand volume

## 10. Phases de roadmap

| Phase   | Objectif                                    | Resultat concret                                                    | Etat au 8 mars 2026 |
| ------- | ------------------------------------------- | ------------------------------------------------------------------- | ------------------- |
| Phase 0 | Fondation deja en place                     | landing, auth, i18n UI, dashboard shell, schema, tests auth, CI     | DONE                |
| Phase 1 | Rendre le produit reel                      | onboarding, vrai catalogue, vraies requetes, vrai moteur de session | DONE                |
| Phase 2 | Installer la pedagogie                      | player de questions, corrections profondes, review queue, mastery   | DONE                |
| Phase 3 | Installer la valeur premium                 | mock interviews, notes, recommandations, plan de revision           | DONE                |
| Phase 4 | Industrialiser le contenu                   | admin, import, traduction, QA editoriale, versioning                | PARTIAL             |
| Phase 5 | Activer le business et la couche plateforme | billing, emails lifecycle, acquisition SEO, analytics               | PARTIAL             |
| Phase 6 | Renforcer le learning system                | cours relies au tracking, checkpoints, plans adaptatifs, densite    | IN_PROGRESS         |

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

Etat au 8 mars 2026:

- couche d'entitlements interne posee
- gating modules, mocks et playlists visible dans le dashboard
- Stripe, lifecycle emails et gating premium sont deja relies
- restent surtout l'exploitation reelle en production, les parcours upgrade plus riches et le monitoring billing

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

Etat au 8 mars 2026:

- checkout abonnement branche
- billing portal branche
- webhook Stripe de synchronisation abonnement branche
- configuration environnement et e2e billing encore a realiser en conditions reelles

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

Etat repo au 8 mars 2026:

- provider Resend branche serveur
- welcome email localise declenche a la fin de l'onboarding
- job protege `review-due-reminders` disponible pour les rappels de review
- opt-out lifecycle persistant dans les settings
- weekly summary, nudge inactivite et upgrade prompt restent a produire

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

Etat repo au 8 mars 2026:

- fondation Prisma `ProductAnalyticsEvent` en place
- funnel admin v1 visible dans `/dashboard/admin`
- instrumentation posee sur signup email, onboarding, creation/completion de session, answers, bookmarks, notes, upgrade click, checkout et abonnement Stripe
- restent les trous sur certains parcours historiques et la generalisation a tous les signups sociaux / reviews completes

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

Etat repo au 8 mars 2026:

- journal structure `OperationalEvent` en base
- monitoring admin v1 pour webhook Stripe et imports contenu
- monitoring admin et jobs lifecycle etendu aux emails Resend et au batch review reminder
- traces d'erreur ajoutees sur onboarding, sessions, billing webhook et import admin
- Sentry Next.js est maintenant branche au runtime App Router avec `instrumentation.ts`, capture client/server/edge et `global-error`
- la matrice e2e CI repo passe maintenant de bout en bout
- restent surtout le monitoring performance plus profond, les alertes endpoint et quelques trous analytics de surface

Besoin:

- error tracking
- performance monitoring
- alertes sur endpoints critiques

Outil recommande:

- Sentry

### RM-1203 - Matrice de tests complete [P0]

Objectif:
Faire grandir le produit sans le casser.

Etat repo au 8 mars 2026:

- suite Vitest et validations `lint` / `typecheck` / `build` passent
- e2e existants sur auth, practice, dashboard, mock et settings
- restent surtout les parcours review dedies, billing reel et davantage d'integration tests server actions

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

## 13. Ordre de developpement recommande a partir de maintenant

Si on optimise pour le ratio valeur / effort depuis l'etat actuel du repo, l'ordre recommande devient:

1. densifier fortement `learn` jusqu'a une couverture benchmark credibe sur React, JavaScript et Frontend Systems
2. relier chaque cours a des mini verifications, de la pratique ciblee et des parcours associes
3. enrichir le tracking d'apprentissage pour distinguer lecture, comprehension, restitution et rechute
4. transformer notes, bookmarks, playlists et recovery plans en vrai workspace personnel d'apprentissage
5. industrialiser l'admin contenu pour la production en volume, la QA pedagogique et la deduplication benchmark
6. fermer les derniers gaps analytics, monitoring perf et alertes endpoint
7. renforcer billing/lifecycle/retenion avec des parcours d'upgrade et de reactivation plus intelligents
8. ouvrir plus tard les couches SEO/resources/lead magnet quand la densite pedagogique est suffisante

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

Document associe pour le prochain niveau d'execution:

- [LearningSystemImprovements.md](./LearningSystemImprovements.md)
