# React Mentor Admin Content Contract v1

Derniere mise a jour: 8 mars 2026

## 1. Role du document

Ce document fixe le perimetre minimal du back-office contenu v1.

Il doit servir de reference pour:

- RBAC
- routes dashboard admin
- server actions de creation contenu
- controles de publication v1
- prochaines extensions Lot 10

## 2. Roles v1

Roles autorises:

- `admin`
- `editor`

Regles:

- les routes `/dashboard/admin` sont reservees a ces roles
- les server actions admin doivent verifier le role avant toute mutation
- les autres utilisateurs sont rediriges vers `/dashboard`

## 3. Surface v1

La surface admin v1 couvre:

- un dashboard editorial minimal dans `/dashboard/admin`
- un quality dashboard editorial compact pour les trous de traduction, la couverture par format/track et les questions sans pitfall tags
- la creation et l'edition de modules bilingues
- la creation et l'edition de skills bilingues
- la creation et l'edition de pitfall tags
- la creation et l'edition de questions `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_ENDED`, `CODE_OUTPUT` et `BUG_HUNT`
- le rattachement des pitfall tags aux questions
- l'edition bilingue des options pour les questions fermees tant qu'aucune tentative n'existe encore
- la mise a jour du statut editorial des modules, skills et questions
- la visualisation des statuts de traduction FR/EN
- le filtrage editorial recent par statut et format de question
- une checklist de publication minimale pour les questions
- l'import/export JSON seed-compatible en mode upsert-only

## 4. Ce qui reste hors scope en v1

Pas encore couvert:

- edition fine des traductions par locale avec onglets dedies
- versioning editorial complet
- suppression hard-delete avec workflow de confirmation

## 5. Contrat creation module

Champs obligatoires:

- `slug`
- `track`
- `level`
- `order`
- `status`
- `titleFr`
- `descriptionFr`
- `titleEn`
- `descriptionEn`

Champs optionnels v1:

- `summaryFr`
- `summaryEn`

## 6. Contrat creation skill

Champs obligatoires:

- `moduleId`
- `slug`
- `status`
- `titleFr`
- `descriptionFr`
- `titleEn`
- `descriptionEn`

## 7. Contrat creation question v1

Formats supportes:

- `SINGLE_CHOICE`
- `MULTIPLE_CHOICE`
- `OPEN_ENDED`
- `CODE_OUTPUT`
- `BUG_HUNT`

Champs obligatoires:

- `moduleId`
- `primarySkillId`
- `slug`
- `format`
- `level`
- `difficulty`
- `status`
- `promptFr`
- `explanationFr`
- `takeawaysFr`
- `promptEn`
- `explanationEn`
- `takeawaysEn`

Champs optionnels:

- `estimatedTimeSec`
- `sourceType`
- `pitfallTagSlugs`

Champs obligatoires pour les formats fermes:

- `correctOptionIndexes`
- `optionLabelsFr`
- `optionExplanationsFr`
- `optionLabelsEn`
- `optionExplanationsEn`

## 8. Checklist publication question v1

Une question ne doit pas passer en `PUBLISHED` si l'un des points suivants manque:

- prompt FR
- explanation FR
- takeaways FR
- prompt EN
- explanation EN
- takeaways EN
- au moins 2 options si le format est ferme
- une configuration de bonne reponse valide
- au moins un distracteur si le format est ferme
- label et explanation FR sur chaque option fermee
- label et explanation EN sur chaque option fermee

## 9. Garde-fou options fermees

Si une question fermee possede deja des tentatives:

- le format ne doit plus changer
- l'edition des options est verrouillee dans l'admin v1

But:

- eviter de casser silencieusement l'historique de reponse sans strategie de versioning

## 10. Garde-fous import JSON

L'import admin v1 fonctionne en upsert-only:

- si une ligne n'est pas presente dans le JSON, elle n'est pas supprimee
- les modules, skills, pitfall tags et questions sont identifies par `slug`
- le couple `moduleSlug` / `primarySkillSlug` doit rester coherent
- une question fermee ne peut pas changer de format ni d'options si des tentatives existent deja
- une question `BUG_HUNT` ne peut pas changer de `contextData` si des tentatives existent deja

## 11. Decision v1

Le back-office minimal doit d'abord:

- ouvrir une voie editoriale concrete
- rendre visibles les ecarts de traduction
- empecher la publication de questions incompletes

Avant d'ajouter un CMS plus riche, la priorite reste:

- durcir la checklist
- couvrir les formats fermes
- ajouter l'edition detaillee des traductions et options
