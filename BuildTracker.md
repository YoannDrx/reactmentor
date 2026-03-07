# React Mentor Build Tracker

Derniere mise a jour: 7 mars 2026

## 1. Role du document

Ce document est la source de suivi de delivery.

Regle de travail:

- chaque avancee significative doit etre tracee ici
- chaque ticket termine doit passer en `DONE`
- chaque nouveau chantier important doit etre marque `IN_PROGRESS`
- les documents de reference concernes doivent etre cites

## 2. Statut global

- current_phase: `Lots 1, 6, 7 and 8 in progress`
- current_focus: `Legacy content cleanup remains open, while mastery calibration now includes coverage caps and the next mock priority is deeper builder composition beyond the current single-choice presets`
- last_completed_lot: `Lot 3`
- active_ticket: `L7-03 calibrate mastery scoring`

## 3. Statut des lots

| Lot | Nom | Statut | Notes |
| --- | --- | --- | --- |
| 0 | Stabilisation de base | DONE | Taxonomie, contrat contenu et read models documentes |
| 1 | Data model v2 et contenu bilingue | IN_PROGRESS | tables de traduction, migration, seed et repository localise poses |
| 2 | Onboarding et preferences | DONE | gate first-run, wizard onboarding, settings relies et recommandation initiale branches |
| 3 | Dashboard reel v1 | DONE | overview, progress, review, recommandations et tests d'integration dashboard relies aux vraies donnees |
| 4 | Catalogue modules et pages detail | PARTIAL | catalogue et detail module branches sur la vraie couche contenu |
| 5 | Session engine | DONE | builder, reprise, creation, fin de session et couverture unitaire critiques en place |
| 6 | Question player et attempts | IN_PROGRESS | player single-choice stable, recovery inline et parcours e2e practice/auth verifies |
| 7 | Review queue et mastery | IN_PROGRESS | queue priorisee et lancement review live, scoring de maitrise maintenant pondere mais encore perfectible |
| 8 | Mock interviews | PARTIAL | templates, timer, rapport, historique et e2e bout en bout sont relies; composition mock plus profonde encore absente |
| 9 | Notes, bookmarks, playlists | TODO | depend du lot 6 minimum |
| 10 | Admin et operations contenu | TODO | depend des lots coeur |
| 11 | Billing et entitlements | TODO | apres validation coeur produit |
| 12 | Growth, analytics et plateforme | TODO | chantier continu |

## 4. Statut des tickets immediats

| Ticket | Titre | Statut | Reference |
| --- | --- | --- | --- |
| L0-01 | Figer la taxonomie officielle | DONE | [Taxonomy.md](./Taxonomy.md) |
| L0-02 | Figer les enums de statut | DONE | [Taxonomy.md](./Taxonomy.md) |
| L0-03 | Definir le contrat editorial | DONE | [ContentContract.md](./ContentContract.md) |
| L0-04 | Definir les read models du dashboard | DONE | [DashboardReadModel.md](./DashboardReadModel.md) |
| L1-01 | Ajouter les traductions de modules | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L1-02 | Ajouter les traductions de skills | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L1-03 | Ajouter les traductions de questions | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L1-04 | Ajouter les traductions d'options | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L1-05 | Migrer le contenu monolingue | IN_PROGRESS | fallback legacy encore present dans le schema et les services |
| L1-08 | Refondre le seed | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L1-09 | Repository functions localisees | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L1-10 | Tests schema et contenu localise | DONE | [__tests__/content-repository.test.ts](./__tests__/content-repository.test.ts) |
| L2-01 | Auditer `UserPreference` et completer le schema | DONE | schema actuel suffisant pour v1 settings, aucune migration requise |
| L2-02 | Construire le flux first-run | DONE | [src/app/onboarding/page.tsx](./src/app/onboarding/page.tsx) |
| L2-03 | Onboarding step 1: objectif | DONE | [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx) |
| L2-04 | Onboarding step 2: tracks | DONE | [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx) |
| L2-05 | Onboarding step 3: cadence | DONE | [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx) |
| L2-06 | Persist and redirect | DONE | [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts) |
| L2-07 | Settings relies aux preferences | DONE | [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx) |
| L2-08 | Recommandation initiale | DONE | [src/features/dashboard/dashboard-recommendations.ts](./src/features/dashboard/dashboard-recommendations.ts) |
| L3-01 | Definir les aggregates SQL/Prisma | DONE | [DashboardReadModel.md](./DashboardReadModel.md) |
| L3-02 | Creer `dashboard-read-model` | DONE | [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) |
| L3-03 | Brancher `/dashboard` sur de vraies donnees | DONE | [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx) |
| L3-04 | Brancher `/dashboard/progress` sur de vraies donnees | DONE | [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) |
| L3-05 | Brancher `/dashboard/review` sur de vraies donnees | DONE | [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) |
| L3-06 | Modules relies aux vraies donnees | DONE | [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx) |
| L3-07 | Empty states et first-use UX | DONE | recommendations premier run, CTA utiles et shell dynamique relies aux vraies donnees |
| L3-08 | Tests d'integration dashboard | DONE | [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) et [__tests__/dashboard-recommendations.test.ts](./__tests__/dashboard-recommendations.test.ts) |
| L4-01 | Route detail module | DONE | [ExecutionPlan.md](./ExecutionPlan.md) |
| L5-01 | Specifier le contrat `TrainingSession` | DONE | [TrainingSessionContract.md](./TrainingSessionContract.md) |
| L5-02 | Creer le service de session builder | DONE | [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) |
| L5-03 | Implementer la selection de questions v1 | DONE | [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) |
| L5-04 | Route ou server action `createTrainingSession` | DONE | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) |
| L5-05 | Reprise de session | DONE | [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) |
| L5-06 | Fin de session | DONE | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) |
| L5-07 | Tests engine | DONE | [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts) |
| L6-01 | Route `/dashboard/session/[id]` | DONE | [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) |
| L6-02 | Construire `QuestionPlayer` | PARTIAL | player single-choice branche avec feedback/recovery dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-03 | Persist attempts | DONE | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) |
| L6-04 | Brancher la correction immediate | DONE | [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-05 | Navigation player | DONE | reset deterministic par question, clavier et transitions avances dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-06 | Error and recovery states | DONE | recovery inline, retry/save et fallback dashboard dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-07 | e2e practice flow | DONE | [e2e/practice.spec.ts](./e2e/practice.spec.ts) et [e2e/auth.spec.ts](./e2e/auth.spec.ts) |
| L7-01 | Implementer l'engine `QuestionProgress` | DONE | [src/features/sessions/session-progress.ts](./src/features/sessions/session-progress.ts) |
| L7-02 | Mettre a jour `QuestionProgress` apres chaque attempt | DONE | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) |
| L7-03 | Agreger `SkillProgress` | PARTIAL | scoring pondere par difficulte, penalites recentes et garde-fou de couverture en place; calibration long terme encore a enrichir |
| L7-04 | Construire la review queue priorisee | DONE | [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) |
| L7-05 | Mode review | DONE | builder `REVIEW`, launcher et surface dashboard relies a la queue due reelle |
| L7-06 | Brancher `/dashboard/review` et `/dashboard/progress` | DONE | vraie queue, CTA review, progression et empty states relies aux recommandations |
| L7-07 | Tests de logique mastery | DONE | [__tests__/session-progress.test.ts](./__tests__/session-progress.test.ts), [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts), [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts) et [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) |
| L8-01 | Definir les templates de mock | DONE | [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts) et [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) |
| L8-02 | Etendre le session builder au mode mock | PARTIAL | presets mock, budget temps et priorisation builder en place; composition multi-format et scoring specifique encore absents |
| L8-03 | UI de timer et de pression | DONE | [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts) |
| L8-04 | Rapport de mock | DONE | rapport de fin avec score, timing, pression, skill breakdown, risques et points a verbaliser |
| L8-05 | Historique de mocks | DONE | historique mock avec vue synthetique, tendances, signaux par template et liens vers les rapports |
| L8-07 | e2e mock mode | DONE | couverture e2e du lancement mock, completion et consultation du rapport dans [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) |

## 5. Journal de travail

### 2026-03-06

Travail effectue:

- creation de [Roadmap.md](./Roadmap.md)
- creation de [ExecutionPlan.md](./ExecutionPlan.md)
- creation de [Taxonomy.md](./Taxonomy.md)
- creation de [ContentContract.md](./ContentContract.md)
- creation de [DashboardReadModel.md](./DashboardReadModel.md)
- creation de [BuildTracker.md](./BuildTracker.md)
- ajout du schema bilingue dans [prisma/schema.prisma](./prisma/schema.prisma)
- creation de la migration `add_content_translations`
- refonte bilingue du seed dans [prisma/seed.ts](./prisma/seed.ts)
- creation du repository de contenu localise dans [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- branchement de la bibliotheque modules sur les vraies donnees dans [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx)
- creation de la page detail module dans [src/app/dashboard/modules/[slug]/page.tsx](./src/app/dashboard/modules/[slug]/page.tsx)
- ajout de tests de localisation dans [__tests__/content-repository.test.ts](./__tests__/content-repository.test.ts)

Decision prise:

- le lot 0 est considere termine
- le lot 1 est officiellement demarre
- le schema bilingue devient la priorite absolue avant onboarding et dashboard reel
- la bibliotheque modules passe en mode reel avant le reste du dashboard

Validation effectuee:

- `pnpm prisma migrate dev --name add_content_translations`
- `pnpm prisma:seed`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:ci`

### 2026-03-07

Travail effectue:

- creation du service [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- refonte des charts dashboard en composants pilotes par props dans [src/features/dashboard/dashboard-charts.tsx](./src/features/dashboard/dashboard-charts.tsx)
- branchement de [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx) sur les vraies aggregations overview
- branchement de [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) sur les vraies aggregations progress
- branchement de [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) sur les vraies aggregations review
- creation du snapshot shell dans [src/features/dashboard/dashboard-shell-data.ts](./src/features/dashboard/dashboard-shell-data.ts)
- branchement du shell dashboard sur les vraies donnees de due reviews, readiness et cible active dans [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx)
- creation du service preferences dans [src/features/settings/user-preferences.ts](./src/features/settings/user-preferences.ts)
- creation de l'etat partage settings dans [src/features/settings/settings.state.ts](./src/features/settings/settings.state.ts)
- creation de la validation partagee settings dans [src/features/settings/settings.validation.ts](./src/features/settings/settings.validation.ts)
- creation de la server action settings dans [src/features/settings/settings.action.ts](./src/features/settings/settings.action.ts)
- creation du formulaire editable dans [src/features/settings/settings-form.tsx](./src/features/settings/settings-form.tsx)
- branchement de [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx) sur les vraies preferences utilisateur
- creation du wizard onboarding dans [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx)
- creation de la server action onboarding dans [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts)
- creation de la route protegee [src/app/onboarding/page.tsx](./src/app/onboarding/page.tsx)
- ajout du gate first-run dans [src/app/dashboard/layout.tsx](./src/app/dashboard/layout.tsx)
- creation de [TrainingSessionContract.md](./TrainingSessionContract.md)
- creation du contrat TypeScript dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts)
- creation du builder de session dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)
- creation du moteur de progression question dans [src/features/sessions/session-progress.ts](./src/features/sessions/session-progress.ts)
- creation des server actions de session dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- creation de la vue serveur de session dans [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)
- creation du player single-choice dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- creation de la route live [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)
- branchement du lancement practice depuis [src/app/dashboard/modules/[slug]/page.tsx](./src/app/dashboard/modules/[slug]/page.tsx)
- branchement du lancement mock depuis [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx)
- branchement de la progression reelle modules dans [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx)
- extension du repository contenu avec progression utilisateur dans [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- ajout des tests [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts)
- ajout des tests [__tests__/user-preferences.test.ts](./__tests__/user-preferences.test.ts)
- ajout des tests [__tests__/session-progress.test.ts](./__tests__/session-progress.test.ts)
- ajout des tests [__tests__/session-contract.test.ts](./__tests__/session-contract.test.ts)
- durcissement du player avec reset deterministic par question, retry inline et transitions de navigation dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- ajout de la cle de remount sur le player dans [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)
- durcissement de la config e2e avec prebuild et serveur local fixe dans [package.json](./package.json), [playwright.config.ts](./playwright.config.ts) et [eslint.config.mjs](./eslint.config.mjs)
- alignement des specs e2e auth/practice sur l'onboarding et les fins de session a une seule question dans [e2e/auth.spec.ts](./e2e/auth.spec.ts) et [e2e/practice.spec.ts](./e2e/practice.spec.ts)
- ajout des tests builder dans [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts)
- ouverture du mode `REVIEW` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) avec selection des cartes dues reelles
- transformation de [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) en point d'entree actionnable pour lancer une session review
- extension des messages review FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- extension des tests builder review dans [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts)
- creation du scoring de maitrise pondere dans [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts)
- branchement du nouveau scoring dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- ajout des tests [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts)
- creation du contrat [src/features/dashboard/dashboard-recommendation-contract.ts](./src/features/dashboard/dashboard-recommendation-contract.ts)
- creation du moteur de recommandation dans [src/features/dashboard/dashboard-recommendations.ts](./src/features/dashboard/dashboard-recommendations.ts)
- branchement des recommandations et du focus dynamique dans [src/features/dashboard/dashboard-shell-data.ts](./src/features/dashboard/dashboard-shell-data.ts) et [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx)
- ajout d'un bloc "recommended next step" sur [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx)
- ajout d'un parcours module recommande, d'un badge sur la bibliotheque et de CTA relies dans [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx)
- enrichissement des empty states de progression avec CTA relies aux recommandations dans [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx)
- extension des messages dashboard FR/EN pour les recommandations et le focus dynamique dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout des tests [__tests__/dashboard-recommendations.test.ts](./__tests__/dashboard-recommendations.test.ts)
- extension des e2e dashboard avec le parcours first-run recommande dans [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)
- extraction d'un historique mock reel dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- branchement de [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) sur les vraies `TrainingSession` mock au lieu du contenu de demonstration
- mapping des titres de templates et des etats vides mock dans [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx)
- ajout des tests d'historique mock dans [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts)
- enrichissement du contrat de session mock avec budget temps dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts)
- creation des helpers de timing et de lecture de pression dans [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts)
- ajout de la cloture explicite de session dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- durcissement du backend attempt pour refuser une reponse sur une session mock expiree dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- enrichissement de la vue session avec timing et premier rapport mock dans [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)
- ajout du timer live et de l'auto-cloture a expiration dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- enrichissement de la page [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) avec rapport mock, budget temps et verdict de pression
- extension des messages session FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout des tests [__tests__/session-timing.test.ts](./__tests__/session-timing.test.ts)
- extension des tests contrat mock dans [__tests__/session-contract.test.ts](./__tests__/session-contract.test.ts)
- extension de l'e2e mock/dashboard pour verifier le timer visible dans [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)
- creation du rapport mock approfondi dans [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts)
- enrichissement de [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) avec skill breakdown, risques et points a verbaliser
- enrichissement de [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) avec sections detaillees de rapport mock
- creation d'un read model mock synthetique dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- enrichissement de [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) avec overview, tendances, signaux par template et liens vers les rapports
- ajout des tests [__tests__/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts)
- enrichissement des tests [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour les signaux mock
- creation du helper e2e [e2e/test-helpers.ts](./e2e/test-helpers.ts) pour completer une session structuree
- ajout de la spec [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) pour couvrir fin de mock et historique
- recalibrage de [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts) avec garde-fou de couverture par question et diversite de difficulte
- enrichissement de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour alimenter `SkillProgress` avec le `questionId`
- extension des tests [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts) avec verification du cap de couverture

Decision prise:

- le schema `UserPreference` existant est suffisant pour lancer la personnalisation v1
- le role cible devient obligatoire pour que le gate first-run et le dashboard restent coherents
- le shell dashboard passe en mode "signal reel" pour la readiness, la review due et la cible active
- la session v1 se limite volontairement aux questions single-choice pour livrer une vertical slice finie
- la vertical slice practice est consideree comme suffisamment stable pour ouvrir la phase review/mastery
- la priorite suivante redevient le cleanup legacy, l'ouverture de la vraie review queue et les tests d'integration dashboard
- le mode review est maintenant branche sur les cartes dues reelles, mais le calcul de maitrise par skill doit encore gagner en finesse avant de clore le lot 7
- `SkillProgress` ne doit plus etre un simple taux brut; la ponderation par difficulte et les echecs recents sont maintenant prises en compte dans le score v1
- le dashboard doit maintenant orienter l'utilisateur avec une prochaine action reelle, pas seulement afficher des cartes de diagnostic
- la recommandation v1 priorise la review due avant de proposer le meilleur module a ouvrir selon les preferences et la progression
- les textes statiques de shell qui simulaient un plan de travail sont remplaces par un focus dynamique derive du moteur de recommandation
- la page mock ne doit plus raconter une activite fictive; l'historique visible dans l'app authentifiee doit venir des sessions reelles
- un mock ne doit plus se comporter comme une simple practice session: le budget temps et la pression doivent etre visibles pendant la session
- l'expiration du temps doit etre geree aussi cote serveur pour eviter les soumissions hors budget
- le rapport mock v1 peut rester concis, mais il doit deja exposer temps utilise, budget et verdict de pression
- le rapport mock n'est plus limite a un verdict global; il doit deja pointer les skills fragiles, les erreurs majeures et les arguments a verbaliser
- l'historique mock doit aider a choisir le prochain preset, pas seulement lister les sessions terminees
- la couverture e2e mock doit aller jusqu'au rapport final pour verrouiller le mode timed end-to-end
- un skill ne doit plus pouvoir sembler maitrise sur un signal trop sparse; la couverture par question et la diversite de difficulte doivent plafonner le score

Validation effectuee:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:ci`
- `pnpm build`
- `pnpm test:e2e:ci`

## 6. Regles de mise a jour

A chaque session de travail, il faudra mettre a jour:

1. `BuildTracker.md`
2. le document de reference impacte
3. `ExecutionPlan.md` si un ticket change de statut global

## 7. Prochaine action recommandee

Commencer:

- `L1-05`
- `L7-03`
- `L8-02`
- `L6-02`
- `L8-06`

But:

- terminer la sortie du modele monolingue historique
- renforcer le scoring de maitrise et la logique review maintenant que le mode review est live
- etendre le moteur mock au-dela des presets single-choice actuels
- completer le player pour sortir du single-choice strict
- decider l'ouverture du mode mock vers une reponse plus verbale ou guidee
