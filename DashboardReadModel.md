# React Mentor Dashboard Read Model

Derniere mise a jour: 7 mars 2026

Statut: source officielle pour `L0-04`, maintenant implemente dans:

- [src/features/dashboard/dashboard-read-model.ts](./src/features/dashboard/dashboard-read-model.ts)
- [src/features/dashboard/dashboard-shell-data.ts](./src/features/dashboard/dashboard-shell-data.ts)

## 1. Role du document

Ce document definit les read models attendus pour sortir le dashboard du mode demo.

Il sert a guider:

- les services server-side
- les queries Prisma
- les pages dashboard
- les empty states
- les tests d'integration

## 2. Principes

Le dashboard doit:

- aider a agir
- montrer des signaux utiles
- expliquer les priorites
- rester lisible pour un utilisateur debutant

Le dashboard ne doit pas:

- afficher des metriques vanity sans consequence
- noyer l'utilisateur dans trop de cartes
- simuler de la progression inexistante

## 3. Read model global

Le service cible peut s'appeler:

- `getDashboardReadModel(userId, locale)`

Il doit retourner un objet compose de:

- `overview`
- `progress`
- `review`
- `modules`
- `mockInterviews`
- `settingsSnapshot`

## 4. Overview read model

### 4.1 Shape cible

`overview`

- `stats`
- `weeklyMomentum`
- `skillReadiness`
- `dueReviews`
- `recentSessions`
- `recommendedMocks`
- `recommendedNextAction`

### 4.2 `stats`

Champs:

- `questionsAnswered`
- `masteredQuestions`
- `dueToday`
- `currentReadiness`

Chaque stat doit contenir:

- `label`
- `value`
- `change`

### 4.3 `weeklyMomentum`

Champs:

- `days[]`

Chaque item:

- `dayKey`
- `score`
- `answeredCount`

Definition:

- momentum = signal simple base sur activite + reussite recente

### 4.4 `skillReadiness`

Champs:

- `skills[]`

Chaque item:

- `skillSlug`
- `skillLabel`
- `score`
- `band`

### 4.5 `dueReviews`

Champs:

- `items[]`

Chaque item:

- `questionId`
- `title`
- `skillLabel`
- `urgency`
- `reason`
- `nextReviewAt`

### 4.6 `recentSessions`

Champs:

- `items[]`

Chaque item:

- `sessionId`
- `mode`
- `title`
- `score`
- `durationMinutes`
- `summary`
- `completedAt`

### 4.7 `recommendedNextAction`

Champs:

- `type`
- `label`
- `description`
- `href`

Types recommandes:

- `review-now`
- `start-module`
- `take-mock`
- `finish-onboarding`

## 5. Progress read model

### 5.1 Shape cible

`progress`

- `masteryDistribution`
- `skillRadar`
- `weeklyTrend`
- `skillBreakdown`
- `weaknessReport`

### 5.2 `masteryDistribution`

Champs:

- `new`
- `learning`
- `reviewing`
- `mastered`

### 5.3 `skillRadar`

Chaque item:

- `skillSlug`
- `skillLabel`
- `score`

### 5.4 `skillBreakdown`

Chaque item:

- `skillSlug`
- `skillLabel`
- `score`
- `state`
- `attemptsCount`
- `recentFailureCount`

### 5.5 `weaknessReport`

Chaque item:

- `pitfallTag`
- `count`
- `summary`
- `recommendedModuleSlug`

## 6. Review read model

### 6.1 Shape cible

`review`

- `dueCount`
- `urgentCount`
- `items[]`
- `recommendedSessionConfig`

### 6.2 Review item

Chaque item:

- `questionId`
- `questionSlug`
- `title`
- `moduleSlug`
- `moduleTitle`
- `skillSlug`
- `skillLabel`
- `urgency`
- `reason`
- `nextReviewAt`
- `lastAttemptAt`
- `lastResult`

### 6.3 Urgence

Valeurs recommandees:

- `critical`
- `high`
- `normal`

Regles simples v1:

- `critical` si item overdue depuis plus de 3 jours ou echecs repetes
- `high` si overdue aujourd'hui ou echec recent
- `normal` sinon

## 7. Modules read model

### 7.1 Shape cible

`modules`

- `metrics`
- `items[]`

### 7.2 Module item

Chaque item:

- `moduleSlug`
- `title`
- `summary`
- `track`
- `level`
- `status`
- `questionsCount`
- `skillsCount`
- `completionPercent`
- `masteredPercent`
- `focusSkills[]`
- `nextAction`

### 7.3 `nextAction`

Champs:

- `type`
- `label`
- `href`

Types:

- `start-practice`
- `resume-practice`
- `start-review`
- `view-details`

## 8. Mock interviews read model

### 8.1 Shape cible

`mockInterviews`

- `templates[]`
- `history[]`
- `bestAreas[]`
- `weakAreas[]`

### 8.2 Template

Chaque template:

- `templateId`
- `title`
- `description`
- `durationMinutes`
- `targetLevel`
- `composition`

### 8.3 History item

Chaque item:

- `sessionId`
- `title`
- `score`
- `durationMinutes`
- `completedAt`
- `summary`

## 9. Settings snapshot read model

### 9.1 Shape cible

`settingsSnapshot`

- `targetRole`
- `targetLevel`
- `preferredTracks`
- `weeklyGoal`
- `focusMode`
- `applicationDeadline`

## 10. Empty states

### 10.1 Nouvel utilisateur sans attempts

Affichage attendu:

- CTA pour lancer premiere session
- CTA pour finir onboarding si incomplet
- aucune metrique trompeuse

### 10.2 Utilisateur avec contenu mais sans review due

Affichage attendu:

- message positif
- suggestion de nouvelle session practice ou mock

### 10.3 Utilisateur avec peu de donnees

Affichage attendu:

- labels prudents
- pas de pseudo-readiness surevaluee

## 11. Regles de calcul v1

### 11.1 Completion module

Definition v1:

- pourcentage de questions du module ayant au moins une tentative

### 11.2 Mastered percent module

Definition v1:

- pourcentage de questions du module en `MASTERED`

### 11.3 Skill readiness

Definition v1:

- score derive de `SkillProgress`
- borne entre 0 et 100

### 11.4 Current readiness

Definition v1:

- moyenne ponderee des `SkillProgress` sur les tracks preferes

Important:

- ne pas appeler cela "interview score" trop tot
- parler plutot de `readiness` ou `signal`

## 12. Decision lot 0

`L0-04 - Definir les read models du dashboard`

Statut: `DONE`

Decision:

- les read models cibles du dashboard sont definis
- les shapes minimales sont fixees
- les empty states et regles de calcul v1 sont definis
