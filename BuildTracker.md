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

- current_phase: `Lots 7, 8 and 9 in progress`
- current_focus: `bookmarks, notes personnelles et analytics mock par critere sont maintenant relies; la prochaine priorite coeur devient la synthese de faiblesse cross-surface et l'ouverture des playlists`
- last_completed_lot: `Lot 6`
- active_ticket: `L8-06 synthese de faiblesse multi-surface`
- continuation_plan: [ContinuationPlan.md](./ContinuationPlan.md)
- master_plan: [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)

## 3. Statut des lots

| Lot | Nom | Statut | Notes |
| --- | --- | --- | --- |
| 0 | Stabilisation de base | DONE | Taxonomie, contrat contenu et read models documentes |
| 1 | Data model v2 et contenu bilingue | DONE | tables de traduction, enums editoriaux, pitfall tags, migration, seed et repository localise poses; runtime et seed ne dependent plus du legacy monolingue |
| 2 | Onboarding et preferences | DONE | gate first-run, wizard onboarding, settings relies et recommandation initiale branches |
| 3 | Dashboard reel v1 | DONE | overview, progress, review, recommandations et tests d'integration dashboard relies aux vraies donnees |
| 4 | Catalogue modules et pages detail | PARTIAL | catalogue et detail module branches sur la vraie couche contenu |
| 5 | Session engine | DONE | builder, reprise, creation, fin de session et couverture unitaire critiques en place |
| 6 | Question player et attempts | DONE | player par renderers sur formats fermes, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT` en practice, payload d'attempt extensible, `Attempt.isCorrect` nullable, contextData localise et parcours e2e practice/review verifies |
| 7 | Review queue et mastery | IN_PROGRESS | queue priorisee, pending manual review live avec verdicts manuels, `SkillProgress` enrichi, `QuestionProgress` v2 branche et raisons `mockFallout`/`weakSkill` posees; calibration long terme et shortcuts de review restent a finir |
| 8 | Mock interviews | PARTIAL | templates, timer, historique, rapport pending-review-aware, composition mixed-format, review structuree persistante et analytics par critere sur la page mock sont relies; la synthese de faiblesse et les recommandations derivees restent ouvertes |
| 9 | Notes, bookmarks, playlists | IN_PROGRESS | bookmarks et notes produits relies depuis session/review/mock avec recap dediee; les playlists restent a ouvrir |
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
| L1-05 | Migrer le contenu monolingue | DONE | runtime localise sans fallback legacy dans [src/lib/content-repository.ts](./src/lib/content-repository.ts), schema legacy assoupli dans [prisma/schema.prisma](./prisma/schema.prisma) et migration [prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql](./prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql) |
| L1-06 | Introduire les tags de pieges | DONE | [prisma/schema.prisma](./prisma/schema.prisma), [prisma/seed.ts](./prisma/seed.ts) et [prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql](./prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql) |
| L1-07 | Introduire les statuses editoriaux | DONE | [prisma/schema.prisma](./prisma/schema.prisma), [src/lib/content-repository.ts](./src/lib/content-repository.ts) et [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) |
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
| L6-02 | Construire `QuestionPlayer` | DONE | architecture par renderers avec formats `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT` dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/session-player-renderers.tsx](./src/features/sessions/session-player-renderers.tsx) |
| L6-03 | Persist attempts | DONE | persistance additive `responseData`, compatibilite `selectedOptionIds` et semantique `isCorrect nullable` pour pending review dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) et [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts) |
| L6-04 | Brancher la correction immediate | DONE | [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-05 | Navigation player | DONE | reset deterministic par question, clavier et transitions avances dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-06 | Error and recovery states | DONE | recovery inline, retry/save et fallback dashboard dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) |
| L6-07 | e2e practice flow | DONE | [e2e/practice.spec.ts](./e2e/practice.spec.ts) et [e2e/auth.spec.ts](./e2e/auth.spec.ts) |
| L7-01 | Implementer l'engine `QuestionProgress` | DONE | [src/features/sessions/session-progress.ts](./src/features/sessions/session-progress.ts) |
| L7-02 | Mettre a jour `QuestionProgress` apres chaque attempt | DONE | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) |
| L7-03 | Agreger `SkillProgress` | PARTIAL | scoring pondere par difficulte, stale signal penalty, confiance persistante, couverture, echecs recents et diagnostics dashboard branches dans [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts), [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts), [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) et [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx); les shortcuts de review et les CTA de rattrapage restent a enrichir |
| L7-04 | Construire la review queue priorisee | DONE | [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) |
| L7-05 | Mode review | DONE | builder `REVIEW`, launcher et surface dashboard relies a la queue due reelle |
| L7-06 | Brancher `/dashboard/review` et `/dashboard/progress` | DONE | vraie queue, CTA review, progression et empty states relies aux recommandations |
| L7-07 | Tests de logique mastery | DONE | [__tests__/session-progress.test.ts](./__tests__/session-progress.test.ts), [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts), [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts) et [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) |
| L8-01 | Definir les templates de mock | DONE | [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts) et [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) |
| L8-02 | Etendre le session builder au mode mock | PARTIAL | cibles de formats par template, composition mixed-format et priorisation mock live dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts) et [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts); calibration de scoring specifique encore absente |
| L8-03 | UI de timer et de pression | DONE | [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts) |
| L8-04 | Rapport de mock | DONE | rapport de fin avec score, timing, pression, skill breakdown, pending review, risques et points a verbaliser |
| L8-05 | Historique de mocks | DONE | historique mock avec vue synthetique, tendances, signaux par template et liens vers les rapports |
| L8-06 | Scoring mock multi-format et rubrics | PARTIAL | `reviewData` persiste, verdict structure par critere, quick presets, rescoring de session live et analytics par critere sur `/dashboard/mock-interviews`; la synthese de faiblesse cross-surface reste a definir |
| L8-07 | e2e mock mode | DONE | couverture e2e du lancement mock, completion et consultation du rapport dans [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) |
| L9-01 | Bookmarks produit | DONE | server action toggle, read model, page [src/app/dashboard/bookmarks/page.tsx](./src/app/dashboard/bookmarks/page.tsx), toggles sur session/review/mock et couverture [__tests__/bookmark-read-model.test.ts](./__tests__/bookmark-read-model.test.ts) / [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) |
| L9-02 | Notes utilisateur | DONE | server action note, editor partage, recap [src/app/dashboard/notes/page.tsx](./src/app/dashboard/notes/page.tsx), lecture sur bookmarks/review/mock et couverture [__tests__/note-read-model.test.ts](./__tests__/note-read-model.test.ts) / [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) |
| L9-03 | Playlists ciblees | TODO | apres synthese de faiblesse cross-surface et signaux de faiblesse plus riches |

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
- extension du builder ferme a `MULTIPLE_CHOICE` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)
- extension du player pour selections multiples, mode label et raccourcis clavier adaptes dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- passage du format de question jusqu'a la page live dans [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)
- generalisation des messages session et disponibilite module/mock pour les formats fermes dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout d'une question seedee `MULTIPLE_CHOICE` sur le module TypeScript dans [prisma/seed.ts](./prisma/seed.ts)
- ajout d'une verification builder sur les formats fermes dans [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts)
- extension du scenario e2e practice pour couvrir le flux multi-reponse dans [e2e/practice.spec.ts](./e2e/practice.spec.ts)
- suppression du fallback runtime vers les colonnes monolingues legacy dans [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- ajout d'une garde de contrat pour exiger au moins une traduction publiee par entite dans [src/lib/content-repository.ts](./src/lib/content-repository.ts) et [__tests__/content-repository.test.ts](./__tests__/content-repository.test.ts)
- passage des colonnes legacy `title`, `description`, `prompt`, `explanation` et `label` en nullable dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql](./prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql)
- nettoyage du seed pour n'ecrire que la couche de traduction dans [prisma/seed.ts](./prisma/seed.ts)
- ajout d'un contrat de reponse d'attempt extensible dans [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts)
- ajout du champ Prisma `responseData` et d'un default vide sur `selectedOptionIds` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307183000_attempt_response_data/migration.sql](./prisma/migrations/20260307183000_attempt_response_data/migration.sql)
- branchement de l'enregistrement d'attempt sur ce nouveau payload additif dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- ajout des tests [__tests__/attempt-response.test.ts](./__tests__/attempt-response.test.ts)
- enrichissement des tests [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour les signaux mock
- creation du helper e2e [e2e/test-helpers.ts](./e2e/test-helpers.ts) pour completer une session structuree
- ajout de la spec [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) pour couvrir fin de mock et historique
- recalibrage de [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts) avec garde-fou de couverture par question et diversite de difficulte
- enrichissement de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour alimenter `SkillProgress` avec le `questionId`
- extension des tests [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts) avec verification du cap de couverture
- ajout de l'enum `ContentStatus` et migration des statuts contenu dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql](./prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql)
- ajout des modeles `PitfallTag` et `QuestionPitfallTag` dans [prisma/schema.prisma](./prisma/schema.prisma)
- branchement du seed sur les premiers pitfall tags dans [prisma/seed.ts](./prisma/seed.ts)
- filtrage du repository contenu sur le contenu `PUBLISHED` dans [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- alignement du session builder sur `ContentStatus.PUBLISHED` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)
- mise a jour des tests de contenu et dashboard dans [__tests__/content-repository.test.ts](./__tests__/content-repository.test.ts) et [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts)

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
- les statuts editoriaux doivent devenir effectifs cote produit, pas rester des enums sans impact sur les queries
- les pitfall tags doivent exister dans le schema et le seed avant d'ouvrir un futur weakness report et l'admin contenu
- `BUG_HUNT` et la review manuelle sont maintenant live en practice/review; la priorite coeur bascule vers la recalibration de `SkillProgress` puis les mocks mixed-format
- la maitrise d'un skill doit maintenant exposer sa confiance et sa fraicheur, pas seulement un score brut difficile a interpreter
- une question maitrisee qui chute ne doit plus etre traitee comme une carte totalement neuve; la progression doit distinguer rechute, consolidation et maintien
- un mock peut maintenant melanger plusieurs formats dans la meme session sans casser le rapport final ni la lecture de pression
- le rapport mock doit distinguer une mauvaise reponse auto-corrigee d'une reponse encore en attente de verdict manuel
- la couverture e2e mock doit tolerer le comportement reel du player, qu'il affiche un feedback intermediaire ou passe directement a l'etape suivante
- une premiere rubric partagee peut deja guider la review manuelle et la lecture du rapport mock sans attendre un score persiste pour les formats ouverts
- le score de session mock ne doit plus rester binaire pour les formats ouverts; il doit pouvoir integrer une note de rubric sans casser `QuestionProgress` et `SkillProgress`

Travail effectue:

- ajout de la migration [prisma/migrations/20260307193000_attempt_is_correct_nullable/migration.sql](./prisma/migrations/20260307193000_attempt_is_correct_nullable/migration.sql) et passage de `Attempt.isCorrect` a nullable dans [prisma/schema.prisma](./prisma/schema.prisma)
- extension du contrat de reponse d'attempt dans [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts) pour les drafts ouverts, les formats live supportes et le pending review
- refonte de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour persister les formats ouverts, scorer uniquement les reponses auto-corrigees et ne pas polluer la progression avec des tentatives non notees
- extraction des renderers de question dans [src/features/sessions/session-player-renderers.tsx](./src/features/sessions/session-player-renderers.tsx) et ouverture du player a `OPEN_ENDED` et `CODE_OUTPUT` dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- enrichissement de [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts), [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) et [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx) pour afficher correctement les sessions pending review
- ouverture du builder practice aux formats ouverts et ajout d'un module seed dedie dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) et [prisma/seed.ts](./prisma/seed.ts)
- extension des messages FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- extension de la couverture dans [__tests__/attempt-response.test.ts](./__tests__/attempt-response.test.ts), [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts) et [e2e/practice.spec.ts](./e2e/practice.spec.ts)
- ajout du champ `QuestionTranslation.contextData` dans [prisma/schema.prisma](./prisma/schema.prisma) et de la migration [prisma/migrations/20260307201500_question_translation_context_data/migration.sql](./prisma/migrations/20260307201500_question_translation_context_data/migration.sql) pour porter les snippets structures de `BUG_HUNT`
- creation du parseur partage [src/lib/question-context.ts](./src/lib/question-context.ts) et exposition du `contextData` localise depuis [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- extension du player a `BUG_HUNT` dans [src/features/sessions/session-player-renderers.tsx](./src/features/sessions/session-player-renderers.tsx), [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts)
- ouverture du builder practice a `BUG_HUNT` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) et ajout du module seed [prisma/seed.ts](./prisma/seed.ts) pour `react-bug-hunt-lab`
- ajout de la server action de verdict manuel dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) avec rescoring de session et progression apres review
- enrichissement du read model dashboard avec la file `pendingReviewItems` dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) et branchement de la review manuelle dans [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx)
- extension des messages FR/EN review/session dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour `BUG_HUNT` et les verdicts manuels
- extension des tests [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) et [e2e/practice.spec.ts](./e2e/practice.spec.ts) pour couvrir `BUG_HUNT`, pending review et verdict manuel
- ajout des champs `coverageCount`, `uniqueQuestionCount`, `uniqueDifficultyCount`, `recentFailureCount`, `confidenceScore` et `lastAttemptAt` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307213000_skill_progress_signal_fields/migration.sql](./prisma/migrations/20260307213000_skill_progress_signal_fields/migration.sql)
- recalibrage de [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts) avec stale signal penalty, confidence score et persistance des nouveaux signaux
- enrichissement de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour stocker ces signaux dans `SkillProgress`
- enrichissement du read model [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) pour exposer les diagnostics de skill au dashboard
- enrichissement de [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) avec badges de confiance, couverture, echecs recents et date du dernier signal
- extension des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour les diagnostics `SkillProgress`
- extension des tests [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts) et [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour verrouiller le nouveau contrat
- ajout des champs `reviewCount`, `lapseCount` et `lastOutcomeCorrect` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307224500_question_progress_review_signals/migration.sql](./prisma/migrations/20260307224500_question_progress_review_signals/migration.sql)
- refonte de [src/features/sessions/session-progress.ts](./src/features/sessions/session-progress.ts) pour mieux distinguer apprentissage, consolidation, maintien, rechute et reussite overdue
- enrichissement de la priorisation review dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) avec les nouveaux signaux de rechute et d'historique recent
- enrichissement de [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) avec les raisons `mockFallout` et `weakSkill`
- extension des labels FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour les nouvelles raisons de review
- extension des tests [__tests__/session-progress.test.ts](./__tests__/session-progress.test.ts), [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts) et [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour verrouiller `QuestionProgress` v2 et la queue review enrichie
- ajout de cibles de formats par template mock dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts)
- extension de [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) pour composer des mocks mixed-format avec formats fermes, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT`
- enrichissement de [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts), [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) et [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts) pour distinguer `pending_review`, `gradedCount`, `pendingCount` et la pression mock sous evaluation partielle
- enrichissement de [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) et des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour exposer les etats `pending_review` dans le rapport mock
- extension des tests [__tests__/session-builder.test.ts](./__tests__/session-builder.test.ts), [__tests__/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) et [__tests__/session-timing.test.ts](./__tests__/session-timing.test.ts) pour verrouiller le slice mixed-format mock
- durcissement de [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) pour accepter le comportement reel du flux mock, avec transition via feedback intermediaire ou passage direct a l'etape suivante
- suppression de l'invalidation eager de la route session dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pendant l'enregistrement d'une tentative
- creation du helper partage [src/features/sessions/session-rubric.ts](./src/features/sessions/session-rubric.ts) pour derivation des criteres de review selon le format de question
- enrichissement de [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts), [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) avec rubrics, points a verifier et criteres de lecture sur les formats ouverts
- extension des tests [__tests__/session-rubric.test.ts](./__tests__/session-rubric.test.ts), [__tests__/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) et [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour verrouiller cette premiere couche de rubric
- ajout des champs `Attempt.reviewData` et `Attempt.reviewedAt` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307233000_attempt_review_data/migration.sql](./prisma/migrations/20260307233000_attempt_review_data/migration.sql)
- creation du helper [src/features/sessions/attempt-review.ts](./src/features/sessions/attempt-review.ts) pour construire, parser et scorer les reviews structurees par critere
- refonte de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour enregistrer une review structuree, recalculer `isCorrect` via seuil et rescorrer les sessions mock sur une moyenne de `scorePercent`
- enrichissement de [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) et [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts) pour propager les `scorePercent` manuels jusque dans le rapport mock
- remplacement de la review binaire par un formulaire de rubric avec quick presets dans [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et extension des messages FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout des tests [__tests__/attempt-review.test.ts](./__tests__/attempt-review.test.ts) et extension de [__tests__/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) pour verrouiller le rescoring des formats ouverts
- enrichissement de [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) et [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) pour exposer une carte de friction par critere a partir des reviews structurees mock
- creation du slice bookmarks produit avec [src/features/bookmarks/bookmark.action.ts](./src/features/bookmarks/bookmark.action.ts), [src/features/bookmarks/bookmark-read-model.ts](./src/features/bookmarks/bookmark-read-model.ts), [src/features/bookmarks/bookmark-toggle-form.tsx](./src/features/bookmarks/bookmark-toggle-form.tsx) et la route [src/app/dashboard/bookmarks/page.tsx](./src/app/dashboard/bookmarks/page.tsx)
- branchement des toggles bookmarks dans [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx), avec propagation `isBookmarked` jusque dans [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts)
- extension du shell dashboard et des messages FR/EN pour la navigation bookmarks dans [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx), [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout du test [__tests__/bookmark-read-model.test.ts](./__tests__/bookmark-read-model.test.ts) et extension des tests [__tests__/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts), [__tests__/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) et [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) pour verrouiller les bookmarks et l'analytics par critere
- creation du slice notes avec [src/features/notes/note.action.ts](./src/features/notes/note.action.ts), [src/features/notes/note-editor-form.tsx](./src/features/notes/note-editor-form.tsx) et [src/features/notes/note-read-model.ts](./src/features/notes/note-read-model.ts)
- creation de la recap [src/app/dashboard/notes/page.tsx](./src/app/dashboard/notes/page.tsx) et extension du shell dashboard dans [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx)
- branchement des notes dans [src/app/dashboard/bookmarks/page.tsx](./src/app/dashboard/bookmarks/page.tsx), [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx), avec propagation depuis [src/features/bookmarks/bookmark-read-model.ts](./src/features/bookmarks/bookmark-read-model.ts), [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) et [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)
- extension des messages FR/EN pour la surface notes dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout du test [__tests__/note-read-model.test.ts](./__tests__/note-read-model.test.ts) et extension de [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) pour verrouiller la persistance d'une note via bookmarks

Validation effectuee:

- `pnpm prisma:generate`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:ci`
- `pnpm build`
- `pnpm prisma:migrate`
- `pnpm prisma:seed`
- `pnpm test:e2e:ci -- e2e/practice.spec.ts`
- `pnpm test:e2e:ci -- e2e/dashboard.spec.ts`
- `pnpm test:e2e:ci -- e2e/practice.spec.ts e2e/dashboard.spec.ts`
- `pnpm test:e2e:ci -- e2e/mock-interviews.spec.ts`
- `pnpm test:e2e:ci -- e2e/practice.spec.ts e2e/dashboard.spec.ts e2e/mock-interviews.spec.ts`
- `pnpm test:e2e:ci -- e2e/dashboard.spec.ts e2e/mock-interviews.spec.ts`
- `pnpm test:ci`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:e2e:ci -- e2e/dashboard.spec.ts e2e/mock-interviews.spec.ts`

## 6. Regles de mise a jour

A chaque session de travail, il faudra mettre a jour:

1. `BuildTracker.md`
2. le document de reference impacte
3. `ExecutionPlan.md` si un ticket change de statut global

## 7. Prochaine action recommandee

Commencer:

- `L9-03`
- `L8-06`
- `L7-03`

But:

- ouvrir les playlists cibleses maintenant que bookmarks et notes existent
- reinjecter les faiblesses par critere dans les rapports mock, la review queue et les prochaines recommandations
- finir les CTA et raccourcis de review specialises maintenant que la progression v2 est branchee
