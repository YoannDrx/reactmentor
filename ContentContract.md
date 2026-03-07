# React Mentor Content Contract

Derniere mise a jour: 6 mars 2026

Statut: source officielle pour `L0-03`

## 1. Role du document

Ce document fixe le contrat editorial minimal pour les entites de contenu de React Mentor.

Il doit servir de reference pour:

- schema Prisma
- seed
- admin
- import/export
- checklist de publication

## 2. Principes

Le contenu React Mentor doit toujours viser:

- precision
- profondeur
- pedagogie
- utilite entretien
- qualite bilingue

Une question n'est pas "publiee" parce qu'elle a une bonne reponse.
Elle n'est publiable que si la correction aide vraiment un utilisateur a progresser.

## 3. Contrat module

Chaque module doit avoir:

- `slug`
- `track`
- `level`
- `order`
- `status`
- traduction FR
- traduction EN

Chaque traduction de module doit contenir:

- `title`
- `description`
- `summary`

Champs optionnels recommandes:

- `goals`
- `prerequisites`
- `commonMistakes`

## 4. Contrat skill

Chaque skill doit avoir:

- `slug`
- `moduleId`
- `status` si necessaire
- traduction FR
- traduction EN

Chaque traduction de skill doit contenir:

- `title`
- `description`

## 5. Contrat question

Chaque question doit avoir sur l'entite racine:

- `slug`
- `moduleId`
- `primarySkillId`
- `format`
- `level`
- `difficulty`
- `status`

Champs metier racine facultatifs selon besoin:

- `estimatedTimeSec`
- `sourceType`
- `version`

Chaque question doit avoir une traduction FR et une traduction EN pour etre consideree complete.

Chaque traduction de question doit contenir:

- `prompt`
- `explanation`
- `takeaways`

Champs fortement recommandes:

- `context`
- `interviewSignal`
- `verbalizePoints`
- `miniExample`
- `edgeCases`

## 6. Contrat options

Pour les questions fermees, chaque option doit exister sur l'entite racine avec:

- `questionId`
- `order`
- `isCorrect`

Chaque traduction d'option doit contenir:

- `label`
- `explanation`

Regle:

- toute option incorrecte doit avoir une vraie explication
- "parce que c'est faux" n'est jamais acceptable

## 7. Contrat pitfall tags

Chaque question peut etre liee a 0..n pitfall tags.

Chaque tag doit avoir:

- `slug`
- `title`
- `description`

## 8. Question publication checklist

Une question ne peut pas passer en `PUBLISHED` si l'un des points ci-dessous manque:

- module renseigne
- skill principale renseignee
- format renseigne
- niveau renseigne
- difficulte renseignee
- prompt FR renseigne
- prompt EN renseigne ou statut de traduction explicite
- explication FR renseignee
- explication EN renseignee ou statut de traduction explicite
- takeaways renseignes
- toutes les options ont une explication
- au moins une option correcte pour les formats fermes

## 9. Qualite attendue des takeaways

Regles:

- 2 a 4 takeaways maximum
- phrases courtes
- memorisables
- non redondantes

Exemple de bon takeaway:

- "React compare les deps par reference, pas par deep equality."

Exemple de mauvais takeaway:

- "Il faut faire attention a useEffect car c'est un hook important."

## 10. Qualite attendue des explications

Une bonne explication doit contenir:

- le bon mecanisme
- la raison pour laquelle la bonne reponse est correcte
- la raison pour laquelle les mauvaises reponses seduisent
- le point a verbaliser en entretien

Une explication faible ressemble a:

- une paraphrase de la bonne reponse
- un texte trop court
- un texte sans mecanisme
- un texte sans contraste avec les distracteurs

## 11. Bilingue

Regles:

- le contenu pedagogique doit etre pense des le debut en FR/EN
- on ne laisse pas volontairement une langue comme citoyen de seconde zone
- si une traduction n'existe pas encore, son statut doit etre visible

## 12. Rich content

Decision v1:

- les textes peuvent rester simples au depart
- mais le schema doit preparer l'evolution vers markdown ou rich content structure

Conclusion:

- les services et l'admin ne doivent pas supposer que `prompt` et `explanation` resteront de simples strings pour toujours

## 13. Decision lot 0

`L0-03 - Definir le contrat editorial d'une question`

Statut: `DONE`

Decision:

- les champs obligatoires sont fixes
- les exigences de correction sont explicites
- la checklist de publication est definie
- le bilingue est impose au niveau contrat
