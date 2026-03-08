# React Mentor Build Tracker

Derniere mise a jour: 8 mars 2026

## 1. Role du document

Ce document est la source de suivi de delivery.

Regle de travail:

- chaque avancee significative doit etre tracee ici
- chaque ticket termine doit passer en `DONE`
- chaque nouveau chantier important doit etre marque `IN_PROGRESS`
- les documents de reference concernes doivent etre cites

## 2. Statut global

- current_phase: `Lot 13 in progress (Lot 12 reste partiel)`
- current_focus: `densification de la bibliotheque learn, definition du prochain niveau du learning system et fermeture progressive des derniers trous analytics/perf`
- last_completed_lot: `Lot 11`
- active_ticket: `L13-01 densification contenu / L13-03 tracking d'apprentissage`
- continuation_plan: [ContinuationPlan.md](./ContinuationPlan.md)
- master_plan: [MasterDevelopmentPlan.md](./MasterDevelopmentPlan.md)
- learning_system_plan: [LearningSystemImprovements.md](./LearningSystemImprovements.md)

## 3. Statut des lots

| Lot | Nom                               | Statut      | Notes                                                                                                                                                                                                                                                        |
| --- | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | Stabilisation de base             | DONE        | Taxonomie, contrat contenu et read models documentes                                                                                                                                                                                                         |
| 1   | Data model v2 et contenu bilingue | DONE        | tables de traduction, enums editoriaux, pitfall tags, migration, seed et repository localise poses; runtime et seed ne dependent plus du legacy monolingue                                                                                                   |
| 2   | Onboarding et preferences         | DONE        | gate first-run, wizard onboarding, settings relies et recommandation initiale branches                                                                                                                                                                       |
| 3   | Dashboard reel v1                 | DONE        | overview, progress, review, recommandations et tests d'integration dashboard relies aux vraies donnees                                                                                                                                                       |
| 4   | Catalogue modules et pages detail | PARTIAL     | catalogue et detail module branches sur la vraie couche contenu                                                                                                                                                                                              |
| 5   | Session engine                    | DONE        | builder, reprise, creation, fin de session et couverture unitaire critiques en place                                                                                                                                                                         |
| 6   | Question player et attempts       | DONE        | player par renderers sur formats fermes, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT` en practice, payload d'attempt extensible, `Attempt.isCorrect` nullable, contextData localise et parcours e2e practice/review verifies                                    |
| 7   | Review queue et mastery           | DONE        | queue priorisee, pending manual review live avec verdicts manuels, `SkillProgress` enrichi, signaux explicables et persistes, `QuestionProgress` v2 branche, recovery plans et launchers cibles relies dans progress/review                               |
| 8   | Mock interviews                   | DONE        | templates, timer, historique, rapport pending-review-aware, composition mixed-format, review structuree persistante, synthese de faiblesse cross-surface et scoring par format/difficulte/template/critere relies                                          |
| 9   | Notes, bookmarks, playlists       | DONE        | bookmarks et notes produits relies depuis session/review/mock avec recap dediee; playlists auto-generees, sauvegarde persistante, edition detail et curation manuelle v1 ouvertes                                                                          |
| 10  | Admin et operations contenu       | DONE        | guard RBAC `admin`/`editor`, route `/dashboard/admin`, create/edit forms modules/skills/questions/pitfall tags, options bilingues pour formats fermes, filtres d'inventaire, statuts FR/EN, import/export JSON seed-compatible et quality dashboard editorial relies |
| 11  | Billing et entitlements           | DONE        | schema `UserEntitlement`, provision starter par defaut, gating modules/mocks/playlists, recap settings, checkout Stripe, billing portal et webhook de synchronisation abonnement relies                                                                   |
| 12  | Growth, analytics et plateforme   | PARTIAL     | telemetry produit persistee, funnel admin et monitoring webhook/import v1 relies; observabilite vendor, jobs lifecycle et matrice e2e encore ouverts                                                                                                        |
| 13  | Learning system et content scale  | IN_PROGRESS | bibliotheque `learn` publique en forte densification, plusieurs vagues seedees sur React/JS/Frontend Systems et travail en cours sur le lien cours -> tracking -> practice -> review                                                                        |

## 4. Statut des tickets immediats

| Ticket | Titre                                                 | Statut  | Reference                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------ | ----------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L0-01  | Figer la taxonomie officielle                         | DONE    | [Taxonomy.md](./Taxonomy.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L0-02  | Figer les enums de statut                             | DONE    | [Taxonomy.md](./Taxonomy.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L0-03  | Definir le contrat editorial                          | DONE    | [ContentContract.md](./ContentContract.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| L0-04  | Definir les read models du dashboard                  | DONE    | [DashboardReadModel.md](./DashboardReadModel.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L1-01  | Ajouter les traductions de modules                    | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L1-02  | Ajouter les traductions de skills                     | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L1-03  | Ajouter les traductions de questions                  | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L1-04  | Ajouter les traductions d'options                     | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L1-05  | Migrer le contenu monolingue                          | DONE    | runtime localise sans fallback legacy dans [src/lib/content-repository.ts](./src/lib/content-repository.ts), schema legacy assoupli dans [prisma/schema.prisma](./prisma/schema.prisma) et migration [prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql](./prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql)                                                                                                                                                                                                                                                                     |
| L1-06  | Introduire les tags de pieges                         | DONE    | [prisma/schema.prisma](./prisma/schema.prisma), [prisma/seed.ts](./prisma/seed.ts) et [prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql](./prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql)                                                                                                                                                                                                                                                                                                                                                                                  |
| L1-07  | Introduire les statuses editoriaux                    | DONE    | [prisma/schema.prisma](./prisma/schema.prisma), [src/lib/content-repository.ts](./src/lib/content-repository.ts) et [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| L1-08  | Refondre le seed                                      | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L1-09  | Repository functions localisees                       | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L1-10  | Tests schema et contenu localise                      | DONE    | [**tests**/content-repository.test.ts](./__tests__/content-repository.test.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| L2-01  | Auditer `UserPreference` et completer le schema       | DONE    | schema actuel suffisant pour v1 settings, aucune migration requise                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| L2-02  | Construire le flux first-run                          | DONE    | [src/app/onboarding/page.tsx](./src/app/onboarding/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L2-03  | Onboarding step 1: objectif                           | DONE    | [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L2-04  | Onboarding step 2: tracks                             | DONE    | [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L2-05  | Onboarding step 3: cadence                            | DONE    | [src/features/onboarding/onboarding-wizard.tsx](./src/features/onboarding/onboarding-wizard.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L2-06  | Persist and redirect                                  | DONE    | [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| L2-07  | Settings relies aux preferences                       | DONE    | [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L2-08  | Recommandation initiale                               | DONE    | [src/features/dashboard/dashboard-recommendations.ts](./src/features/dashboard/dashboard-recommendations.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L3-01  | Definir les aggregates SQL/Prisma                     | DONE    | [DashboardReadModel.md](./DashboardReadModel.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L3-02  | Creer `dashboard-read-model`                          | DONE    | [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| L3-03  | Brancher `/dashboard` sur de vraies donnees           | DONE    | [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| L3-04  | Brancher `/dashboard/progress` sur de vraies donnees  | DONE    | [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L3-05  | Brancher `/dashboard/review` sur de vraies donnees    | DONE    | [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| L3-06  | Modules relies aux vraies donnees                     | DONE    | [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| L3-07  | Empty states et first-use UX                          | DONE    | recommendations premier run, CTA utiles et shell dynamique relies aux vraies donnees                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| L3-08  | Tests d'integration dashboard                         | DONE    | [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) et [**tests**/dashboard-recommendations.test.ts](./__tests__/dashboard-recommendations.test.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L4-01  | Route detail module                                   | DONE    | [ExecutionPlan.md](./ExecutionPlan.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L5-01  | Specifier le contrat `TrainingSession`                | DONE    | [TrainingSessionContract.md](./TrainingSessionContract.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| L5-02  | Creer le service de session builder                   | DONE    | [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L5-03  | Implementer la selection de questions v1              | DONE    | [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L5-04  | Route ou server action `createTrainingSession`        | DONE    | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| L5-05  | Reprise de session                                    | DONE    | [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L5-06  | Fin de session                                        | DONE    | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| L5-07  | Tests engine                                          | DONE    | [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| L6-01  | Route `/dashboard/session/[id]`                       | DONE    | [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| L6-02  | Construire `QuestionPlayer`                           | DONE    | architecture par renderers avec formats `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT` dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/session-player-renderers.tsx](./src/features/sessions/session-player-renderers.tsx)                                                                                                                                                                                                                                                                                                           |
| L6-03  | Persist attempts                                      | DONE    | persistance additive `responseData`, compatibilite `selectedOptionIds` et semantique `isCorrect nullable` pour pending review dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) et [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts)                                                                                                                                                                                                                                                                                                                       |
| L6-04  | Brancher la correction immediate                      | DONE    | [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L6-05  | Navigation player                                     | DONE    | reset deterministic par question, clavier et transitions avances dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L6-06  | Error and recovery states                             | DONE    | recovery inline, retry/save et fallback dashboard dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| L6-07  | e2e practice flow                                     | DONE    | [e2e/practice.spec.ts](./e2e/practice.spec.ts) et [e2e/auth.spec.ts](./e2e/auth.spec.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| L7-01  | Implementer l'engine `QuestionProgress`               | DONE    | [src/features/sessions/session-progress.ts](./src/features/sessions/session-progress.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| L7-02  | Mettre a jour `QuestionProgress` apres chaque attempt | DONE    | [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| L7-03  | Agreger `SkillProgress`                               | DONE    | scoring pondere par difficulte, stale signal penalty, confiance persistante, `signalDetails` JSON et lecture explicable relies dans [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts), [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts), [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts), [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) et [prisma/migrations/20260308001500_skill_progress_signal_details/migration.sql](./prisma/migrations/20260308001500_skill_progress_signal_details/migration.sql) |
| L7-04  | Construire la review queue priorisee                  | DONE    | [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| L7-05  | Mode review                                           | DONE    | builder `REVIEW`, launcher et surface dashboard relies a la queue due reelle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L7-06  | Brancher `/dashboard/review` et `/dashboard/progress` | DONE    | vraie queue, CTA review, progression et empty states relies aux recommandations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| L7-07  | Tests de logique mastery                              | DONE    | [**tests**/session-progress.test.ts](./__tests__/session-progress.test.ts), [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts), [**tests**/skill-progress.test.ts](./__tests__/skill-progress.test.ts) et [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)                                                                                                                                                                                                                                                                                                                                                          |
| L8-01  | Definir les templates de mock                         | DONE    | [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts) et [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| L8-02  | Etendre le session builder au mode mock               | DONE    | contraintes de temps, composition mixed-format et scoring pondere par format/difficulte/template/critere relies dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts), [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts), [src/features/sessions/session-score.ts](./src/features/sessions/session-score.ts), [src/features/sessions/attempt-review.ts](./src/features/sessions/attempt-review.ts) et [__tests__/session-score.test.ts](./__tests__/session-score.test.ts) |
| L8-03  | UI de timer et de pression                            | DONE    | [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| L8-04  | Rapport de mock                                       | DONE    | rapport de fin avec score, timing, pression, skill breakdown, pending review, risques et points a verbaliser                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| L8-05  | Historique de mocks                                   | DONE    | historique mock avec vue synthetique, tendances, signaux par template et liens vers les rapports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| L8-06  | Scoring mock multi-format et rubrics                  | DONE    | `reviewData` persiste, verdict structure par critere, quick presets, rescoring de session live, synthese de faiblesse cross-surface, recovery prompts et recommandation de template relies dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts), [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) et [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx)                                                                                                                                                                              |
| L8-07  | e2e mock mode                                         | DONE    | couverture e2e du lancement mock, completion et consultation du rapport dans [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| L9-01  | Bookmarks produit                                     | DONE    | server action toggle, read model, page [src/app/dashboard/bookmarks/page.tsx](./src/app/dashboard/bookmarks/page.tsx), toggles sur session/review/mock et couverture [**tests**/bookmark-read-model.test.ts](./__tests__/bookmark-read-model.test.ts) / [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)                                                                                                                                                                                                                                                                                                                                  |
| L9-02  | Notes utilisateur                                     | DONE    | server action note, editor partage, recap [src/app/dashboard/notes/page.tsx](./src/app/dashboard/notes/page.tsx), lecture sur bookmarks/review/mock et couverture [**tests**/note-read-model.test.ts](./__tests__/note-read-model.test.ts) / [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)                                                                                                                                                                                                                                                                                                                                             |
| L9-03  | Playlists ciblees                                     | DONE    | playlists auto-generees, sauvegarde persistante, detail editable et curation manuelle v1 relies dans [src/features/playlists/playlist-read-model.ts](./src/features/playlists/playlist-read-model.ts), [src/features/playlists/saved-playlist-read-model.ts](./src/features/playlists/saved-playlist-read-model.ts), [src/features/playlists/playlist.action.ts](./src/features/playlists/playlist.action.ts), [src/app/dashboard/playlists/page.tsx](./src/app/dashboard/playlists/page.tsx) et [src/app/dashboard/playlists/[id]/page.tsx](./src/app/dashboard/playlists/[id]/page.tsx) |
| L10-01 | RBAC admin                                            | DONE    | guard role `admin`/`editor` dans [src/lib/auth/content-admin.ts](./src/lib/auth/content-admin.ts), navigation conditionnelle dans [src/app/dashboard/layout.tsx](./src/app/dashboard/layout.tsx) et [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx) |
| L10-02 | Admin modules                                         | DONE    | create/edit module bilingue, statuts editoriaux et statuts de traduction relies dans [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L10-03 | Admin skills                                          | DONE    | create/edit skill bilingue, reassociation module et statuts de traduction relies dans [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L10-04 | Admin questions                                       | DONE    | create/edit question `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT`, `BUG_HUNT`, options bilingues pour formats fermes, pitfall tags relies, inventory recent filtre, checklist publication et statuts FR/EN relies dans [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts), [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) et [AdminContentContract.md](./AdminContentContract.md) |
| L10-05 | Admin pitfall tags                                    | DONE    | create/edit des pitfall tags et rattachement aux questions dans [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L10-06 | Import/export seed-compatible                         | DONE    | export JSON telechargeable et import JSON upsert-only avec garde-fous historiques dans [src/features/admin/admin-content-export.ts](./src/features/admin/admin-content-export.ts), [src/features/admin/admin-content-import.ts](./src/features/admin/admin-content-import.ts), [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/app/api/admin/content-export/route.ts](./src/app/api/admin/content-export/route.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L10-07 | Vue editorial quality dashboard                       | DONE    | signaux de qualite (translation gaps, questions sans tags, modules maigres, couverture track/format) relies dans [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L11-01 | Definir plans, quotas et entitlements                 | DONE    | plans `STARTER` / `MENTOR_PRO` / `HIRING_SPRINT`, quotas et snapshots derives dans [src/features/billing/user-entitlements.ts](./src/features/billing/user-entitlements.ts), avec UX reliee dans [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx) |
| L11-02 | Schema entitlements                                   | DONE    | ajout de `UserEntitlement`, enums billing et migration [prisma/migrations/20260308013000_user_entitlements/migration.sql](./prisma/migrations/20260308013000_user_entitlements/migration.sql) depuis [prisma/schema.prisma](./prisma/schema.prisma) |
| L11-03 | Integration Stripe                                    | DONE    | client Stripe serveur, checkout abonnement, billing portal et webhook de sync relies dans [src/lib/stripe.ts](./src/lib/stripe.ts), [src/features/billing/stripe-billing.ts](./src/features/billing/stripe-billing.ts), [src/features/billing/billing.action.ts](./src/features/billing/billing.action.ts) et [src/app/api/billing/stripe-webhook/route.ts](./src/app/api/billing/stripe-webhook/route.ts) |
| L11-04 | Gating produit premium                                | DONE    | protections server-side dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) et [src/features/playlists/playlist.action.ts](./src/features/playlists/playlist.action.ts), surfaces UI lisibles dans [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx), [src/app/dashboard/modules/[slug]/page.tsx](./src/app/dashboard/modules/[slug]/page.tsx), [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx), [src/app/dashboard/playlists/page.tsx](./src/app/dashboard/playlists/page.tsx), [src/app/dashboard/playlists/[id]/page.tsx](./src/app/dashboard/playlists/[id]/page.tsx) et [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx) |
| L12-01 | Instrumenter les evenements critiques                 | PARTIAL | ajout de `ProductAnalyticsEvent`, instrumentation signup email, onboarding, creation/completion session, answers, bookmarks, notes, upgrade click et abonnements Stripe dans [src/features/telemetry/telemetry.ts](./src/features/telemetry/telemetry.ts), [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts), [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts), [src/features/bookmarks/bookmark.action.ts](./src/features/bookmarks/bookmark.action.ts), [src/features/notes/note.action.ts](./src/features/notes/note.action.ts), [src/features/billing/billing.action.ts](./src/features/billing/billing.action.ts) et [src/app/api/billing/stripe-webhook/route.ts](./src/app/api/billing/stripe-webhook/route.ts) |
| L12-02 | Funnel et activation                                  | DONE    | projection admin du funnel signup -> onboarding -> practice -> mock et lecture des evenements recents dans [src/features/telemetry/admin-telemetry-read-model.ts](./src/features/telemetry/admin-telemetry-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L12-03 | Error tracking et logs structures                     | PARTIAL | `OperationalEvent` reste la base locale et Sentry Next.js est maintenant branche via [next.config.ts](./next.config.ts), [src/instrumentation.ts](./src/instrumentation.ts), [src/instrumentation-client.ts](./src/instrumentation-client.ts), [src/sentry.server.config.ts](./src/sentry.server.config.ts), [src/sentry.edge.config.ts](./src/sentry.edge.config.ts) et [src/app/global-error.tsx](./src/app/global-error.tsx); restent le monitoring perf plus pousse et les alertes endpoint |
| L12-04 | Monitoring jobs et webhooks                           | DONE    | monitoring des imports admin et du webhook Stripe deja relies, emails lifecycle Resend et job `review_due_reminders` instrumentes dans [src/features/emails/lifecycle-email.ts](./src/features/emails/lifecycle-email.ts), [src/app/api/jobs/review-due-reminders/route.ts](./src/app/api/jobs/review-due-reminders/route.ts), [src/features/telemetry/admin-telemetry-read-model.ts](./src/features/telemetry/admin-telemetry-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) |
| L12-05 | Matrice de tests complete                             | DONE    | suites Vitest completes, lint, build et matrice Playwright CI complete passent apres realignement des specs premium/practice/mock dans [e2e/test-helpers.ts](./e2e/test-helpers.ts), [e2e/practice.spec.ts](./e2e/practice.spec.ts), [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) et [e2e/settings.spec.ts](./e2e/settings.spec.ts) |
| L13-01 | Densifier la bibliotheque `learn`                     | IN_PROGRESS | vagues editoriales successives sur React fundamentals/hooks/advanced/router/i18n/testing, JavaScript et Frontend Systems pilotees par [ContentExpansionTracker.md](./ContentExpansionTracker.md) et [prisma/seed.ts](./prisma/seed.ts) |
| L13-02 | Relier cours, pratique et review                      | TODO    | il faut encore ajouter mini checks, exercices relies, parcours associes et transitions plus visibles depuis `learn` vers practice/review |
| L13-03 | Renforcer le tracking d'apprentissage                 | IN_PROGRESS | les bases `QuestionProgress`, `SkillProgress`, telemetry et recovery existent; restent les signaux de consommation de cours, comprehension, restitution et plans adaptatifs, formalises dans [LearningSystemImprovements.md](./LearningSystemImprovements.md) |
| L13-04 | Industrialiser la QA pedagogique et editoriale        | TODO    | l'admin contenu v1 existe, mais la production en volume, la dedup benchmark, la freshness review et les garde-fous QA restent a renforcer |

## 5. Journal de travail

### 2026-03-08 (learn content scale and roadmap refresh)

Travail effectue:

- densification successive de [prisma/seed.ts](./prisma/seed.ts) sur les familles `React advanced`, `React Router`, `React i18n` et `React testing`, avec nouvelles questions/cours bilingues et raccordement aux collections `learn`
- enrichissement du seed sur les sujets `StrictMode`, hydration, code splitting, SSR/static generation, `useParams`, `useNavigate`, guards, route active, 404, history `replace`, `useIntl`, formatage nombre/monnaie, pluralisation, Redux testing et shallow vs full DOM
- realignement de [ContentExpansionTracker.md](./ContentExpansionTracker.md) pour refleter l'etat reel du contenu deja livre, les trous restants et les vagues editoriales en cours
- refonte de [Roadmap.md](./Roadmap.md) pour consolider l'etat du produit, corriger les zones devenues fausses et expliciter les priorites restantes
- ajout de [LearningSystemImprovements.md](./LearningSystemImprovements.md) pour cadrer les ameliorations du systeme d'apprentissage, du tracking et de la partie cours

Validation effectuee:

- `pnpm prisma:seed`
- `pnpm exec vitest run __tests__/content-repository.test.ts`
- revue documentaire manuelle

### 2026-03-08

Travail effectue:

- refonte de [ContentExpansionTracker.md](./ContentExpansionTracker.md) pour documenter explicitement:
  - ce qui est deja livre sur `learn`
  - les modules et collections editoriales deja poses
  - la cartographie benchmark GreatFrontEnd -> React Mentor
  - les vagues de production restantes par famille de contenu
  - la barriere de qualite pedagogique obligatoire pour chaque question
- ajout dans [Roadmap.md](./Roadmap.md) d'un rappel explicite vers ce tracker comme source de verite du programme editorial

Validation effectuee:

- revue documentaire manuelle

### 2026-03-08 (plateforme et admin)

Travail effectue:

- ajout du champ `SkillProgress.signalDetails` dans [prisma/schema.prisma](./prisma/schema.prisma) et de la migration [prisma/migrations/20260308001500_skill_progress_signal_details/migration.sql](./prisma/migrations/20260308001500_skill_progress_signal_details/migration.sql)
- refonte de [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts) pour exposer un breakdown explicable du signal mastery/confiance, avec caps, boosts et penalites persistes
- enrichissement de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) et [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) pour stocker et relire ce breakdown depuis `SkillProgress`
- enrichissement de [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) et des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour rendre le signal skill lisible et actionnable
- durcissement de [src/features/sessions/session-score.ts](./src/features/sessions/session-score.ts) avec un rescoring mock par critere selon le template actif, en s'appuyant sur [src/features/sessions/attempt-review.ts](./src/features/sessions/attempt-review.ts)
- ajout de la couverture [__tests__/session-score.test.ts](./__tests__/session-score.test.ts) et extension de [__tests__/skill-progress.test.ts](./__tests__/skill-progress.test.ts) / [__tests__/admin-content-read-model.test.ts](./__tests__/admin-content-read-model.test.ts)
- enrichissement du back-office v1 avec edition inline modules/skills/questions, upsert bilingue FR/EN et statuts de traduction dans [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx)
- ajout de filtres `status` / `format` sur l'inventaire questions de [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx), portes par [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts)
- extension de l'admin aux questions fermees `SINGLE_CHOICE` / `MULTIPLE_CHOICE` avec edition bilingue des options, indexes corrects et verrouillage des options apres tentatives dans [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx)
- durcissement de la checklist editoriale des questions fermees et realignement du contrat dans [AdminContentContract.md](./AdminContentContract.md)
- ajout des pitfall tags dans l'admin avec creation/edition dediee et rattachement direct aux questions dans [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts), [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx)
- ajout de l'export JSON complet du contenu admin, pitfall tags inclus, dans [src/features/admin/admin-content-export.ts](./src/features/admin/admin-content-export.ts) et [src/app/api/admin/content-export/route.ts](./src/app/api/admin/content-export/route.ts)
- ajout de l'import JSON upsert-only avec garde-fous sur questions fermees et bug hunts deja tentes dans [src/features/admin/admin-content-import.ts](./src/features/admin/admin-content-import.ts) et [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts)
- ajout d'un panneau quality dashboard editorial dans [src/features/admin/admin-content-read-model.ts](./src/features/admin/admin-content-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx)
- ajout de la couverture [__tests__/admin-content-export.test.ts](./__tests__/admin-content-export.test.ts), [__tests__/admin-content-import.test.ts](./__tests__/admin-content-import.test.ts) et extension de [__tests__/admin-content-read-model.test.ts](./__tests__/admin-content-read-model.test.ts)

Validation effectuee:

- `pnpm prisma generate`
- `pnpm exec vitest run __tests__/skill-progress.test.ts __tests__/attempt-review.test.ts __tests__/session-score.test.ts __tests__/dashboard-read-model.test.ts __tests__/admin-content-read-model.test.ts`
- `pnpm exec vitest run __tests__/admin-content-read-model.test.ts`
- `pnpm exec vitest run __tests__/admin-content-export.test.ts __tests__/admin-content-read-model.test.ts __tests__/admin-content-import.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

### 2026-03-08 (billing et entitlements)

Travail effectue:

- ajout du modele [src/features/billing/user-entitlements.ts](./src/features/billing/user-entitlements.ts) avec plans `STARTER` / `MENTOR_PRO` / `HIRING_SPRINT`, provision starter par defaut, fenetre mensuelle de quota mock, acces module derive et gating par `questionIds`
- ajout de `UserEntitlement` et des enums billing dans [prisma/schema.prisma](./prisma/schema.prisma) avec migration additive [prisma/migrations/20260308013000_user_entitlements/migration.sql](./prisma/migrations/20260308013000_user_entitlements/migration.sql)
- durcissement des server actions dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) et [src/features/playlists/playlist.action.ts](./src/features/playlists/playlist.action.ts) pour bloquer les mocks hors quota, les modules verrouilles et les workflows playlists non premium
- ajout d'une UX de gating lisible sur [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx), [src/app/dashboard/modules/[slug]/page.tsx](./src/app/dashboard/modules/[slug]/page.tsx), [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx), [src/app/dashboard/playlists/page.tsx](./src/app/dashboard/playlists/page.tsx) et [src/app/dashboard/playlists/[id]/page.tsx](./src/app/dashboard/playlists/[id]/page.tsx)
- ajout d'un recap billing/entitlements sur [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx) et extension des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- extension de la couverture [__tests__/user-entitlements.test.ts](./__tests__/user-entitlements.test.ts) pour le quota mock epuise et le cutoff d'acces module

Validation effectuee:

- `pnpm prisma generate`
- `pnpm exec vitest run __tests__/user-entitlements.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

### 2026-03-08 (Stripe core)

Travail effectue:

- ajout du client Stripe serveur dans [src/lib/stripe.ts](./src/lib/stripe.ts) et extension de l'environnement dans [src/lib/env.ts](./src/lib/env.ts), [.env.example](./.env.example) et [README.md](./README.md)
- ajout de la couche billing Stripe dans [src/features/billing/stripe-billing.ts](./src/features/billing/stripe-billing.ts) avec catalogues de plans premium, creation customer, checkout abonnement, portal client et sync d'entitlements depuis `Checkout Session` / `Subscription`
- ajout des server actions [src/features/billing/billing.action.ts](./src/features/billing/billing.action.ts) et du webhook [src/app/api/billing/stripe-webhook/route.ts](./src/app/api/billing/stripe-webhook/route.ts)
- branchement de `/dashboard/settings` sur les actions billing, les cartes de plans et les notices de retour Stripe dans [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx)
- ajout de la couverture [__tests__/stripe-billing.test.ts](./__tests__/stripe-billing.test.ts) pour le mapping `price id -> plan`, le mapping des statuts Stripe et le downgrade starter sur abonnement annule

Validation effectuee:

- `pnpm exec vitest run __tests__/user-entitlements.test.ts __tests__/stripe-billing.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

### 2026-03-08 (telemetry foundation)

Travail effectue:

- ajout des enums `ProductAnalyticsEventName` / `OperationalEventLevel`, des tables [product_analytics_event](./prisma/migrations/20260308075224_telemetry_foundation/migration.sql) et [operational_event](./prisma/migrations/20260308075224_telemetry_foundation/migration.sql) depuis [prisma/schema.prisma](./prisma/schema.prisma)
- ajout de la couche [src/features/telemetry/telemetry.ts](./src/features/telemetry/telemetry.ts) pour persister les evenements produit, dedupliquer `ACCOUNT_CREATED`, normaliser les erreurs et stocker des logs operationnels structures
- ajout du read model [src/features/telemetry/admin-telemetry-read-model.ts](./src/features/telemetry/admin-telemetry-read-model.ts) avec funnel activation, comptages par event et synthese des sources operationnelles
- instrumentation du signup email via [src/app/api/analytics/client-events/route.ts](./src/app/api/analytics/client-events/route.ts) et [src/features/auth/sign-up-form.tsx](./src/features/auth/sign-up-form.tsx)
- instrumentation des flux onboarding, sessions, bookmarks, notes, checkout Stripe, webhook Stripe et import admin dans [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts), [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts), [src/features/bookmarks/bookmark.action.ts](./src/features/bookmarks/bookmark.action.ts), [src/features/notes/note.action.ts](./src/features/notes/note.action.ts), [src/features/billing/billing.action.ts](./src/features/billing/billing.action.ts), [src/app/api/billing/stripe-webhook/route.ts](./src/app/api/billing/stripe-webhook/route.ts) et [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts)
- extension de [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) et des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour afficher le funnel, les evenements recents et les incidents operationnels
- ajout de la couverture [__tests__/telemetry.test.ts](./__tests__/telemetry.test.ts) et [__tests__/admin-telemetry-read-model.test.ts](./__tests__/admin-telemetry-read-model.test.ts)

Validation effectuee:

- `pnpm prisma migrate dev --name telemetry_foundation`
- `pnpm exec vitest run __tests__/telemetry.test.ts __tests__/admin-telemetry-read-model.test.ts`
- `pnpm exec playwright test e2e/settings.spec.ts`
- `pnpm typecheck`

### 2026-03-08 (Sentry observability)

Travail effectue:

- ajout de la dependance `@sentry/nextjs` dans [package.json](./package.json) et [pnpm-lock.yaml](./pnpm-lock.yaml)
- branchement de Sentry sur Next.js via [next.config.ts](./next.config.ts), [src/instrumentation.ts](./src/instrumentation.ts), [src/instrumentation-client.ts](./src/instrumentation-client.ts), [src/sentry.server.config.ts](./src/sentry.server.config.ts) et [src/sentry.edge.config.ts](./src/sentry.edge.config.ts)
- ajout d'un `global-error` racine pour reporter les crashes App Router dans [src/app/global-error.tsx](./src/app/global-error.tsx)
- ajout d'un helper de config dormant sans DSN dans [src/lib/sentry.ts](./src/lib/sentry.ts) et extension de l'env dans [src/lib/env.ts](./src/lib/env.ts), [.env.example](./.env.example) et [README.md](./README.md)
- branchement de `Sentry.captureException(...)` dans les `catch` qui avalent aujourd'hui l'erreur dans [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts), [src/features/settings/settings.action.ts](./src/features/settings/settings.action.ts), [src/app/dashboard/settings/page.tsx](./src/app/dashboard/settings/page.tsx), [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts), [src/features/admin/admin-content.action.ts](./src/features/admin/admin-content.action.ts) et [src/app/api/billing/stripe-webhook/route.ts](./src/app/api/billing/stripe-webhook/route.ts)
- ajout du test [__tests__/sentry-config.test.ts](./__tests__/sentry-config.test.ts) pour verrouiller le mode dormant sans DSN et les options de base quand Sentry est configure

Validation effectuee:

- `pnpm exec vitest run __tests__/sentry-config.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-03-08 (Lifecycle emails and review reminder jobs)

Travail effectue:

- ajout de la dependance `resend` dans [package.json](./package.json) et [pnpm-lock.yaml](./pnpm-lock.yaml), puis creation du client serveur [src/lib/resend.ts](./src/lib/resend.ts)
- extension de [prisma/schema.prisma](./prisma/schema.prisma) avec `UserPreference.lifecycleEmailsEnabled` et migration [prisma/migrations/20260308193756_lifecycle_email_preferences/migration.sql](./prisma/migrations/20260308193756_lifecycle_email_preferences/migration.sql)
- creation de la couche [src/features/emails/lifecycle-email.ts](./src/features/emails/lifecycle-email.ts) pour les templates localises, l'envoi welcome, le batch `review_due_email`, la resolution de locale et les logs operationnels associes
- branchement de l'email welcome depuis [src/features/onboarding/onboarding.action.ts](./src/features/onboarding/onboarding.action.ts)
- ajout du job serveur protege [src/app/api/jobs/review-due-reminders/route.ts](./src/app/api/jobs/review-due-reminders/route.ts) avec secret `LIFECYCLE_JOB_SECRET`
- extension des settings dans [src/features/settings/settings-form.tsx](./src/features/settings/settings-form.tsx), [src/features/settings/settings.action.ts](./src/features/settings/settings.action.ts), [src/features/settings/settings.validation.ts](./src/features/settings/settings.validation.ts) et [src/features/settings/user-preferences.ts](./src/features/settings/user-preferences.ts) pour l'opt-out lifecycle persistant
- extension du monitoring admin dans [src/features/telemetry/admin-telemetry-read-model.ts](./src/features/telemetry/admin-telemetry-read-model.ts) et [src/app/dashboard/admin/page.tsx](./src/app/dashboard/admin/page.tsx) avec compteurs `email.lifecycle` et `email.lifecycle.job`
- extension des messages FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts), de [.env.example](./.env.example) et de [README.md](./README.md)
- ajout de la couverture [__tests__/lifecycle-email.test.ts](./__tests__/lifecycle-email.test.ts), extension de [__tests__/admin-telemetry-read-model.test.ts](./__tests__/admin-telemetry-read-model.test.ts) et extension de [e2e/settings.spec.ts](./e2e/settings.spec.ts)

Validation effectuee:

- `pnpm prisma migrate dev --name lifecycle_email_preferences`
- `pnpm exec vitest run __tests__/lifecycle-email.test.ts __tests__/admin-telemetry-read-model.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test:ci`
- `CI=TRUE HEADLESS=TRUE PORT=3101 PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:3101 pnpm exec playwright test e2e/settings.spec.ts`
- `CI=TRUE HEADLESS=TRUE PORT=3108 PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:3108 pnpm test:e2e:ci`

### 2026-03-07

Travail effectue:

- extension du contrat de session pour accepter des selections explicites `questionIds` et introduction de la source `playlist` dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts), [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) et [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- ajout de recovery plans derives du dashboard read model pour relier `weakSkill`, cartes dues et pending manual review dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- branchement de CTA de rattrapage cibles dans [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) et [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx)
- enrichissement de la page mock avec recommandation de template, carte de faiblesse cross-surface et prompts de recovery dans [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx)
- remplacement du faux bloc "next mock" statique par un ordre pilote par les signaux mock dans [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx)
- ouverture des playlists auto-generees v1 dans [src/features/playlists/playlist-read-model.ts](./src/features/playlists/playlist-read-model.ts), [src/app/dashboard/playlists/page.tsx](./src/app/dashboard/playlists/page.tsx) et [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx)
- ajout de la couverture [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts), [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts) et [**tests**/playlist-read-model.test.ts](./__tests__/playlist-read-model.test.ts)

Validation effectuee:

- `pnpm exec vitest run __tests__/session-builder.test.ts __tests__/dashboard-read-model.test.ts __tests__/playlist-read-model.test.ts`
- `pnpm typecheck`
- `pnpm lint`

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
- ajout de tests de localisation dans [**tests**/content-repository.test.ts](./__tests__/content-repository.test.ts)

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
- ajout des tests [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts)
- ajout des tests [**tests**/user-preferences.test.ts](./__tests__/user-preferences.test.ts)
- ajout des tests [**tests**/session-progress.test.ts](./__tests__/session-progress.test.ts)
- ajout des tests [**tests**/session-contract.test.ts](./__tests__/session-contract.test.ts)
- durcissement du player avec reset deterministic par question, retry inline et transitions de navigation dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- ajout de la cle de remount sur le player dans [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)
- durcissement de la config e2e avec prebuild et serveur local fixe dans [package.json](./package.json), [playwright.config.ts](./playwright.config.ts) et [eslint.config.mjs](./eslint.config.mjs)
- alignement des specs e2e auth/practice sur l'onboarding et les fins de session a une seule question dans [e2e/auth.spec.ts](./e2e/auth.spec.ts) et [e2e/practice.spec.ts](./e2e/practice.spec.ts)
- ajout des tests builder dans [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts)
- ouverture du mode `REVIEW` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) avec selection des cartes dues reelles
- transformation de [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) en point d'entree actionnable pour lancer une session review
- extension des messages review FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- extension des tests builder review dans [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts)
- creation du scoring de maitrise pondere dans [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts)
- branchement du nouveau scoring dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- ajout des tests [**tests**/skill-progress.test.ts](./__tests__/skill-progress.test.ts)
- creation du contrat [src/features/dashboard/dashboard-recommendation-contract.ts](./src/features/dashboard/dashboard-recommendation-contract.ts)
- creation du moteur de recommandation dans [src/features/dashboard/dashboard-recommendations.ts](./src/features/dashboard/dashboard-recommendations.ts)
- branchement des recommandations et du focus dynamique dans [src/features/dashboard/dashboard-shell-data.ts](./src/features/dashboard/dashboard-shell-data.ts) et [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx)
- ajout d'un bloc "recommended next step" sur [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx)
- ajout d'un parcours module recommande, d'un badge sur la bibliotheque et de CTA relies dans [src/app/dashboard/modules/page.tsx](./src/app/dashboard/modules/page.tsx)
- enrichissement des empty states de progression avec CTA relies aux recommandations dans [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx)
- extension des messages dashboard FR/EN pour les recommandations et le focus dynamique dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout des tests [**tests**/dashboard-recommendations.test.ts](./__tests__/dashboard-recommendations.test.ts)
- extension des e2e dashboard avec le parcours first-run recommande dans [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)
- extraction d'un historique mock reel dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- branchement de [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) sur les vraies `TrainingSession` mock au lieu du contenu de demonstration
- mapping des titres de templates et des etats vides mock dans [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx)
- ajout des tests d'historique mock dans [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts)
- enrichissement du contrat de session mock avec budget temps dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts)
- creation des helpers de timing et de lecture de pression dans [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts)
- ajout de la cloture explicite de session dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- durcissement du backend attempt pour refuser une reponse sur une session mock expiree dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- enrichissement de la vue session avec timing et premier rapport mock dans [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)
- ajout du timer live et de l'auto-cloture a expiration dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- enrichissement de la page [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) avec rapport mock, budget temps et verdict de pression
- extension des messages session FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout des tests [**tests**/session-timing.test.ts](./__tests__/session-timing.test.ts)
- extension des tests contrat mock dans [**tests**/session-contract.test.ts](./__tests__/session-contract.test.ts)
- extension de l'e2e mock/dashboard pour verifier le timer visible dans [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts)
- creation du rapport mock approfondi dans [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts)
- enrichissement de [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) avec skill breakdown, risques et points a verbaliser
- enrichissement de [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) avec sections detaillees de rapport mock
- creation d'un read model mock synthetique dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- enrichissement de [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) avec overview, tendances, signaux par template et liens vers les rapports
- ajout des tests [**tests**/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts)
- extension du builder ferme a `MULTIPLE_CHOICE` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)
- extension du player pour selections multiples, mode label et raccourcis clavier adaptes dans [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx)
- passage du format de question jusqu'a la page live dans [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx)
- generalisation des messages session et disponibilite module/mock pour les formats fermes dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout d'une question seedee `MULTIPLE_CHOICE` sur le module TypeScript dans [prisma/seed.ts](./prisma/seed.ts)
- ajout d'une verification builder sur les formats fermes dans [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts)
- extension du scenario e2e practice pour couvrir le flux multi-reponse dans [e2e/practice.spec.ts](./e2e/practice.spec.ts)
- suppression du fallback runtime vers les colonnes monolingues legacy dans [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- ajout d'une garde de contrat pour exiger au moins une traduction publiee par entite dans [src/lib/content-repository.ts](./src/lib/content-repository.ts) et [**tests**/content-repository.test.ts](./__tests__/content-repository.test.ts)
- passage des colonnes legacy `title`, `description`, `prompt`, `explanation` et `label` en nullable dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql](./prisma/migrations/20260307170000_legacy_content_fields_nullable/migration.sql)
- nettoyage du seed pour n'ecrire que la couche de traduction dans [prisma/seed.ts](./prisma/seed.ts)
- ajout d'un contrat de reponse d'attempt extensible dans [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts)
- ajout du champ Prisma `responseData` et d'un default vide sur `selectedOptionIds` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307183000_attempt_response_data/migration.sql](./prisma/migrations/20260307183000_attempt_response_data/migration.sql)
- branchement de l'enregistrement d'attempt sur ce nouveau payload additif dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts)
- ajout des tests [**tests**/attempt-response.test.ts](./__tests__/attempt-response.test.ts)
- enrichissement des tests [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour les signaux mock
- creation du helper e2e [e2e/test-helpers.ts](./e2e/test-helpers.ts) pour completer une session structuree
- ajout de la spec [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) pour couvrir fin de mock et historique
- recalibrage de [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts) avec garde-fou de couverture par question et diversite de difficulte
- enrichissement de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour alimenter `SkillProgress` avec le `questionId`
- extension des tests [**tests**/skill-progress.test.ts](./__tests__/skill-progress.test.ts) avec verification du cap de couverture
- ajout de l'enum `ContentStatus` et migration des statuts contenu dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql](./prisma/migrations/20260307143000_content_status_and_pitfall_tags/migration.sql)
- ajout des modeles `PitfallTag` et `QuestionPitfallTag` dans [prisma/schema.prisma](./prisma/schema.prisma)
- branchement du seed sur les premiers pitfall tags dans [prisma/seed.ts](./prisma/seed.ts)
- filtrage du repository contenu sur le contenu `PUBLISHED` dans [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- alignement du session builder sur `ContentStatus.PUBLISHED` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts)
- mise a jour des tests de contenu et dashboard dans [**tests**/content-repository.test.ts](./__tests__/content-repository.test.ts) et [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts)

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
- extension de la couverture dans [**tests**/attempt-response.test.ts](./__tests__/attempt-response.test.ts), [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts) et [e2e/practice.spec.ts](./e2e/practice.spec.ts)
- ajout du champ `QuestionTranslation.contextData` dans [prisma/schema.prisma](./prisma/schema.prisma) et de la migration [prisma/migrations/20260307201500_question_translation_context_data/migration.sql](./prisma/migrations/20260307201500_question_translation_context_data/migration.sql) pour porter les snippets structures de `BUG_HUNT`
- creation du parseur partage [src/lib/question-context.ts](./src/lib/question-context.ts) et exposition du `contextData` localise depuis [src/lib/content-repository.ts](./src/lib/content-repository.ts)
- extension du player a `BUG_HUNT` dans [src/features/sessions/session-player-renderers.tsx](./src/features/sessions/session-player-renderers.tsx), [src/features/sessions/session-player.tsx](./src/features/sessions/session-player.tsx) et [src/features/sessions/attempt-response.ts](./src/features/sessions/attempt-response.ts)
- ouverture du builder practice a `BUG_HUNT` dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) et ajout du module seed [prisma/seed.ts](./prisma/seed.ts) pour `react-bug-hunt-lab`
- ajout de la server action de verdict manuel dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) avec rescoring de session et progression apres review
- enrichissement du read model dashboard avec la file `pendingReviewItems` dans [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) et branchement de la review manuelle dans [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx)
- extension des messages FR/EN review/session dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour `BUG_HUNT` et les verdicts manuels
- extension des tests [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) et [e2e/practice.spec.ts](./e2e/practice.spec.ts) pour couvrir `BUG_HUNT`, pending review et verdict manuel
- ajout des champs `coverageCount`, `uniqueQuestionCount`, `uniqueDifficultyCount`, `recentFailureCount`, `confidenceScore` et `lastAttemptAt` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307213000_skill_progress_signal_fields/migration.sql](./prisma/migrations/20260307213000_skill_progress_signal_fields/migration.sql)
- recalibrage de [src/features/sessions/skill-progress.ts](./src/features/sessions/skill-progress.ts) avec stale signal penalty, confidence score et persistance des nouveaux signaux
- enrichissement de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour stocker ces signaux dans `SkillProgress`
- enrichissement du read model [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) pour exposer les diagnostics de skill au dashboard
- enrichissement de [src/app/dashboard/progress/page.tsx](./src/app/dashboard/progress/page.tsx) avec badges de confiance, couverture, echecs recents et date du dernier signal
- extension des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour les diagnostics `SkillProgress`
- extension des tests [**tests**/skill-progress.test.ts](./__tests__/skill-progress.test.ts) et [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour verrouiller le nouveau contrat
- ajout des champs `reviewCount`, `lapseCount` et `lastOutcomeCorrect` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307224500_question_progress_review_signals/migration.sql](./prisma/migrations/20260307224500_question_progress_review_signals/migration.sql)
- refonte de [src/features/sessions/session-progress.ts](./src/features/sessions/session-progress.ts) pour mieux distinguer apprentissage, consolidation, maintien, rechute et reussite overdue
- enrichissement de la priorisation review dans [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) avec les nouveaux signaux de rechute et d'historique recent
- enrichissement de [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) avec les raisons `mockFallout` et `weakSkill`
- extension des labels FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour les nouvelles raisons de review
- extension des tests [**tests**/session-progress.test.ts](./__tests__/session-progress.test.ts), [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts) et [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour verrouiller `QuestionProgress` v2 et la queue review enrichie
- ajout de cibles de formats par template mock dans [src/features/sessions/session-contract.ts](./src/features/sessions/session-contract.ts)
- extension de [src/features/sessions/session-builder.ts](./src/features/sessions/session-builder.ts) pour composer des mocks mixed-format avec formats fermes, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT`
- enrichissement de [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts), [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) et [src/features/sessions/session-timing.ts](./src/features/sessions/session-timing.ts) pour distinguer `pending_review`, `gradedCount`, `pendingCount` et la pression mock sous evaluation partielle
- enrichissement de [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) et des messages [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts) pour exposer les etats `pending_review` dans le rapport mock
- extension des tests [**tests**/session-builder.test.ts](./__tests__/session-builder.test.ts), [**tests**/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) et [**tests**/session-timing.test.ts](./__tests__/session-timing.test.ts) pour verrouiller le slice mixed-format mock
- durcissement de [e2e/mock-interviews.spec.ts](./e2e/mock-interviews.spec.ts) pour accepter le comportement reel du flux mock, avec transition via feedback intermediaire ou passage direct a l'etape suivante
- suppression de l'invalidation eager de la route session dans [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pendant l'enregistrement d'une tentative
- creation du helper partage [src/features/sessions/session-rubric.ts](./src/features/sessions/session-rubric.ts) pour derivation des criteres de review selon le format de question
- enrichissement de [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts), [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx) avec rubrics, points a verifier et criteres de lecture sur les formats ouverts
- extension des tests [**tests**/session-rubric.test.ts](./__tests__/session-rubric.test.ts), [**tests**/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) et [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts) pour verrouiller cette premiere couche de rubric
- ajout des champs `Attempt.reviewData` et `Attempt.reviewedAt` dans [prisma/schema.prisma](./prisma/schema.prisma) et [prisma/migrations/20260307233000_attempt_review_data/migration.sql](./prisma/migrations/20260307233000_attempt_review_data/migration.sql)
- creation du helper [src/features/sessions/attempt-review.ts](./src/features/sessions/attempt-review.ts) pour construire, parser et scorer les reviews structurees par critere
- refonte de [src/features/sessions/session.action.ts](./src/features/sessions/session.action.ts) pour enregistrer une review structuree, recalculer `isCorrect` via seuil et rescorrer les sessions mock sur une moyenne de `scorePercent`
- enrichissement de [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts) et [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts) pour propager les `scorePercent` manuels jusque dans le rapport mock
- remplacement de la review binaire par un formulaire de rubric avec quick presets dans [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et extension des messages FR/EN dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) / [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout des tests [**tests**/attempt-review.test.ts](./__tests__/attempt-review.test.ts) et extension de [**tests**/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) pour verrouiller le rescoring des formats ouverts
- enrichissement de [src/app/dashboard/mock-interviews/page.tsx](./src/app/dashboard/mock-interviews/page.tsx) et [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) pour exposer une carte de friction par critere a partir des reviews structurees mock
- creation du slice bookmarks produit avec [src/features/bookmarks/bookmark.action.ts](./src/features/bookmarks/bookmark.action.ts), [src/features/bookmarks/bookmark-read-model.ts](./src/features/bookmarks/bookmark-read-model.ts), [src/features/bookmarks/bookmark-toggle-form.tsx](./src/features/bookmarks/bookmark-toggle-form.tsx) et la route [src/app/dashboard/bookmarks/page.tsx](./src/app/dashboard/bookmarks/page.tsx)
- branchement des toggles bookmarks dans [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx), avec propagation `isBookmarked` jusque dans [src/features/sessions/session-mock-report.ts](./src/features/sessions/session-mock-report.ts)
- extension du shell dashboard et des messages FR/EN pour la navigation bookmarks dans [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx), [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout du test [**tests**/bookmark-read-model.test.ts](./__tests__/bookmark-read-model.test.ts) et extension des tests [**tests**/dashboard-read-model.test.ts](./__tests__/dashboard-read-model.test.ts), [**tests**/session-mock-report.test.ts](./__tests__/session-mock-report.test.ts) et [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) pour verrouiller les bookmarks et l'analytics par critere
- creation du slice notes avec [src/features/notes/note.action.ts](./src/features/notes/note.action.ts), [src/features/notes/note-editor-form.tsx](./src/features/notes/note-editor-form.tsx) et [src/features/notes/note-read-model.ts](./src/features/notes/note-read-model.ts)
- creation de la recap [src/app/dashboard/notes/page.tsx](./src/app/dashboard/notes/page.tsx) et extension du shell dashboard dans [src/features/dashboard/dashboard-shell.tsx](./src/features/dashboard/dashboard-shell.tsx)
- branchement des notes dans [src/app/dashboard/bookmarks/page.tsx](./src/app/dashboard/bookmarks/page.tsx), [src/app/dashboard/review/page.tsx](./src/app/dashboard/review/page.tsx) et [src/app/dashboard/session/[id]/page.tsx](./src/app/dashboard/session/[id]/page.tsx), avec propagation depuis [src/features/bookmarks/bookmark-read-model.ts](./src/features/bookmarks/bookmark-read-model.ts), [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts) et [src/features/sessions/session-view.ts](./src/features/sessions/session-view.ts)
- extension des messages FR/EN pour la surface notes dans [src/i18n/messages/fr.ts](./src/i18n/messages/fr.ts) et [src/i18n/messages/en.ts](./src/i18n/messages/en.ts)
- ajout du test [**tests**/note-read-model.test.ts](./__tests__/note-read-model.test.ts) et extension de [e2e/dashboard.spec.ts](./e2e/dashboard.spec.ts) pour verrouiller la persistance d'une note via bookmarks

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
